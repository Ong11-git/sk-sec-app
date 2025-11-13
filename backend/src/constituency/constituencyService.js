// src/constituency/constituencyService.js
import prisma from "../../prisma/prisma.js";

/**
 * Create a new constituency and optionally link to districts
 * @param {number} id - Constituency ID
 * @param {Object} data - { name, constituencyNo, districtIds }
 */


export async function getAllConstituencies() {
  try {
    const constituencies = await prisma.constituency.findMany({
      select: {
        id: true,
        name: true,
        constituencyNo: true,
        districts: {
          select: {
            districtId: true,
            district: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Flatten the structure so frontend receives `districts: [{id, name}, ...]`
    return constituencies.map((c) => ({
      id: c.id,
      name: c.name,
      constituencyNo: c.constituencyNo,
      districts: c.districts.map((dc) => ({
        id: dc.district.id,
        name: dc.district.name,
      })),
    }));
  } catch (error) {
    console.error("Error fetching constituencies:", error.message);
    throw new Error("Failed to fetch constituencies");
  }
}

export async function createConstituency(data) {
  const { name, constituencyNo, districtIds = [] } = data;

  // Check if constituencyNo or name already exists
  const existing = await prisma.constituency.findFirst({
    where: {
      OR: [{ name }, { constituencyNo }],
    },
  });

  if (existing) {
    throw new Error(
      `Constituency already exists with name "${existing.name}" or number "${existing.constituencyNo}"`
    );
  }

  // Create constituency
  const constituency = await prisma.constituency.create({
    data: {
      name,
      constituencyNo,
      // Link districts if provided
      districts: {
        create: districtIds.map((districtId) => ({
          district: { connect: { id: Number(districtId) } },
        })),
      },
    },
    include: {
      districts: {
        include: { district: true },
      },
    },
  });

  return constituency;
}

/**
 * Count total constituencies
 */
export async function countConstituencies() {
  try {
    const total = await prisma.constituency.count();
    return total;
  } catch (error) {
    console.error("Error counting constituencies:", error.message);
    throw new Error("Failed to count constituencies");
  }
}

export async function updateConstituency(id, data) {
  try {
    const { constituencyNo, name, districtIds } = data;

    // Update constituency main fields
    const updated = await prisma.constituency.update({
      where: { id },
      data: {
        constituencyNo,
        name,
        // Handle many-to-many: update districts
        districts: districtIds
          ? {
              deleteMany: {}, // remove old links
              create: districtIds.map((districtId) => ({
                district: { connect: { id: districtId } },
              })),
            }
          : undefined,
      },
      include: {
        districts: { include: { district: true } },
      },
    });

    return updated;
  } catch (error) {
    console.error("Error updating constituency:", error.message);
    throw new Error("Failed to update constituency");
  }
}


export async function deleteConstituency(id) {
  try {
    // First remove all district links (from join table)
    await prisma.districtConstituency.deleteMany({
      where: { constituencyId: id },
    });
    // Then delete constituency itself
    const deleted = await prisma.constituency.delete({
      where: { id },
    });
    return deleted;
  } catch (error) {
    console.error("Error deleting constituency:", error.message);
    throw new Error("Failed to delete constituency");
  }
}

export async function getConstituenciesByDistrictId(districtId) {
  try {
    const district = await prisma.district.findUnique({
      where: { id: districtId },
      include: {
        constituencies: {
          include: {
            constituency: true, // from DistrictConstituency join
          },
        },
      },
    });

    if (!district) {
      throw new Error("District not found");
    }

    // Flatten and return
    return district.constituencies.map(dc => ({
      id: dc.constituency.id,
      constituencyNo: dc.constituency.constituencyNo,
      name: dc.constituency.name,
    }));
  } catch (error) {
    console.error("Error fetching constituencies:", error.message);
    throw new Error("Failed to fetch constituencies");
  }
}
