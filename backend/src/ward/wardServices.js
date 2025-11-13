import prisma from "../../prisma/prisma.js";

// ✅ Get all wards with full hierarchy
export async function getAllWards() {
  try {
    const wards = await prisma.ward.findMany({
      include: {
        gpu: {
          include: {
            tc: {
              include: {
                constituency: {
                  include: {
                    districts: {
                      include: { district: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { ward_no: "asc" },
    });

    return wards.map((w) => ({
      id: w.id,
      ward_no: w.ward_no,
      ward_name: w.ward_name,
      gpu: {
        id: w.gpu.id,
        gpu_no: w.gpu.gpu_no,
        gpu_name: w.gpu.gpu_name,
        tc: {
          id: w.gpu.tc.id,
          tc_no: w.gpu.tc.tc_no,
          tc_name: w.gpu.tc.tc_name,
          constituency: {
            id: w.gpu.tc.constituency.id,
            name: w.gpu.tc.constituency.name,
            constituencyNo: w.gpu.tc.constituency.constituencyNo,
            districts: w.gpu.tc.constituency.districts.map((d) => ({
              id: d.district.id,
              name: d.district.name,
            })),
          },
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching Wards:", error.message);
    throw new Error("Failed to fetch Wards");
  }
}

// ✅ Get wards by GPU
export async function getWardsByGpu(gpuId) {
  try {
    return await prisma.ward.findMany({
      where: { gpuId },
      include: { gpu: true },
      orderBy: { ward_no: "asc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch wards by GPU");
  }
}

// ✅ Create ward
export async function createWard({ ward_no, ward_name, gpuId }) {
  try {
    const gpu = await prisma.gpu.findUnique({ where: { id: gpuId } });
    if (!gpu) throw new Error("GPU not found");

    return await prisma.ward.create({
      data: { ward_no, ward_name, gpuId },
    });
  } catch (error) {
    throw new Error("Failed to create Ward");
  }
}

// ✅ Update ward
export async function updateWard(id, { ward_no, ward_name, gpuId }) {
  try {
    return await prisma.ward.update({
      where: { id: Number(id) },
      data: { ward_no, ward_name, gpuId },
    });
  } catch (error) {
    throw new Error("Failed to update Ward");
  }
}

// ✅ Delete ward
export async function deleteWard(id) {
  try {
    await prisma.ward.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    throw new Error("Failed to delete Ward");
  }
}


export async function getAllWardsByGpuId(gpuId) {
  return await prisma.ward.findMany({
    where: { gpuId: Number(gpuId) },
    include: {
      gpu: {
        include: {
          tc: {
            include: {
              constituency: {
                include: { districts: true }, // if you want district info
              },
            },
          },
        },
      },
    },
  });
}




