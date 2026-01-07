import prisma from "../../prisma/prisma.js";

// Comprehensive voter data for all Sikkim districts
const sampleVoters = [
  // Gangtok District Voters
  {
    epicNo: "GTK001001",
    stateEpicNo: "SKM-GTK-001",
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
    epicNo: "GTK001002",
    stateEpicNo: "SKM-GTK-002",
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
    epicNo: "GTK001003",
    stateEpicNo: "SKM-GTK-003",
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
    epicNo: "GTK001004",
    stateEpicNo: "SKM-GTK-004",
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
    epicNo: "GTK001005",
    stateEpicNo: "SKM-GTK-005",
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
    epicNo: "GTK001006",
    stateEpicNo: "SKM-GTK-006",
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
    epicNo: "GTK001007",
    stateEpicNo: "SKM-GTK-007",
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
    epicNo: "GTK001008",
    stateEpicNo: "SKM-GTK-008",
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
    epicNo: "GTK001009",
    stateEpicNo: "SKM-GTK-009",
    name: "Sonam Gyaltsen Bhutia",
    relationType: "Father",
    relationName: "Tashi Bhutia",
    age: 33,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001010",
    stateEpicNo: "SKM-GTK-010",
    name: "Rinchen Dolma Lepcha",
    relationType: "Father",
    relationName: "Phurba Lepcha",
    age: 29,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001011",
    stateEpicNo: "SKM-GTK-011",
    name: "Norbu Wangdi Tamang",
    relationType: "Father",
    relationName: "Pemba Tamang",
    age: 61,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001012",
    stateEpicNo: "SKM-GTK-012",
    name: "Chuki Doma Sherpa",
    relationType: "Husband",
    relationName: "Lakpa Sherpa",
    age: 44,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001013",
    stateEpicNo: "SKM-GTK-013",
    name: "Tendup Rai",
    relationType: "Father",
    relationName: "Bir Bahadur Rai",
    age: 37,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001014",
    stateEpicNo: "SKM-GTK-014",
    name: "Sangay Doma Pradhan",
    relationType: "Father",
    relationName: "Dhan Kumar Pradhan",
    age: 31,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001015",
    stateEpicNo: "SKM-GTK-015",
    name: "Karma Tshering Mangar",
    relationType: "Father",
    relationName: "Lalit Mangar",
    age: 50,
    gender: "M",
    casteCategory: "SC",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001016",
    stateEpicNo: "SKM-GTK-016",
    name: "Deki Yangzom Bhutia",
    relationType: "Father",
    relationName: "Sonam Bhutia",
    age: 26,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001017",
    stateEpicNo: "SKM-GTK-017",
    name: "Tashi Namgyal Lepcha",
    relationType: "Father",
    relationName: "Mingma Lepcha",
    age: 43,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001018",
    stateEpicNo: "SKM-GTK-018",
    name: "Yumchen Lhamu Gurung",
    relationType: "Husband",
    relationName: "Tenzing Gurung",
    age: 39,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001019",
    stateEpicNo: "SKM-GTK-019",
    name: "Phurba Tsering Sherpa",
    relationType: "Father",
    relationName: "Nawang Sherpa",
    age: 47,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GTK001020",
    stateEpicNo: "SKM-GTK-020",
    name: "Lhamu Doma Tamang",
    relationType: "Father",
    relationName: "Dorjee Tamang",
    age: 34,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  // Namchi District Voters
  {
    epicNo: "NMC002001",
    stateEpicNo: "SKM-NMC-001",
    name: "Birendra Kumar Chettri",
    relationType: "Father",
    relationName: "Hari Prasad Chettri",
    age: 41,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002002",
    stateEpicNo: "SKM-NMC-002",
    name: "Sunita Kumari Sharma",
    relationType: "Husband",
    relationName: "Rajesh Sharma",
    age: 36,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002003",
    stateEpicNo: "SKM-NMC-003",
    name: "Ram Prasad Rai",
    relationType: "Father",
    relationName: "Shyam Prasad Rai",
    age: 58,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002004",
    stateEpicNo: "SKM-NMC-004",
    name: "Maya Devi Subedi",
    relationType: "Father",
    relationName: "Krishna Prasad Subedi",
    age: 45,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002005",
    stateEpicNo: "SKM-NMC-005",
    name: "Harka Bahadur Limbu",
    relationType: "Father",
    relationName: "Man Bahadur Limbu",
    age: 52,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002006",
    stateEpicNo: "SKM-NMC-006",
    name: "Sita Kumari Magar",
    relationType: "Husband",
    relationName: "Ganesh Magar",
    age: 38,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002007",
    stateEpicNo: "SKM-NMC-007",
    name: "Dhan Bahadur BK",
    relationType: "Father",
    relationName: "Til Bahadur BK",
    age: 49,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002008",
    stateEpicNo: "SKM-NMC-008",
    name: "Goma Devi Rai",
    relationType: "Father",
    relationName: "Chandra Bahadur Rai",
    age: 42,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002009",
    stateEpicNo: "SKM-NMC-009",
    name: "Tek Bahadur Tamang",
    relationType: "Father",
    relationName: "Dal Bahadur Tamang",
    age: 55,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002010",
    stateEpicNo: "SKM-NMC-010",
    name: "Kumari Maya Chettri",
    relationType: "Husband",
    relationName: "Bhim Bahadur Chettri",
    age: 33,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002011",
    stateEpicNo: "SKM-NMC-011",
    name: "Nar Bahadur Gurung",
    relationType: "Father",
    relationName: "Jit Bahadur Gurung",
    age: 46,
    gender: "M",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002012",
    stateEpicNo: "SKM-NMC-012",
    name: "Hira Kumari Subba",
    relationType: "Father",
    relationName: "Padam Subba",
    age: 39,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002013",
    stateEpicNo: "SKM-NMC-013",
    name: "Chandra Bahadur Ale",
    relationType: "Father",
    relationName: "Hari Bahadur Ale",
    age: 51,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002014",
    stateEpicNo: "SKM-NMC-014",
    name: "Tara Devi Sharma",
    relationType: "Husband",
    relationName: "Shyam Sharma",
    age: 44,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "NMC002015",
    stateEpicNo: "SKM-NMC-015",
    name: "Laxmi Prasad Koirala",
    relationType: "Father",
    relationName: "Ram Prasad Koirala",
    age: 48,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  // Pakyong District Voters
  {
    epicNo: "PKY003001",
    stateEpicNo: "SKM-PKY-001",
    name: "Anil Kumar Sharma",
    relationType: "Father",
    relationName: "Ram Kumar Sharma",
    age: 35,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003002",
    stateEpicNo: "SKM-PKY-002",
    name: "Sarita Kumari Rai",
    relationType: "Husband",
    relationName: "Suresh Rai",
    age: 32,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003003",
    stateEpicNo: "SKM-PKY-003",
    name: "Bishnu Prasad Dahal",
    relationType: "Father",
    relationName: "Shiva Prasad Dahal",
    age: 47,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003004",
    stateEpicNo: "SKM-PKY-004",
    name: "Gita Kumari Limbu",
    relationType: "Father",
    relationName: "Harka Limbu",
    age: 29,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003005",
    stateEpicNo: "SKM-PKY-005",
    name: "Rajendra Prasad Gurung",
    relationType: "Father",
    relationName: "Narendra Gurung",
    age: 43,
    gender: "M",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003006",
    stateEpicNo: "SKM-PKY-006",
    name: "Pushpa Devi Tamang",
    relationType: "Husband",
    relationName: "Tek Tamang",
    age: 38,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003007",
    stateEpicNo: "SKM-PKY-007",
    name: "Dinesh Kumar Chettri",
    relationType: "Father",
    relationName: "Ramesh Chettri",
    age: 41,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003008",
    stateEpicNo: "SKM-PKY-008",
    name: "Manju Kumari Subba",
    relationType: "Father",
    relationName: "Padam Subba",
    age: 36,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003009",
    stateEpicNo: "SKM-PKY-009",
    name: "Santosh Kumar BK",
    relationType: "Father",
    relationName: "Dhan BK",
    age: 39,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "PKY003010",
    stateEpicNo: "SKM-PKY-010",
    name: "Rekha Kumari Magar",
    relationType: "Husband",
    relationName: "Ganesh Magar",
    age: 34,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  // Soreng District Voters
  {
    epicNo: "SRG004001",
    stateEpicNo: "SKM-SRG-001",
    name: "Deepak Kumar Rai",
    relationType: "Father",
    relationName: "Shyam Rai",
    age: 37,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004002",
    stateEpicNo: "SKM-SRG-002",
    name: "Anjali Kumari Sharma",
    relationType: "Father",
    relationName: "Rajesh Sharma",
    age: 31,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004003",
    stateEpicNo: "SKM-SRG-003",
    name: "Surya Bahadur Tamang",
    relationType: "Father",
    relationName: "Dal Tamang",
    age: 49,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004004",
    stateEpicNo: "SKM-SRG-004",
    name: "Sunita Devi Gurung",
    relationType: "Husband",
    relationName: "Narendra Gurung",
    age: 42,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004005",
    stateEpicNo: "SKM-SRG-005",
    name: "Hari Prasad Chettri",
    relationType: "Father",
    relationName: "Birendra Chettri",
    age: 44,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004006",
    stateEpicNo: "SKM-SRG-006",
    name: "Kumari Maya Limbu",
    relationType: "Father",
    relationName: "Harka Limbu",
    age: 35,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004007",
    stateEpicNo: "SKM-SRG-007",
    name: "Ram Kumar Subedi",
    relationType: "Father",
    relationName: "Krishna Subedi",
    age: 46,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "SRG004008",
    stateEpicNo: "SKM-SRG-008",
    name: "Ganga Devi BK",
    relationType: "Husband",
    relationName: "Santosh BK",
    age: 40,
    gender: "F",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  // Mangan District Voters
  {
    epicNo: "MGN005001",
    stateEpicNo: "SKM-MGN-001",
    name: "Tenzing Bhutia",
    relationType: "Father",
    relationName: "Karma Bhutia",
    age: 38,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "MGN005002",
    stateEpicNo: "SKM-MGN-002",
    name: "Yangchen Lepcha",
    relationType: "Father",
    relationName: "Sonam Lepcha",
    age: 42,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "MGN005003",
    stateEpicNo: "SKM-MGN-003",
    name: "Mingma Sherpa",
    relationType: "Father",
    relationName: "Pasang Sherpa",
    age: 45,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "MGN005004",
    stateEpicNo: "SKM-MGN-004",
    name: "Dawa Dolma Tamang",
    relationType: "Husband",
    relationName: "Dorjee Tamang",
    age: 36,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "MGN005005",
    stateEpicNo: "SKM-MGN-005",
    name: "Phurba Tsering Rai",
    relationType: "Father",
    relationName: "Thendup Rai",
    age: 41,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "MGN005006",
    stateEpicNo: "SKM-MGN-006",
    name: "Lhamu Gurung",
    relationType: "Father",
    relationName: "Lakpa Gurung",
    age: 39,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  // Gyalshing District Voters
  {
    epicNo: "GYL006001",
    stateEpicNo: "SKM-GYL-001",
    name: "Sonam Wangchuk Bhutia",
    relationType: "Father",
    relationName: "Tashi Bhutia",
    age: 43,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006002",
    stateEpicNo: "SKM-GYL-002",
    name: "Pema Choden Lepcha",
    relationType: "Father",
    relationName: "Phurba Lepcha",
    age: 40,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006003",
    stateEpicNo: "SKM-GYL-003",
    name: "Nawang Sherpa",
    relationType: "Father",
    relationName: "Tenzing Sherpa",
    age: 47,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006004",
    stateEpicNo: "SKM-GYL-004",
    name: "Yumchen Tamang",
    relationType: "Husband",
    relationName: "Pemba Tamang",
    age: 35,
    gender: "F",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006005",
    stateEpicNo: "SKM-GYL-005",
    name: "Karma Dorjee Rai",
    relationType: "Father",
    relationName: "Bir Rai",
    age: 44,
    gender: "M",
    casteCategory: "OBC-State",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006006",
    stateEpicNo: "SKM-GYL-006",
    name: "Deki Lhamu Gurung",
    relationType: "Father",
    relationName: "Tenzing Gurung",
    age: 38,
    gender: "F",
    casteCategory: "OBC-Central",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006007",
    stateEpicNo: "SKM-GYL-007",
    name: "Rinchen Ongdi Limboo",
    relationType: "Father",
    relationName: "Dorjee Limboo",
    age: 46,
    gender: "M",
    casteCategory: "ST",
    country: "India",
    state: "Sikkim",
  },
  {
    epicNo: "GYL006008",
    stateEpicNo: "SKM-GYL-008",
    name: "Tshering Doma Subba",
    relationType: "Husband",
    relationName: "Karma Subba",
    age: 41,
    gender: "F",
    casteCategory: "ST",
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

    console.log("🌱 Seeding comprehensive voter data for all districts...");

    let totalVotersCreated = 0;

    // Get all districts
    const allDistricts = await prisma.district.findMany();
    if (allDistricts.length === 0) {
      console.log("❌ No districts found. Please seed districts first.");
      return;
    }

    // Create a map of district names to district objects
    const districtMap = {};
    allDistricts.forEach((district) => {
      districtMap[district.name] = district;
    });

    // Group voters by district based on epicNo prefix
    const districtVoters = {};
    sampleVoters.forEach((voter) => {
      const districtCode = voter.epicNo.substring(0, 3); // GTK, NMC, PKY, SRG, MGN, GYL
      let districtName = "";

      switch (districtCode) {
        case "GTK":
          districtName = "Gangtok";
          break;
        case "NMC":
          districtName = "Namchi";
          break;
        case "PKY":
          districtName = "Pakyong";
          break;
        case "SRG":
          districtName = "Soreng";
          break;
        case "MGN":
          districtName = "Mangan";
          break;
        case "GYL":
          districtName = "Gyalshing";
          break;
        default:
          districtName = "Gangtok"; // fallback
      }

      if (!districtVoters[districtName]) {
        districtVoters[districtName] = [];
      }
      districtVoters[districtName].push(voter);
    });

    // Seed voters for each district
    for (const [districtName, voters] of Object.entries(districtVoters)) {
      const district = districtMap[districtName];
      if (!district) {
        console.log(`❌ District ${districtName} not found, skipping...`);
        continue;
      }

      console.log(`📍 Seeding voters for ${districtName} district...`);

      // Get constituencies for this district
      const districtConstituencies = await prisma.districtConstituency.findMany(
        {
          where: { districtId: district.id },
          include: { constituency: true },
        }
      );

      const constituencyIds = districtConstituencies.map(
        (dc) => dc.constituencyId
      );

      let districtVotersCreated = 0;

      for (const voterData of voters) {
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

        // Randomly assign to a constituency in this district (if available)
        const randomConstituencyId =
          constituencyIds.length > 0
            ? constituencyIds[
                Math.floor(Math.random() * constituencyIds.length)
              ]
            : null;

        await prisma.voter.create({
          data: {
            ...voterData,
            districtId: district.id,
            constituencyId: randomConstituencyId,
            status: "active",
          },
        });

        districtVotersCreated++;
        totalVotersCreated++;
      }

      console.log(
        `✅ Created ${districtVotersCreated} voters for ${districtName}`
      );
    }

    console.log(
      `🎉 Successfully seeded ${totalVotersCreated} voters across all districts!`
    );
    console.log("📊 Voter Distribution:");
    for (const [districtName, voters] of Object.entries(districtVoters)) {
      console.log(`   ${districtName}: ${voters.length} voters`);
    }
  } catch (error) {
    console.error("❌ Error seeding voters:", error.message);
  }
}

// Export for manual seeding
export default seedVoters;
