import prisma from "../../prisma/prisma.js";

const districts = [
  { name: "Gangtok", code: "GTK" },
  { name: "Namchi", code: "NMC" },
  { name: "Pakyong", code: "PKY" },
  { name: "Soreng", code: "SRG" },
  { name: "Mangan", code: "MGN" },
  { name: "Gyalshing", code: "GYL" },
];

export async function seedDistricts() {
  try {
    for (const district of districts) {
      const existing = await prisma.district.findUnique({
        where: { name: district.name },
      });

      if (existing) {
        console.log(`⏩ Skipped (already exists): ${district.name}`);
        continue;
      }

      await prisma.district.create({
        data: {
          name: district.name,
          code: district.code,
        },
      });

      console.log(`✅ Added: ${district.name}`);
    }

    console.log("🎉 Districts seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding districts:", error.message);
  }
}
