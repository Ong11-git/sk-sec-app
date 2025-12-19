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
        code: true,
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

export async function createDistrict(name, code = null) {
  try {
    // const trimmedName = name.trim();
    const trimmedCode = code ? code.trim() : null;

    // ---- Check name uniqueness ----
    const existingName = await prisma.district.findUnique({
      where: { name: name },
    });

    if (existingName) {
      throw new Error("District name already exists");
    }

    // ---- Check code uniqueness (only if provided) ----
    if (trimmedCode) {
      const existingCode = await prisma.district.findUnique({
        where: { code: trimmedCode },
      });

      if (existingCode) {
        throw new Error("District code already exists");
      }
    }

    // ---- Create district ----
    const district = await prisma.district.create({
      data: {
        name: name,
        code: trimmedCode,
      },
    });

    return district;
  } catch (error) {
    console.error("Error creating district:", error.message);
    throw error; // rethrow meaningful error
  }
}

/**
 * Update district by ID with uniqueness checks
 */
export async function updateDistrict(id, name, code) {
  try {
    const districtId = Number(id);

    // Check name uniqueness (excluding current district)
    const nameExists = await prisma.district.findFirst({
      where: {
        name,
        NOT: { id: districtId },
      },
    });

    if (nameExists) {
      throw new Error("District name already exists");
    }

    // Check code uniqueness (excluding current district)
    if (code) {
      const codeExists = await prisma.district.findFirst({
        where: {
          code,
          NOT: { id: districtId },
        },
      });

      if (codeExists) {
        throw new Error("District code already exists");
      }
    }

    // Update district
    const district = await prisma.district.update({
      where: { id: districtId },
      data: {
        name,
        code,
      },
    });

    return district;
  } catch (error) {
    console.error("Error updating district:", error.message);
    throw error;
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
