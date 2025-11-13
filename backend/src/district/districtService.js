// src/district/districtService.js
import prisma from "../../prisma/prisma.js";

/**
 * Count total districts
 */
export async function countDistricts() {
  try {
    const total = await prisma.district.count();
    return total;
  } catch (error) {
    console.error("Error counting districts:", error.message);
    throw new Error("Failed to count districts");
  }
}

export async function getAllDistricts() {
  try {
    const districts = await prisma.district.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc", // 👈 optional: sorts alphabetically
      },
    });
    return districts;
  } catch (error) {
    console.error("Error fetching districts:", error.message);
    throw new Error("Failed to fetch districts");
  }
}

export async function createDistrict(name) {
  try {
    const district = await prisma.district.create({
      data: { name },
    });
    return district;
  } catch (error) {
    console.error("Error creating district:", error.message);
    throw new Error("Failed to create district");
  }
}

/**
 * Update district by ID
 */
export async function updateDistrict(id, name) {
  try {
    const district = await prisma.district.update({
      where: { id: Number(id) },
      data: { name },
    });
    return district;
  } catch (error) {
    console.error("Error updating district:", error.message);
    throw new Error("Failed to update district");
  }
}

/**
 * Delete district by ID
 */
export async function deleteDistrict(id) {
  try {
    await prisma.district.delete({
      where: { id: Number(id) },
    });
    return { message: "District deleted successfully" };
  } catch (error) {
    console.error("Error deleting district:", error.message);
    throw new Error("Failed to delete district");
  }
}
