// src/municipality/municipalityService.js
import prisma from "../../prisma/prisma.js";

/**
 * Get all municipalities
 */
export async function getAllMunicipalities() {
  return prisma.municipality.findMany({
    select: {
      id: true,
      name: true,
      municipalityNo: true,
      district: {
        select: { id: true, name: true, code: true },
      },
      constituency: {
        select: { id: true, name: true, constituencyNo: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Create municipality
 */
export async function createMunicipality(data) {
  const { name, municipalityNo, districtId, constituencyId } = data;

  console.log("Creating municipality with data:", data);
  // Uniqueness check
  const exists = await prisma.municipality.findFirst({
    where: {
      OR: [{ name }, { municipalityNo }],
    },
  });

  if (exists) {
    throw new Error("Municipality already exists with same name or number");
  }

  return prisma.municipality.create({
    data: {
      name,
      municipalityNo,

      // Connect only if provided
      ...(districtId && {
        district: { connect: { id: Number(districtId) } },
      }),

      ...(constituencyId && {
        constituency: { connect: { id: Number(constituencyId) } },
      }),
    },
  });
}

/**
 * Update municipality
 */
export async function updateMunicipality(id, data) {
  const { name, municipalityNo, districtId, constituencyId } = data;

  if (name || municipalityNo) {
    const exists = await prisma.municipality.findFirst({
      where: {
        OR: [
          name ? { name } : undefined,
          municipalityNo ? { municipalityNo } : undefined,
        ].filter(Boolean),
        NOT: { id },
      },
    });

    if (exists) {
      throw new Error("Municipality name or number already exists");
    }
  }

  return prisma.municipality.update({
    where: { id },
    data: {
      name,
      municipalityNo,
      districtId,
      constituencyId,
    },
  });
}

/**
 * Delete municipality
 */
export async function deleteMunicipality(id) {
  return prisma.municipality.delete({
    where: { id },
  });
}

/**
 * Get municipalities by district
 */
export async function getMunicipalitiesByDistrictId(districtId) {
  return prisma.municipality.findMany({
    where: { districtId },
    select: {
      id: true,
      name: true,
      municipalityNo: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Get municipalities by constituency
 */
export async function getMunicipalitiesByConstituencyId(constituencyId) {
  return prisma.municipality.findMany({
    where: { constituencyId },
    select: {
      id: true,
      name: true,
      municipalityNo: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Count municipalities
 */
export async function countMunicipalities() {
  return prisma.municipality.count();
}
