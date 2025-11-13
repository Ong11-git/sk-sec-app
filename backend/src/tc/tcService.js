import prisma from "../../prisma/prisma.js";

// ✅ Get all TCs including Constituency & District
export async function getAllTCs() {
  try {
    const tcs = await prisma.tc.findMany({
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
      orderBy: {
        tc_no: "asc",
      },
    });

    // ✅ Flatten district relation (since it's many-to-many)
    return tcs.map((tc) => ({
      id: tc.id,
      no: tc.tc_no,
      name: tc.tc_name,
      constituency: {
        id: tc.constituency.id,
        no: tc.constituency.constituencyNo,
        name: tc.constituency.name,
      },
      districts: tc.constituency.districts.map((d) => ({
        id: d.district.id,
        name: d.district.name,
      })),
    }));
  } catch (error) {
    console.error("Error fetching TCs:", error.message);
    throw new Error("Failed to fetch TCs");
  }
}

export async function createTC(data) {
  try {
    const { tc_no, tc_name, constituencyId } = data;

    // ✅ validate constituency exists
    const constituency = await prisma.constituency.findUnique({
      where: { id: constituencyId },
    });

    if (!constituency) {
      throw new Error("Constituency not found");
    }

    const newTC = await prisma.tc.create({
      data: {
        tc_no,
        tc_name,
        constituencyId,
      },
      include: {
        constituency: {
          select: { id: true, name: true, constituencyNo: true },
        },
      },
    });

    return newTC;
  } catch (error) {
    console.error("Error creating TC:", error.message);
    throw new Error("Failed to create TC");
  }
}


// 🔄 Update TC
export async function updateTC(id, data) {
  try {
    const { tc_no, tc_name, constituencyId } = data;

    // validate constituency exists
    const constituency = await prisma.constituency.findUnique({
      where: { id: constituencyId },
    });

    if (!constituency) {
      throw new Error("Constituency not found");
    }

    const updatedTC = await prisma.tc.update({
      where: { id },
      data: {
        tc_no,
        tc_name,
        constituencyId,
      },
      include: {
        constituency: {
          select: {
            id: true,
            name: true,
            constituencyNo: true,
          },
        },
      },
    });

    return updatedTC;
  } catch (error) {
    console.error("Error updating TC:", error.message);
    throw new Error("Failed to update TC");
  }
}

// 🗑 Delete TC
export async function deleteTC(id) {
  try {
    await prisma.tc.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting TC:", error.message);
    throw new Error("Failed to delete TC");
  }
}


// ✅ Get all TCs by constituency
export async function getTCsByConstituency(constituencyId) {
  try {
    const tcs = await prisma.tc.findMany({
      where: { constituencyId: Number(constituencyId) },
      select: { id: true, tc_no: true, tc_name: true },
      orderBy: { tc_no: "asc" },
    });
    return tcs;
  } catch (error) {
    console.error("Error fetching TCs:", error.message);
    throw new Error("Failed to fetch TCs by constituency");
  }
}
