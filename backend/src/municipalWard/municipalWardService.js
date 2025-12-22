import prisma from "../../prisma/prisma.js";

/**
 * Create municipal ward
 */
export async function createMunicipalWard(data) {
  const { name, wardNo, municipalityId } = data;

  if (!municipalityId) {
    throw new Error("municipalityId is required");
  }

  // Check if municipality exists
  const municipality = await prisma.municipality.findUnique({
    where: { id: Number(municipalityId) },
  });

  if (!municipality) {
    throw new Error("Municipality does not exist");
  }

  // Uniqueness check (within same municipality)
  const exists = await prisma.municipalWard.findFirst({
    where: {
      municipalityId: Number(municipalityId),
      OR: [{ ward_no: wardNo }, { name }],
    },
  });

  if (exists) {
    throw new Error(
      "Municipal ward already exists with same name or ward number in this municipality"
    );
  }

  // Create ward
  return prisma.municipalWard.create({
    data: {
      name,
      ward_no: wardNo,
      municipality: {
        connect: { id: Number(municipalityId) },
      },
    },
  });
}

/**
 * Update municipal ward
 */
export async function updateMunicipalWard(id, name, wardNo) {
  // Check if ward exists
  const ward = await prisma.municipalWard.findUnique({
    where: { id: Number(id) },
  });

  if (!ward) {
    throw new Error("Municipal ward not found");
  }

  // Uniqueness check (exclude current ward)
  const exists = await prisma.municipalWard.findFirst({
    where: {
      municipalityId: ward.municipalityId,
      id: { not: Number(id) },
      OR: [{ ward_no: wardNo }, { name }],
    },
  });

  if (exists) {
    throw new Error(
      "Another municipal ward already exists with same name or ward number"
    );
  }

  return prisma.municipalWard.update({
    where: { id: Number(id) },
    data: {
      name,
      ward_no: wardNo,
    },
  });
}

/**
 * Get wards by municipality
 */
export async function getMunicipalWardsByMunicipality(municipalityId) {
  return prisma.municipalWard.findMany({
    where: {
      municipalityId: Number(municipalityId),
    },
    orderBy: {
      ward_no: "asc",
    },
  });
}

/**
 * Get all municipal wards
 */
export async function getAllMunicipalWards() {
  try {
    return await prisma.municipalWard.findMany({
      select: {
        id: true,
        name: true,
        ward_no: true,
        municipality: {
          select: {
            id: true,
            name: true,
            municipalityNo: true,
          },
        },
      },
      orderBy: {
        ward_no: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching all municipal wards:", error.message);
    throw new Error("Failed to fetch municipal wards");
  }
}

/**
 * Delete municipal ward by ID
 */
export async function deleteMunicipalWard(id) {
  try {
    const ward = await prisma.municipalWard.findUnique({
      where: { id: Number(id) },
    });

    if (!ward) {
      throw new Error("Municipal ward not found");
    }

    return await prisma.municipalWard.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Error deleting municipal ward:", error.message);
    throw new Error("Failed to delete municipal ward");
  }
}
