import prisma from "../../prisma/prisma.js";

// ✅ Get all GPUs with TC, Constituency, and District
export async function getAllGpus() {
  try {
    const gpus = await prisma.gpu.findMany({
      include: {
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
                districts: {
                  select: {
                    district: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
          },
        },
        voters: true, // optional, if you want to count voters
      },
      orderBy: { gpu_no: "asc" },
    });

    // Flatten district relation
    return gpus.map((gpu) => ({
      id: gpu.id,
      gpu_no: gpu.gpu_no,
      gpu_name: gpu.gpu_name,
      tc: gpu.tc
        ? {
            id: gpu.tc.id,
            tc_no: gpu.tc.tc_no,
            tc_name: gpu.tc.tc_name,
            constituency: gpu.tc.constituency
              ? {
                  id: gpu.tc.constituency.id,
                  name: gpu.tc.constituency.name,
                  no: gpu.tc.constituency.constituencyNo,
                  districts: gpu.tc.constituency.districts.map((d) => ({
                    id: d.district.id,
                    name: d.district.name,
                  })),
                }
              : null,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching GPUs:", error.message);
    throw new Error("Failed to fetch GPUs");
  }
}

// ✅ Create GPU
export async function createGpu({ gpu_no, gpu_name, tcId }) {
  try {
    const tc = await prisma.tc.findUnique({ where: { id: tcId } });
    if (!tc) throw new Error("TC not found");

    const gpu = await prisma.gpu.create({
      data: { gpu_no, gpu_name, tcId },
      include: {
        tc: {
          select: {
            id: true,
            tc_no: true,
            tc_name: true,
            constituency: { select: { id: true, name: true, constituencyNo: true } },
          },
        },
      },
    });

    return gpu;
  } catch (error) {
    console.error("Error creating GPU:", error.message);
    throw new Error("Failed to create GPU");
  }
}



// ✅ Update GPU
export async function updateGpu(id, { gpu_no, gpu_name, tcId }) {
  try {
    const tc = await prisma.tc.findUnique({ where: { id: tcId } });
    if (!tc) throw new Error("TC not found");

    const updatedGpu = await prisma.gpu.update({
      where: { id: Number(id) },
      data: { gpu_no, gpu_name, tcId },
      include: {
        tc: {
          select: {
            id: true,
            tc_no: true,
            tc_name: true,
            constituency: { select: { id: true, name: true, constituencyNo: true } },
          },
        },
      },
    });

    return updatedGpu;
  } catch (error) {
    console.error("Error updating GPU:", error.message);
    throw new Error("Failed to update GPU");
  }
}

// ✅ Delete GPU
export async function deleteGpu(id) {
  try {
    await prisma.gpu.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    console.error("Error deleting GPU:", error.message);
    throw new Error("Failed to delete GPU");
  }
}


export async function getGpusByTc(tcId) {
  return await prisma.gpu.findMany({
    where: { tcId: Number(tcId) },
    include: {
      tc: {
        include: {
          constituency: {
            include: { districts: true },
          },
        },
      },
    },
  });
}
