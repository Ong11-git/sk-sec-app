import prisma from "../../prisma/prisma.js";

/**
 * Fetch ALL dashboard analytics in one place
 */
const FILTER_PRIORITY = [
  "wardId",
  "municipalWardId",
  "gpuId",
  "tcId",
  "municipalityId",
  "constituencyId",
  "districtId",
];

function resolveEffectiveFilter(query) {
  for (const key of FILTER_PRIORITY) {
    if (query[key]) {
      return { key, value: Number(query[key]) };
    }
  }
  return null;
}

function buildVoterWhere(effectiveFilter) {
  const baseWhere = {
    status: { not: "deleted" },
  };

  if (!effectiveFilter) return baseWhere;

  return {
    ...baseWhere,
    [effectiveFilter.key]: effectiveFilter.value,
  };
}

async function getTotalDistricts(filters) {
  if (filters.districtId) return 1;
  return prisma.district.count();
}

async function getTotalConstituencies(filters) {
  if (filters.districtId) {
    return prisma.constituency.count({
      where: {
        districts: {
          some: { districtId: Number(filters.districtId) },
        },
      },
    });
  }
  if (filters.constituencyId) return 1;
  return prisma.constituency.count();
}

async function getScopeName(effectiveFilter) {
  if (!effectiveFilter) return "Sikkim";

  const { key, value } = effectiveFilter;
  if (key === "districtId") {
    const district = await prisma.district.findUnique({
      where: { id: value },
      select: { name: true },
    });
    return district?.name || "Unknown District";
  }
  if (key === "constituencyId") {
    const constituency = await prisma.constituency.findUnique({
      where: { id: value },
      select: { name: true },
    });
    return constituency?.name || "Unknown Constituency";
  }
  // Add more if needed
  return "Unknown";
}

/**
 * Get filter options for cascading dropdowns
 */
export async function getFilterOptions(filters = {}) {
  try {
    const options = {};

    // Always get districts
    options.districts = await prisma.district.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    // If district is selected, get constituencies
    if (filters.districtId) {
      const district = await prisma.district.findUnique({
        where: { id: Number(filters.districtId) },
        include: {
          constituencies: {
            include: {
              constituency: true,
            },
          },
        },
      });

      options.constituencies =
        district?.constituencies.map((dc) => ({
          id: dc.constituency.id,
          name: dc.constituency.name,
          constituencyNo: dc.constituency.constituencyNo,
        })) || [];
    }

    // If constituency is selected, get municipalities and TCs
    if (filters.constituencyId) {
      // Get municipalities in this constituency
      options.municipalities = await prisma.municipality.findMany({
        where: { constituencyId: Number(filters.constituencyId) },
        select: { id: true, name: true, municipalityNo: true },
        orderBy: { name: "asc" },
      });

      // Get TCs in this constituency
      options.tcs = await prisma.tc.findMany({
        where: { constituencyId: Number(filters.constituencyId) },
        select: { id: true, tc_name: true, tc_no: true },
        orderBy: { tc_name: "asc" },
      });
    }

    // If municipality is selected, get municipal wards
    if (filters.municipalityId) {
      options.municipalWards = await prisma.municipalWard.findMany({
        where: { municipalityId: Number(filters.municipalityId) },
        select: { id: true, name: true, ward_no: true },
        orderBy: { ward_no: "asc" },
      });
    }

    // If TC is selected, get GPUs
    if (filters.tcId) {
      options.gpus = await prisma.gpu.findMany({
        where: { tcId: Number(filters.tcId) },
        select: { id: true, gpu_name: true, gpu_no: true },
        orderBy: { gpu_name: "asc" },
      });
    }

    // If GPU is selected, get wards
    if (filters.gpuId) {
      options.wards = await prisma.ward.findMany({
        where: { gpuId: Number(filters.gpuId) },
        select: { id: true, ward_name: true, ward_no: true },
        orderBy: { ward_no: "asc" },
      });
    }

    return options;
  } catch (error) {
    console.error("Filter options error:", error.message);
    throw new Error("Failed to fetch filter options");
  }
}

