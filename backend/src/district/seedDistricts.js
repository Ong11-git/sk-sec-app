import prisma from "../../prisma/prisma.js";

const districts = [
  "Gangtok",
  "Namchi",
  "Pakyong",
  "Soreng",
  "Mangan",
  "Gyalshing",
];

export async function seedDistricts() {
  for (const name of districts) {
    const existing = await prisma.district.findUnique({
      where: { name },
    });

    if (existing) {
      console.log(`⏩ Skipped (already exists): ${name}`);
      continue;
    }

    await prisma.district.create({
      data: { name },
    });

    console.log(`✅ Added: ${name}`);
  }

  console.log("🎉 Districts seeding complete!");
}

