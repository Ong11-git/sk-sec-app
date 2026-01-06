import prisma from "../../prisma/prisma.js";

// Sample voter data for Sikkim
const sampleVoters = [
  {
    epicNo: "SKM1234567",
    stateEpicNo: "SKM-ST-001",
    name: "Tenzing Dorjee Bhutia",
    relationType: "Father",
    relationName: "Karma Bhutia",
    age: 45,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234568",
    stateEpicNo: "SKM-ST-002",
    name: "Pema Diki Lepcha",
    relationType: "Father",
    relationName: "Sonam Lepcha",
    age: 38,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234569",
    stateEpicNo: "SKM-ST-003",
    name: "Mingma Sherpa",
    relationType: "Father",
    relationName: "Pasang Sherpa",
    age: 52,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234570",
    stateEpicNo: "SKM-ST-004",
    name: "Yangchen Tamang",
    relationType: "Husband",
    relationName: "Dorjee Tamang",
    age: 35,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234571",
    stateEpicNo: "SKM-ST-005",
    name: "Karma Wangchuk Rai",
    relationType: "Father",
    relationName: "Thendup Rai",
    age: 28,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234572",
    stateEpicNo: "SKM-ST-006",
    name: "Dawa Lhamu Gurung",
    relationType: "Father",
    relationName: "Lakpa Gurung",
    age: 42,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234573",
    stateEpicNo: "SKM-ST-007",
    name: "Pema Tshering Limboo",
    relationType: "Father",
    relationName: "Dorjee Limboo",
    age: 55,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234574",
    stateEpicNo: "SKM-ST-008",
    name: "Tshering Doma Subba",
    relationType: "Husband",
    relationName: "Karma Subba",
    age: 48,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234575",
    stateEpicNo: "SKM-ST-009",
    name: "Sonam Gyaltsen Bhutia",
    relationType: "Father",
    relationName: "Tashi Bhutia",
    age: 33,
    gender: "Male",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234576",
    stateEpicNo: "SKM-ST-010",
    name: "Rinchen Dolma Lepcha",
    relationType: "Father",
    relationName: "Phurba Lepcha",
    age: 29,
    gender: "Female",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234577",
    stateEpicNo: "SKM-ST-011",
    name: "Norbu Wangdi Tamang",
    relationType: "Father",
    relationName: "Pemba Tamang",
    age: 61,
    gender: "Male",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234578",
    stateEpicNo: "SKM-ST-012",
    name: "Chuki Doma Sherpa",
    relationType: "Husband",
    relationName: "Lakpa Sherpa",
    age: 44,
    gender: "Female",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234579",
    stateEpicNo: "SKM-ST-013",
    name: "Tendup Rai",
    relationType: "Father",
    relationName: "Bir Bahadur Rai",
    age: 37,
    gender: "Male",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234580",
    stateEpicNo: "SKM-ST-014",
    name: "Sangay Doma Pradhan",
    relationType: "Father",
    relationName: "Dhan Kumar Pradhan",
    age: 31,
    gender: "Female",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SKM1234581",
    stateEpicNo: "SKM-ST-015",
    name: "Karma Tshering Mangar",
    relationType: "Father",
    relationName: "Lalit Mangar",
    age: 50,
    gender: "Male",
    casteCategory: "SC",
    country: "India",
    state: "Sikkim",
  },
];

export async function seedVoters() {
  try {
    // Check if voters already exist
    const existingCount = await prisma.voter.count();
    if (existingCount > 0) {
      console.log(`✅ Voters already seeded (${existingCount} voters exist)`);
      return;
    }

    // Get first district for seeding
    const district = await prisma.district.findFirst();
    if (!district) {
      console.log("❌ No districts found. Please seed districts first.");
      return;
    }

    // Get first constituency for seeding (optional)
    const constituency = await prisma.constituency.findFirst();

    console.log("🌱 Seeding voters...");

    for (const voterData of sampleVoters) {
      // Check if voter already exists
      const existing = await prisma.voter.findFirst({
        where: {
          OR: [
            { epicNo: voterData.epicNo },
            { stateEpicNo: voterData.stateEpicNo },
          ],
        },
      });

      if (existing) {
        console.log(
          `⏭️  Voter ${voterData.epicNo} already exists, skipping...`
        );
        continue;
      }

      await prisma.voter.create({
        data: {
          ...voterData,
          districtId: district.id,
          constituencyId: constituency?.id || null,
          status: "active",
        },
      });
      console.log(`✅ Created voter: ${voterData.name}`);
    }

    console.log(`🎉 Successfully seeded ${sampleVoters.length} voters!`);
  } catch (error) {
    console.error("❌ Error seeding voters:", error.message);
  }
}

// Export for manual seeding
export default seedVoters;