export async function getDashboardAnalytics(filters = {}) {
  try {
    const effectiveFilter = resolveEffectiveFilter(filters);
    const where = buildVoterWhere(effectiveFilter);

    const [
      totalVoters,
      totalDistricts,
      totalConstituencies,
      averageAge,
      districtWiseVoters,
      ageGroupDistribution,
      genderDistribution,
      constituencyWiseVoters,
      voterLastNames,
      scopeName,
    ] = await Promise.all([
      prisma.voter.count({ where }),

      getTotalDistricts(filters),

      getTotalConstituencies(filters),

      getAverageVoterAge(where),

      getDistrictWiseVoterCount(where),

      getAgeGroupDistribution(where),

      getGenderDistribution(where),

      getConstituencyWiseVoterCount(where),

      getVoterLastNames(where),

      getScopeName(effectiveFilter),
    ]);

    return {
      scope: effectiveFilter
        ? {
            level: effectiveFilter.key,
            id: effectiveFilter.value,
            name: scopeName,
          }
        : { level: "state", name: "Sikkim" },

      totals: {
        voters: totalVoters,
        districts: totalDistricts,
        constituencies: totalConstituencies,
      },

      averageAge,
      districtWiseVoters,
      constituencyWiseVoters,
      ageGroupDistribution,
      genderDistribution,
      voterLastNames,
    };
  } catch (error) {
    console.error("Analytics service error:", error.message);
    throw new Error("Failed to fetch analytics");
  }
}

/* ============================
   INDIVIDUAL METRICS
============================ */

async function getAverageVoterAge(where) {
  const result = await prisma.voter.aggregate({
    where,
    _avg: { age: true },
  });
  return result._avg.age || 0;
}

// async function getDistrictWiseVoterCount() {
//   const districts = await prisma.district.findMany({
//     select: { id: true, name: true },
//   });

//   const grouped = await prisma.voter.groupBy({
//     by: ["districtId"],
//     _count: { id: true },
//   });

//   return districts
//     .map((d) => {
//       const found = grouped.find((g) => g.districtId === d.id);
//       return {
//         district: d.name,
//         voters: found ? found._count.id : 0,
//       };
//     })
//     .sort((a, b) => b.voters - a.voters);
// }
async function getDistrictWiseVoterCount(where) {
  const districts = await prisma.district.findMany({
    select: { id: true, name: true },
  });

  const grouped = await prisma.voter.groupBy({
    by: ["districtId"],
    where,
    _count: { id: true },
  });

  return districts
    .map((d) => ({
      district: d.name,
      voters: grouped.find((g) => g.districtId === d.id)?._count.id ?? 0,
    }))
    .sort((a, b) => b.voters - a.voters);
}

// async function getAgeGroupDistribution() {
//   const voters = await prisma.voter.findMany({
//     select: { age: true },
//   });

//   const groups = [
//     { label: "18-25", min: 18, max: 25 },
//     { label: "26-35", min: 26, max: 35 },
//     { label: "36-45", min: 36, max: 45 },
//     { label: "46-60", min: 46, max: 60 },
//     { label: "60+", min: 61, max: Infinity },
//   ];

//   const counts = groups.map((g) => ({
//     ageGroup: g.label,
//     voters: 0,
//   }));

//   for (const v of voters) {
//     if (v.age) {
//       const g = groups.find((g) => v.age >= g.min && v.age <= g.max);
//       if (g) {
//         counts.find((c) => c.ageGroup === g.label).voters++;
//       }
//     }
//   }

