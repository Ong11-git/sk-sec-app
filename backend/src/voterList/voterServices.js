import prisma from "../../prisma/prisma.js";

export async function getAllVoters() {
  return await prisma.voter.findMany({
    include: {
      district: {
        select: {
          id: true,
          name: true,
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
                select: { id: true, name: true },
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
                },
              },
            },
          },
        },
      },
    },
  });
}


export const getVotersCount = async () =>{
    return await prisma.voter.count();
}

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
    voters: counts[c.id] ?? 0,   // always return 0 if no voters
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
          name: constituencyName,   // filter by name
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
      return { message: `No voters found in constituency: ${constituencyName}` };
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









