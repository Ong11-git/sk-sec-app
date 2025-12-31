import prisma from "../../prisma/prisma.js";
import cloudinary from "../config/cloudinary.js";

const pad2 = (num) => String(num).padStart(2, "0");

export async function getAllVoters() {
  return await prisma.voter.findMany({
    include: {
      district: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      constituency: {
        select: {
          id: true,
          constituencyNo: true,
          name: true,
          districts: {
            include: {
              district: {
                select: { id: true, name: true, code: true },
              },
            },
          },
        },
      },
      tc: {
        select: {
          id: true,
          tc_no: true,
          tc_name: true,
          constituency: {
            select: {
              id: true,
              constituencyNo: true,
              name: true,
            },
          },
        },
      },
      gpu: {
        select: {
          id: true,
          gpu_no: true,
          gpu_name: true,
          tc: {
            select: {
              id: true,
              tc_no: true,
              tc_name: true,
              constituency: {
                select: {
                  id: true,
                  constituencyNo: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      ward: {
        select: {
          id: true,
          ward_no: true,
          ward_name: true,
          gpu: {
            select: {
              id: true,
              gpu_no: true,
              gpu_name: true,
              tc: {
                select: {
                  id: true,
                  tc_no: true,
                  tc_name: true,
                  constituency: {
                    select: {
                      id: true,
                      constituencyNo: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      municipality: {
        select: {
          id: true,
          name: true,
          constituency: {
            select: {
              id: true,
              constituencyNo: true,
              name: true,
            },
          },
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      municipalWard: {
        select: {
          id: true,
          ward_no: true,
          name: true,
          municipality: {
            select: {
              id: true,
              name: true,
              constituency: {
                select: {
                  id: true,
                  constituencyNo: true,
                  name: true,
                },
              },
              district: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export const getVotersCount = async () => {
  return await prisma.voter.count();
};

// ✅ New: Calculate average voter age
export const getAverageVoterAge = async () => {
  const result = await prisma.voter.aggregate({
    _avg: {
      age: true,
    },
  });
  return result._avg.age || 0; // return 0 if no voters
};

// ✅ New: District-wise voter count
export const getDistrictWiseVoterCount = async () => {
  // 1. Get all districts
  const allDistricts = await prisma.district.findMany({
    select: { id: true, name: true },
  });

  // 2. Get counts only where voters exist
  const voterCounts = await prisma.voter.groupBy({
    by: ["districtId"],
    _count: { id: true },
  });

  // 3. Merge results
  const merged = allDistricts.map((district) => {
    const found = voterCounts.find((vc) => vc.districtId === district.id);
    return {
      district: district.name,
      voters: found ? found._count.id : 0,
    };
  });

  // 4. Sort by voters count (desc)
  return merged.sort((a, b) => b.voters - a.voters);
};

export const getAgeGroupDistribution = async () => {
  // Fetch all voters' ages
  const voters = await prisma.voter.findMany({
    select: { age: true },
  });

  // Define age groups
  const groups = [
    { label: "18-25", min: 18, max: 25 },
    { label: "26-35", min: 26, max: 35 },
    { label: "36-45", min: 36, max: 45 },
    { label: "46-60", min: 46, max: 60 },
    { label: "60+", min: 61, max: Infinity },
  ];

  // Initialize counts
  const counts = groups.map((g) => ({ ageGroup: g.label, voters: 0 }));

  // Count voters per group
  for (const voter of voters) {
    if (voter.age) {
      const group = groups.find(
        (g) => voter.age >= g.min && voter.age <= g.max
      );
      if (group) {
        counts.find((c) => c.ageGroup === group.label).voters++;
      }
    }
  }

  return counts;
};

export const getGenderDistribution = async () => {
  const genders = [
    { db: "M", label: "Male" },
    { db: "F", label: "Female" },
    { db: "O", label: "Other" },
  ];

  const results = [];

  for (const g of genders) {
    const count = await prisma.voter.count({
      where: { gender: g.db },
    });

    results.push({
      gender: g.label,
      count: count || 0, // ✅ ensure 0 if no voters
    });
  }

  return results;
};

export const getConstituencyWiseVoterCount = async () => {
  // Get all constituencies (ids + names)
  const constituencies = await prisma.constituency.findMany({
    select: { id: true, name: true },
  });

  // Group voters by constituencyId (integer FK)
  const grouped = await prisma.voter.groupBy({
    by: ["constituencyId"],
    _count: { id: true },
  });

  // Build lookup: { constituencyId -> voterCount }
  const counts = Object.fromEntries(
    grouped.map((g) => [g.constituencyId, g._count.id])
  );

  // Merge constituencies with voter counts
  return constituencies.map((c) => ({
    constituencyId: c.id,
    constituency: c.name,
    voters: counts[c.id] ?? 0, // always return 0 if no voters
  }));
};

export const getVoterLastNames = async () => {
  const voters = await prisma.voter.findMany({
    select: {
      name: true,
      relationName: true,
    },
  });

  const lastNameCounts = {};

  for (const voter of voters) {
    let lastName = null;

    // 1️⃣ Extract from voter.name
    if (voter.name) {
      const parts = voter.name.trim().split(/\s+/);
      if (parts.length > 1) {
        lastName = parts[parts.length - 1].toUpperCase();
      }
    }

    // 2️⃣ Fallback to relationName
    if (!lastName && voter.relationName) {
      const relationParts = voter.relationName.trim().split(/\s+/);
      if (relationParts.length > 1) {
        lastName = relationParts[relationParts.length - 1].toUpperCase();
      }
    }

    // 3️⃣ Default if still missing
    if (!lastName) lastName = "UNKNOWN";

    // Count occurrences
    lastNameCounts[lastName] = (lastNameCounts[lastName] || 0) + 1;
  }

  // Convert object to array
  return Object.entries(lastNameCounts).map(([lastName, count]) => ({
    lastName,
    count,
  }));
};

// export async function getAllConstituencies() {
//   try {
//     return await prisma.constituency.findMany({
//       select: {
//         id: true,
//         name: true,
//       },
//       orderBy: { name: "asc" },
//     });
//   } catch (error) {
//     console.error("Error fetching constituencies:", error.message);
//     throw new Error("Failed to fetch constituencies");
//   }
// }

export async function getVotersByConstituency(constituencyName) {
  try {
    // ✅ Fetch all voters with constituency relation
    const voters = await prisma.voter.findMany({
      where: {
        constituency: {
          name: constituencyName, // filter by name
        },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        constituency: { select: { name: true } },
      },
    });

    if (!voters || voters.length === 0) {
      return {
        message: `No voters found in constituency: ${constituencyName}`,
      };
    }

    // ✅ Total voters
    const totalVoters = voters.length;

    // ✅ Gender-wise counts
    const genderCounts = voters.reduce((acc, v) => {
      const g = v.gender ? v.gender.toUpperCase() : "UNKNOWN";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // ✅ Last name/community-wise counts (like your old function)
    const communityCounts = {};
    for (const voter of voters) {
      let lastName = null;

      if (voter.name) {
        const parts = voter.name.trim().split(/\s+/);
        if (parts.length > 1) {
          lastName = parts[parts.length - 1].toUpperCase();
        }
      }

      if (!lastName) lastName = "UNKNOWN";
      communityCounts[lastName] = (communityCounts[lastName] || 0) + 1;
    }

    return {
      constituency: constituencyName,
      totalVoters,
      genderCounts,
      communityCounts,
    };
  } catch (error) {
    console.error("Error fetching voters by constituency:", error.message);
    throw new Error("Failed to fetch constituency-wise voters");
  }
}

export async function getVotersByDistrict(districtName) {
  try {
    // ✅ Fetch voters filtered by district name
    const voters = await prisma.voter.findMany({
      where: {
        district: {
          name: districtName, // filter by district name
        },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        district: { select: { name: true } },
      },
    });

    if (!voters || voters.length === 0) {
      return { message: `No voters found in district: ${districtName}` };
    }

    // ✅ Total voters
    const totalVoters = voters.length;

    // ✅ Gender-wise counts
    const genderCounts = voters.reduce((acc, v) => {
      const g = v.gender ? v.gender.toUpperCase() : "UNKNOWN";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // ✅ Last name/community-wise counts
    const communityCounts = {};
    for (const voter of voters) {
      let lastName = null;

      if (voter.name) {
        const parts = voter.name.trim().split(/\s+/);
        if (parts.length > 1) {
          lastName = parts[parts.length - 1].toUpperCase();
        }
      }

      if (!lastName) lastName = "UNKNOWN";
      communityCounts[lastName] = (communityCounts[lastName] || 0) + 1;
    }

    return {
      district: districtName,
      totalVoters,
      genderCounts,
      communityCounts,
    };
  } catch (error) {
    console.error("Error fetching voters by district:", error.message);
    throw new Error("Failed to fetch district-wise voters");
  }
}

export async function getVotersByTc(tcName) {
  try {
    // ✅ Fetch voters filtered by tcName (string field)
    const voters = await prisma.voter.findMany({
      where: {
        tcName: tcName, // filter by TC name
      },
      select: {
        id: true,
        name: true,
        gender: true,
        tcName: true,
      },
    });

    if (!voters || voters.length === 0) {
      return { message: `No voters found in TC: ${tcName}` };
    }

    // ✅ Total voters
    const totalVoters = voters.length;

    // ✅ Gender-wise counts
    const genderCounts = voters.reduce((acc, v) => {
      const g = v.gender ? v.gender.toUpperCase() : "UNKNOWN";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // ✅ Last name/community-wise counts
    const communityCounts = {};
    for (const voter of voters) {
      let lastName = null;

      if (voter.name) {
        const parts = voter.name.trim().split(/\s+/);
        if (parts.length > 1) {
          lastName = parts[parts.length - 1].toUpperCase();
        }
      }

      if (!lastName) lastName = "UNKNOWN";
      communityCounts[lastName] = (communityCounts[lastName] || 0) + 1;
    }

    return {
      tc: tcName,
      totalVoters,
      genderCounts,
      communityCounts,
    };
  } catch (error) {
    console.error("Error fetching voters by TC:", error.message);
    throw new Error("Failed to fetch TC-wise voters");
  }
}

export async function getVotersByGpu(gpuName) {
  try {
    // ✅ Fetch voters filtered by gpuName
    const voters = await prisma.voter.findMany({
      where: {
        gpuName: gpuName, // filter by GPU name
      },
      select: {
        id: true,
        name: true,
        gender: true,
        gpuName: true,
      },
    });

    if (!voters || voters.length === 0) {
      return { message: `No voters found in GPU: ${gpuName}` };
    }

    // ✅ Total voters
    const totalVoters = voters.length;

    // ✅ Gender-wise counts
    const genderCounts = voters.reduce((acc, v) => {
      const g = v.gender ? v.gender.toUpperCase() : "UNKNOWN";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // ✅ Last name / community-wise counts
    const communityCounts = {};
    for (const voter of voters) {
      let lastName = null;

      if (voter.name) {
        const parts = voter.name.trim().split(/\s+/);
        if (parts.length > 1) {
          lastName = parts[parts.length - 1].toUpperCase();
        }
      }

      if (!lastName) lastName = "UNKNOWN";
      communityCounts[lastName] = (communityCounts[lastName] || 0) + 1;
    }

    return {
      gpu: gpuName,
      totalVoters,
      genderCounts,
      communityCounts,
    };
  } catch (error) {
    console.error("Error fetching voters by GPU:", error.message);
    throw new Error("Failed to fetch GPU-wise voters");
  }
}

/**
 * Get voter by ID
 */
export async function getVoterById(id) {
  const voter = await prisma.voter.findUnique({
    where: { id: Number(id) },
    include: {
      district: true,
      constituency: true,
      municipality: true,
      municipalWard: true,
      tc: true,
      gpu: true,
      ward: true,
    },
  });

  if (!voter) {
    throw new Error("Voter not found");
  }

  return voter;
}

/**
 * Create voter
 */
export async function createVoter(data) {
  try {
    const {
      epicNo,
      stateEpicNo,
      name,
      relationType,
      relationName,
      age,
      gender,
      casteCategory,
      country,
      state,
      districtId,

      constituencyId,
      tcId,
      gpuId,
      wardId,
      municipalityId,
      municipalWardId,
      photo,
      photoPublicId,
    } = data;

    // -----------------------------
    // Required fields validation
    // -----------------------------
    if (
      !epicNo ||
      !name ||
      !districtId ||
      !relationType ||
      !relationName ||
      age === undefined ||
      !gender ||
      !casteCategory ||
      !country ||
      !state
    ) {
      throw new Error("All the required fields must be provided");
    }

    // -----------------------------
    // Type normalization (IMPORTANT)
    // -----------------------------
    const parsedAge = age !== null ? Number(age) : null;
    const parsedDistrictId = Number(districtId);
    const parsedConstituencyId = constituencyId ? Number(constituencyId) : null;
    const parsedTcId = tcId ? Number(tcId) : null;
    const parsedGpuId = gpuId ? Number(gpuId) : null;
    const parsedWardId = wardId ? Number(wardId) : null;
    const parsedMunicipalityId = municipalityId ? Number(municipalityId) : null;
    const parsedMunicipalWardId = municipalWardId
      ? Number(municipalWardId)
      : null;

    // Validate number conversions
    if (parsedAge !== null && Number.isNaN(parsedAge)) {
      throw new Error("Age must be a valid number");
    }

    // -----------------------------
    // EPIC / State EPIC uniqueness
    // -----------------------------
    const existingVoter = await prisma.voter.findFirst({
      where: {
        OR: [{ epicNo }, ...(stateEpicNo ? [{ stateEpicNo }] : [])],
      },
    });

    if (existingVoter) {
      throw new Error(
        "Voter already exists with same EPIC or State EPIC number"
      );
    }

    // -----------------------------
    // Foreign key existence checks
    // -----------------------------
    const district = await prisma.district.findUnique({
      where: { id: parsedDistrictId },
    });

    if (!district) {
      throw new Error("Invalid districtId");
    }

    if (parsedConstituencyId) {
      const exists = await prisma.constituency.findUnique({
        where: { id: parsedConstituencyId },
      });
      if (!exists) throw new Error("Invalid constituencyId");
    }

    if (parsedTcId) {
      const exists = await prisma.tc.findUnique({
        where: { id: parsedTcId },
      });
      if (!exists) throw new Error("Invalid tcId");
    }

    if (parsedGpuId) {
      const exists = await prisma.gpu.findUnique({
        where: { id: parsedGpuId },
      });
      if (!exists) throw new Error("Invalid gpuId");
    }

    if (parsedWardId) {
      const exists = await prisma.ward.findUnique({
        where: { id: parsedWardId },
      });
      if (!exists) throw new Error("Invalid wardId");
    }

    if (parsedMunicipalityId) {
      const exists = await prisma.municipality.findUnique({
        where: { id: parsedMunicipalityId },
      });
      if (!exists) throw new Error("Invalid municipalityId");
    }

    if (parsedMunicipalWardId) {
      const exists = await prisma.municipalWard.findUnique({
        where: { id: parsedMunicipalWardId },
      });
      if (!exists) throw new Error("Invalid municipalWardId");
    }

    // -----------------------------
    // Create voter
    // -----------------------------
    const voter = await prisma.voter.create({
      data: {
        epicNo,
        stateEpicNo,
        photo,
        photoPublicId,
        name,
        relationType,
        relationName,
        age: parsedAge,
        gender,
        casteCategory,
        country,
        state,

        district: {
          connect: { id: parsedDistrictId },
        },

        ...(parsedConstituencyId && {
          constituency: { connect: { id: parsedConstituencyId } },
        }),

        ...(parsedTcId && {
          tc: { connect: { id: parsedTcId } },
        }),

        ...(parsedGpuId && {
          gpu: { connect: { id: parsedGpuId } },
        }),

        ...(parsedWardId && {
          ward: { connect: { id: parsedWardId } },
        }),

        ...(parsedMunicipalityId && {
          municipality: { connect: { id: parsedMunicipalityId } },
        }),

        ...(parsedMunicipalWardId && {
          municipalWard: { connect: { id: parsedMunicipalWardId } },
        }),
      },
    });

    return voter;
  } catch (error) {
    console.error("Error creating voter:", error.message);
    throw new Error(error.message || "Failed to create voter");
  }
}

// export async function createVoter(data) {
//   try {
//     const {
//       epicNo,
//       stateEpicNo,
//       name,
//       relationType,
//       relationName,
//       age,
//       gender,
//       casteCategory,
//       country,
//       state,
//       districtId,

//       constituencyId,
//       tcId,
//       gpuId,
//       wardId,
//       municipalityId,
//       municipalWardId,
//       photo,
//     } = data;

//     // -----------------------------
//     // Required fields validation
//     // -----------------------------
//     if (
//       !epicNo ||
//       !name ||
//       !districtId ||
//       !relationType ||
//       !relationName ||
//       !age ||
//       !gender ||
//       !casteCategory ||
//       !country ||
//       !state ||
//       !districtId
//     ) {
//       throw new Error("All the required fields must be provided");
//     }

//     // -----------------------------
//     // EPIC / State EPIC uniqueness
//     // -----------------------------
//     const existingVoter = await prisma.voter.findFirst({
//       where: {
//         OR: [{ epicNo }, ...(stateEpicNo ? [{ stateEpicNo }] : [])],
//       },
//     });

//     if (existingVoter) {
//       throw new Error(
//         "Voter already exists with same EPIC or State EPIC number"
//       );
//     }

//     // -----------------------------
//     // Foreign key existence checks
//     // -----------------------------
//     const district = await prisma.district.findUnique({
//       where: { id: Number(districtId) },
//     });

//     if (!district) {
//       throw new Error("Invalid districtId");
//     }

//     if (constituencyId) {
//       const exists = await prisma.constituency.findUnique({
//         where: { id: Number(constituencyId) },
//       });
//       if (!exists) throw new Error("Invalid constituencyId");
//     }

//     if (tcId) {
//       const exists = await prisma.tc.findUnique({
//         where: { id: Number(tcId) },
//       });
//       if (!exists) throw new Error("Invalid tcId");
//     }

//     if (gpuId) {
//       const exists = await prisma.gpu.findUnique({
//         where: { id: Number(gpuId) },
//       });
//       if (!exists) throw new Error("Invalid gpuId");
//     }

//     if (wardId) {
//       const exists = await prisma.ward.findUnique({
//         where: { id: Number(wardId) },
//       });
//       if (!exists) throw new Error("Invalid wardId");
//     }

//     if (municipalityId) {
//       const exists = await prisma.municipality.findUnique({
//         where: { id: Number(municipalityId) },
//       });
//       if (!exists) throw new Error("Invalid municipalityId");
//     }

//     if (municipalWardId) {
//       const exists = await prisma.municipalWard.findUnique({
//         where: { id: Number(municipalWardId) },
//       });
//       if (!exists) throw new Error("Invalid municipalWardId");
//     }

//     // -----------------------------
//     // Create voter
//     // -----------------------------
//     const voter = await prisma.voter.create({
//       data: {
//         epicNo,
//         stateEpicNo,
//         photo,
//         name,
//         relationType,
//         relationName,
//         age,
//         gender,
//         casteCategory,
//         country,
//         state,

//         district: {
//           connect: { id: Number(districtId) },
//         },

//         ...(constituencyId && {
//           constituency: { connect: { id: Number(constituencyId) } },
//         }),

//         ...(tcId && {
//           tc: { connect: { id: Number(tcId) } },
//         }),

//         ...(gpuId && {
//           gpu: { connect: { id: Number(gpuId) } },
//         }),

//         ...(wardId && {
//           ward: { connect: { id: Number(wardId) } },
//         }),

//         ...(municipalityId && {
//           municipality: { connect: { id: Number(municipalityId) } },
//         }),

//         ...(municipalWardId && {
//           municipalWard: { connect: { id: Number(municipalWardId) } },
//         }),
//       },
//     });

//     return voter;
//   } catch (error) {
//     console.error("Error creating voter:", error.message);
//     throw new Error(error.message || "Failed to create voter");
//   }
// }

/**
 * Update voter by ID
 */

export async function updateVoter(id, data) {
  try {
    const voterId = Number(id);

    const voter = await prisma.voter.findUnique({
      where: { id: voterId },
    });

    if (!voter) {
      throw new Error("Voter not found");
    }
    console.log("Updating voter with data:", data);

    // Required field validations (only if present)
    if ("epicNo" in data && !data.epicNo) {
      throw new Error("epicNo cannot be empty");
    }

    if ("name" in data && !data.name) {
      throw new Error("name cannot be empty");
    }

    if ("districtId" in data && !data.districtId) {
      throw new Error("districtId cannot be empty");
    }

    // Uniqueness check
    if (data.epicNo || data.stateEpicNo) {
      const exists = await prisma.voter.findFirst({
        where: {
          id: { not: voterId },
          OR: [
            ...(data.epicNo ? [{ epicNo: data.epicNo }] : []),
            ...(data.stateEpicNo ? [{ stateEpicNo: data.stateEpicNo }] : []),
          ],
        },
      });

      if (exists) {
        throw new Error(
          "Another voter already exists with the same EPIC or State EPIC number"
        );
      }
    }

    await validateForeignKeys(data);

    return await prisma.voter.update({
      where: { id: voterId },
      data: {
        epicNo: data.epicNo,
        stateEpicNo: data.stateEpicNo,
        name: data.name,

        ...(data.districtId && {
          district: { connect: { id: Number(data.districtId) } },
        }),

        ...mapOptionalRelations(data),
      },
    });
  } catch (error) {
    throw new Error(error.message || "Failed to update voter");
  }
}

// export async function updateVoter(id, data) {
//   try {
//     const voterId = Number(id);

//     // Check voter exists
//     const voter = await prisma.voter.findUnique({
//       where: { id: voterId },
//     });

//     if (!voter) {
//       throw new Error("Voter not found");
//     }

//     // Prevent updating deleted voter
//     // if (voter.status === "deleted") {
//     //   throw new Error("Cannot update a deleted voter");
//     // }

//     // Validate required fields if provided
//     if ("epicNo" in data && !data.epicNo) {
//       throw new Error("epicNo cannot be empty");
//     }

//     if ("name" in data && !data.name) {
//       throw new Error("name cannot be empty");
//     }

//     if ("districtId" in data && !data.districtId) {
//       throw new Error("districtId cannot be empty");
//     }

//     // Uniqueness checks (exclude current voter)
//     if (data.epicNo || data.stateEpicNo) {
//       const exists = await prisma.voter.findFirst({
//         where: {
//           id: { not: voterId },
//           OR: [
//             ...(data.epicNo ? [{ epicNo: data.epicNo }] : []),
//             ...(data.stateEpicNo ? [{ stateEpicNo: data.stateEpicNo }] : []),
//           ],
//         },
//       });

//       if (exists) {
//         throw new Error(
//           "Another voter already exists with the same EPIC or State EPIC number"
//         );
//       }
//     }

//     //  Foreign key existence checks
//     await validateForeignKeys(data);

//     // 5Perform update
//     return await prisma.voter.update({
//       where: { id: voterId },
//       data: {
//         epicNo: data.epicNo,
//         stateEpicNo: data.stateEpicNo,
//         name: data.name,

//         ...(data.districtId && {
//           district: { connect: { id: Number(data.districtId) } },
//         }),

//         ...mapOptionalRelations(data),
//       },
//     });
//   } catch (error) {
//     throw new Error(error.message || "Failed to update voter");
//   }
// }

async function validateForeignKeys(data) {
  const checks = [
    data.districtId &&
      prisma.district.findUnique({ where: { id: Number(data.districtId) } }),

    data.constituencyId &&
      prisma.constituency.findUnique({
        where: { id: Number(data.constituencyId) },
      }),

    data.tcId && prisma.tc.findUnique({ where: { id: Number(data.tcId) } }),

    data.gpuId && prisma.gpu.findUnique({ where: { id: Number(data.gpuId) } }),

    data.wardId &&
      prisma.ward.findUnique({ where: { id: Number(data.wardId) } }),

    data.municipalityId &&
      prisma.municipality.findUnique({
        where: { id: Number(data.municipalityId) },
      }),

    data.municipalWardId &&
      prisma.municipalWard.findUnique({
        where: { id: Number(data.municipalWardId) },
      }),
  ].filter(Boolean);

  const results = await Promise.all(checks);

  if (results.includes(null)) {
    throw new Error("One or more related entities do not exist");
  }
}

/**
 * Soft delete voter
 */
export async function deleteVoter(id) {
  const voter = await prisma.voter.findUnique({
    where: { id: Number(id) },
  });

  if (!voter) {
    throw new Error("Voter not found");
  }

  if (voter.status === "deleted") {
    throw new Error("Voter already deleted");
  }

  return prisma.voter.update({
    where: { id: Number(id) },
    data: {
      status: "deleted",
    },
  });
}

export async function permanentlyDeleteVoter(id) {
  const voterId = Number(id);

  try {
    // Fetch voter
    const voter = await prisma.voter.findUnique({
      where: { id: voterId },
    });

    if (!voter) {
      throw new Error("Voter not found");
    }

    // Delete image from Cloudinary (if exists)
    if (voter.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(voter.photoPublicId);
      } catch (cloudErr) {
        console.error("Cloudinary deletion failed:", cloudErr.message);
        throw new Error("Failed to delete voter image");
      }
    }

    // Delete voter from database
    try {
      await prisma.voter.delete({
        where: { id: voterId },
      });
    } catch (dbErr) {
      console.error("Database deletion failed:", dbErr.message);
      throw new Error("Failed to delete voter record");
    }

    return voter;
  } catch (error) {
    console.error("Permanent delete error:", error.message);
    throw new Error(error.message || "Permanent deletion failed");
  }
}

/**
 * Helper to safely connect optional relations
 */
function mapOptionalRelations(data) {
  return {
    age: data.age,
    gender: data.gender,
    photo: data.photo,
    casteCategory: data.casteCategory,
    country: data.country,
    state: data.state,
    relationType: data.relationType,
    relationName: data.relationName,
    status: data.status,

    ...(data.constituencyId && {
      constituency: { connect: { id: Number(data.constituencyId) } },
    }),

    ...(data.tcId && {
      tc: { connect: { id: Number(data.tcId) } },
    }),

    ...(data.gpuId && {
      gpu: { connect: { id: Number(data.gpuId) } },
    }),

    ...(data.wardId && {
      ward: { connect: { id: Number(data.wardId) } },
    }),

    ...(data.municipalityId && {
      municipality: { connect: { id: Number(data.municipalityId) } },
    }),

    ...(data.municipalWardId && {
      municipalWard: { connect: { id: Number(data.municipalWardId) } },
    }),
  };
}

async function getNextVoterSerial(tx, whereClause) {
  const voters = await tx.voter.findMany({
    where: {
      ...whereClause,
      stateEpicNo: { not: null },
    },
    select: { stateEpicNo: true },
  });

  let max = 0;

  for (const v of voters) {
    const lastTwo = Number(v.stateEpicNo.slice(-2));
    if (!Number.isNaN(lastTwo)) {
      max = Math.max(max, lastTwo);
    }
  }

  return String(max + 1).padStart(2, "0");
}

export async function generateStateEpicNo(voterId) {
  return await prisma.$transaction(async (tx) => {
    const voter = await tx.voter.findUnique({
      where: { id: Number(voterId) },
      include: {
        district: true,
        constituency: true,
        tc: true,
        gpu: true,
        ward: true,
        municipality: true,
        municipalWard: true,
      },
    });

    if (!voter) throw new Error("Voter not found");

    if (voter.stateEpicNo) {
      throw new Error("State EPIC number already generated");
    }

    const districtCode = voter.district.code;
    if (!districtCode) throw new Error("District code missing");

    const constituencyNo = pad2(voter.constituency?.constituencyNo);

    let stateEpicNo = "";

    // =============================
    // RURAL PATH
    // =============================
    if (voter.wardId && voter.gpuId && voter.tcId) {
      const tcNo = pad2(voter.tc.tc_no);
      const gpuNo = pad2(voter.gpu.gpu_no);
      const wardNo = pad2(voter.ward.ward_no);

      const voterNo = await getNextVoterSerial(tx, {
        wardId: voter.wardId,
      });

      stateEpicNo = `SK${districtCode}${constituencyNo}${tcNo}${gpuNo}${wardNo}${voterNo}`;
    }

    // =============================
    // URBAN PATH
    // =============================
    else if (voter.municipalWardId && voter.municipalityId) {
      const municipalityNo = pad2(voter.municipality.municipalityNo);
      const municipalWardNo = pad2(voter.municipalWard.ward_no);

      const voterNo = await getNextVoterSerial(tx, {
        municipalWardId: voter.municipalWardId,
      });

      stateEpicNo = `SK${districtCode}${constituencyNo}${municipalityNo}00${municipalWardNo}${voterNo}`;
    } else {
      throw new Error("Invalid voter hierarchy (neither rural nor urban)");
    }

    // =============================
    // SAVE
    // =============================
    return await tx.voter.update({
      where: { id: voter.id },
      data: { stateEpicNo },
    });
  });
}
