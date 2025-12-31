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
    ] = await Promise.all([
      prisma.voter.count({ where }),

      prisma.district.count(),

      prisma.constituency.count(),

      getAverageVoterAge(where),

      getDistrictWiseVoterCount(where),

      getAgeGroupDistribution(where),

      getGenderDistribution(where),

      getConstituencyWiseVoterCount(where),

      getVoterLastNames(where),
    ]);

    return {
      scope: effectiveFilter
        ? { level: effectiveFilter.key, id: effectiveFilter.value }
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

  return districts.map((d) => ({
    district: d.name,
    voters: grouped.find((g) => g.districtId === d.id)?._count.id ?? 0,
  }));
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

  return constituencies.map((c) => ({
    constituencyId: c.id,
    constituency: c.name,
    voters: lookup[c.id] ?? 0,
  }));
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

  return Object.entries(counts).map(([lastName, count]) => ({
    lastName,
    count,
  }));
}
