import prisma from "../../prisma/prisma.js";

const constituencies = [
  { no: 1, name: "Yoksam-Tashiding (BL)" , districtId: 6},
  { no: 2, name: "Yangthang",districtId:6 },
  { no: 3, name: "Maneybung-Dentam",districtId:6 },
  { no: 4, name: "Gyalshing-Barnyak", districtId:6 },
  { no: 5, name: "Rinchenpong (BL)", districtId:4 },
  { no: 6, name: "Daramdin (BL)" , districtId:4 },
  { no: 7, name: "Soreng-Chakung", districtId:4 },
  { no: 8, name: "Salghari-Zoom (SC)", districtId:4, districtId:2 },
  { no: 9, name: "Barfung (BL)", districtId:2 },
  { no: 10, name: "Poklok-Kamrang",districtId:2 },
  { no: 11, name: "Namchi-Singhithang",districtId:2 },
  { no: 12, name: "Melli", districtId:2 },
  { no: 13, name: "Namthang-Rateypani", districtId:2 },
  { no: 14, name: "Temi-Namphing", districtId:2 },
  { no: 15, name: "Rangang-Yangang", districtId:2 },
  { no: 16, name: "Tumen-Lingi (BL)", districtId:2, districtId:1 },
  { no: 17, name: "Khamdong-Singtam", districtId:1 },
  { no: 18, name: "West Pendam (SC)", districtId:3 },
  { no: 19, name: "Rhenock",districtId:3 },
  { no: 20, name: "Chujachen", districtId:3},
  { no: 21, name: "Gnathang-Machong (BL)",districtId:3 },
  { no: 22, name: "Namcheybung", districtId:3 },
  { no: 23, name: "Shyari (BL)", districtId:1 },
  { no: 24, name: "Martam-Rumtek (BL)",  },
  { no: 25, name: "Upper Tadong" },
  { no: 26, name: "Arithang" },
  { no: 27, name: "Gangtok (BL)" },
  { no: 28, name: "Upper Burtuk" },
  { no: 29, name: "Kabi Lungchuk (BL)" },
  { no: 30, name: "Djongu (BL)" },
  { no: 31, name: "Lachen-Mangan (BL)" },
  { no: 32, name: "Sangha" }
];

export async function seedConstituencies() {
  for (const c of constituencies) {
    const existing = await prisma.constituency.findUnique({
      where: { constituencyNo: c.no },
    });

    if (existing) {
      throw new Error(`❌ Constituency number ${c.no} already exists (${existing.name})`);
    }

    await prisma.constituency.create({
      data: {
        constituencyNo: c.no,
        name: c.name,
      },
    });

    console.log(`✅ Added: ${c.no} - ${c.name}`);
  }

  console.log("🎉 Constituencies seeding complete!");
}