//   return counts;
// }
async function getAgeGroupDistribution(where) {
  const voters = await prisma.voter.findMany({
    where,
    select: { age: true },
  });

  const groups = [
    { label: "18-25", min: 18, max: 25 },
    { label: "26-35", min: 26, max: 35 },
    { label: "36-45", min: 36, max: 45 },
    { label: "46-60", min: 46, max: 60 },
    { label: "60+", min: 61, max: Infinity },
  ];

  return groups.map((g) => ({
    ageGroup: g.label,
    voters: voters.filter((v) => v.age && v.age >= g.min && v.age <= g.max)
      .length,
  }));
}

// async function getGenderDistribution() {
//   const genders = [
//     { db: "M", label: "Male" },
//     { db: "F", label: "Female" },
//     { db: "O", label: "Other" },
//   ];

//   return Promise.all(
//     genders.map(async (g) => ({
//       gender: g.label,
//       count: await prisma.voter.count({
//         where: { gender: g.db },
//       }),
//     }))
//   );
// }
async function getGenderDistribution(where) {
  const genders = [
    { db: "M", label: "Male" },
    { db: "F", label: "Female" },
    { db: "O", label: "Other" },
  ];

  return Promise.all(
    genders.map(async (g) => ({
      gender: g.label,
      count: await prisma.voter.count({
        where: { ...where, gender: g.db },
      }),
    }))
  );
}

// async function getConstituencyWiseVoterCount() {
//   const constituencies = await prisma.constituency.findMany({
//     select: { id: true, name: true },
//   });

//   const grouped = await prisma.voter.groupBy({
//     by: ["constituencyId"],
//     _count: { id: true },
//   });

//   const lookup = Object.fromEntries(
//     grouped.map((g) => [g.constituencyId, g._count.id])
//   );

//   return constituencies.map((c) => ({
//     constituencyId: c.id,
//     constituency: c.name,
//     voters: lookup[c.id] ?? 0,
//   }));
// }
async function getConstituencyWiseVoterCount(where) {
  const constituencies = await prisma.constituency.findMany({
    select: { id: true, name: true },
  });

  const grouped = await prisma.voter.groupBy({
    by: ["constituencyId"],
    where,
    _count: { id: true },
  });

  const lookup = Object.fromEntries(
    grouped.map((g) => [g.constituencyId, g._count.id])
  );

  return constituencies
    .map((c) => ({
      constituencyId: c.id,
      constituency: c.name,
      voters: lookup[c.id] ?? 0,
    }))
    .sort((a, b) => b.voters - a.voters);
}

// async function getVoterLastNames() {
//   const voters = await prisma.voter.findMany({
//     select: { name: true, relationName: true },
//   });

//   const counts = {};

//   for (const v of voters) {
//     let lastName = "UNKNOWN";

//     if (v.name) {
//       const parts = v.name.trim().split(/\s+/);
//       if (parts.length > 1) lastName = parts.at(-1).toUpperCase();
//     }

//     if (lastName === "UNKNOWN" && v.relationName) {
//       const parts = v.relationName.trim().split(/\s+/);
//       if (parts.length > 1) lastName = parts.at(-1).toUpperCase();
//     }

//     counts[lastName] = (counts[lastName] || 0) + 1;
//   }

//   return Object.entries(counts).map(([lastName, count]) => ({
//     lastName,
//     count,
//   }));
// }
async function getVoterLastNames(where) {
  const voters = await prisma.voter.findMany({
    where,
    select: { name: true, relationName: true },
  });

  const counts = {};

  for (const v of voters) {
    let lastName = "UNKNOWN";

    if (v.name) {
      const parts = v.name.trim().split(/\s+/);
      if (parts.length > 1) lastName = parts.at(-1).toUpperCase();
    }

    if (lastName === "UNKNOWN" && v.relationName) {
      const parts = v.relationName.trim().split(/\s+/);
      if (parts.length > 1) lastName = parts.at(-1).toUpperCase();
    }

    counts[lastName] = (counts[lastName] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([lastName, count]) => ({
      lastName,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
