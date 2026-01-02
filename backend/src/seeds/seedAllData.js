import prisma from "../../prisma/prisma.js";

// Sikkim Constituencies with their district mappings
const constituencies = [
  { no: 1, name: "Yoksam-Tashiding (BL)", districtName: "Gyalshing" },
  { no: 2, name: "Yangthang", districtName: "Gyalshing" },
  { no: 3, name: "Maneybung-Dentam", districtName: "Gyalshing" },
  { no: 4, name: "Gyalshing-Barnyak", districtName: "Gyalshing" },
  { no: 5, name: "Rinchenpong (BL)", districtName: "Soreng" },
  { no: 6, name: "Daramdin (BL)", districtName: "Soreng" },
  { no: 7, name: "Soreng-Chakung", districtName: "Soreng" },
  { no: 8, name: "Salghari-Zoom (SC)", districtName: "Namchi" },
  { no: 9, name: "Barfung (BL)", districtName: "Namchi" },
  { no: 10, name: "Poklok-Kamrang", districtName: "Namchi" },
  { no: 11, name: "Namchi-Singhithang", districtName: "Namchi" },
  { no: 12, name: "Melli", districtName: "Namchi" },
  { no: 13, name: "Namthang-Rateypani", districtName: "Namchi" },
  { no: 14, name: "Temi-Namphing", districtName: "Namchi" },
  { no: 15, name: "Rangang-Yangang", districtName: "Namchi" },
  { no: 16, name: "Tumen-Lingi (BL)", districtName: "Gangtok" },
  { no: 17, name: "Khamdong-Singtam", districtName: "Gangtok" },
  { no: 18, name: "West Pendam (SC)", districtName: "Pakyong" },
  { no: 19, name: "Rhenock", districtName: "Pakyong" },
  { no: 20, name: "Chujachen", districtName: "Pakyong" },
  { no: 21, name: "Gnathang-Machong (BL)", districtName: "Pakyong" },
  { no: 22, name: "Namcheybung", districtName: "Pakyong" },
  { no: 23, name: "Shyari (BL)", districtName: "Gangtok" },
  { no: 24, name: "Martam-Rumtek (BL)", districtName: "Gangtok" },
  { no: 25, name: "Upper Tadong", districtName: "Gangtok" },
  { no: 26, name: "Arithang", districtName: "Gangtok" },
  { no: 27, name: "Gangtok (BL)", districtName: "Gangtok" },
  { no: 28, name: "Upper Burtuk", districtName: "Gangtok" },
  { no: 29, name: "Kabi Lungchuk (BL)", districtName: "Gangtok" },
  { no: 30, name: "Djongu (BL)", districtName: "Mangan" },
  { no: 31, name: "Lachen-Mangan (BL)", districtName: "Mangan" },
  { no: 32, name: "Sangha", districtName: "Gangtok" },
];

// TCs (Territorial Councils) for each constituency
const tcs = [
  // Gyalshing constituencies
  { tc_no: 1, tc_name: "Yoksam TC", constituencyNo: 1 },
  { tc_no: 2, tc_name: "Tashiding TC", constituencyNo: 1 },
  { tc_no: 3, tc_name: "Yangthang TC", constituencyNo: 2 },
  { tc_no: 4, tc_name: "Hee TC", constituencyNo: 2 },
  { tc_no: 5, tc_name: "Maneybung TC", constituencyNo: 3 },
  { tc_no: 6, tc_name: "Dentam TC", constituencyNo: 3 },
  { tc_no: 7, tc_name: "Gyalshing TC", constituencyNo: 4 },
  { tc_no: 8, tc_name: "Barnyak TC", constituencyNo: 4 },
  // Soreng constituencies
  { tc_no: 9, tc_name: "Rinchenpong TC", constituencyNo: 5 },
  { tc_no: 10, tc_name: "Daramdin TC", constituencyNo: 6 },
  { tc_no: 11, tc_name: "Soreng TC", constituencyNo: 7 },
  { tc_no: 12, tc_name: "Chakung TC", constituencyNo: 7 },
  // Namchi constituencies
  { tc_no: 13, tc_name: "Salghari TC", constituencyNo: 8 },
  { tc_no: 14, tc_name: "Zoom TC", constituencyNo: 8 },
  { tc_no: 15, tc_name: "Barfung TC", constituencyNo: 9 },
  { tc_no: 16, tc_name: "Poklok TC", constituencyNo: 10 },
  { tc_no: 17, tc_name: "Kamrang TC", constituencyNo: 10 },
  { tc_no: 18, tc_name: "Namchi TC", constituencyNo: 11 },
  { tc_no: 19, tc_name: "Singhithang TC", constituencyNo: 11 },
  { tc_no: 20, tc_name: "Melli TC", constituencyNo: 12 },
  { tc_no: 21, tc_name: "Namthang TC", constituencyNo: 13 },
  { tc_no: 22, tc_name: "Rateypani TC", constituencyNo: 13 },
  { tc_no: 23, tc_name: "Temi TC", constituencyNo: 14 },
  { tc_no: 24, tc_name: "Namphing TC", constituencyNo: 14 },
  { tc_no: 25, tc_name: "Rangang TC", constituencyNo: 15 },
  { tc_no: 26, tc_name: "Yangang TC", constituencyNo: 15 },
  // Gangtok constituencies
  { tc_no: 27, tc_name: "Tumen TC", constituencyNo: 16 },
  { tc_no: 28, tc_name: "Lingi TC", constituencyNo: 16 },
  { tc_no: 29, tc_name: "Khamdong TC", constituencyNo: 17 },
  { tc_no: 30, tc_name: "Singtam TC", constituencyNo: 17 },
  { tc_no: 31, tc_name: "Shyari TC", constituencyNo: 23 },
  { tc_no: 32, tc_name: "Martam TC", constituencyNo: 24 },
  { tc_no: 33, tc_name: "Rumtek TC", constituencyNo: 24 },
  { tc_no: 34, tc_name: "Upper Tadong TC", constituencyNo: 25 },
  { tc_no: 35, tc_name: "Arithang TC", constituencyNo: 26 },
  { tc_no: 36, tc_name: "Gangtok TC", constituencyNo: 27 },
  { tc_no: 37, tc_name: "Upper Burtuk TC", constituencyNo: 28 },
  { tc_no: 38, tc_name: "Kabi TC", constituencyNo: 29 },
  { tc_no: 39, tc_name: "Lungchuk TC", constituencyNo: 29 },
  // Pakyong constituencies
  { tc_no: 40, tc_name: "West Pendam TC", constituencyNo: 18 },
  { tc_no: 41, tc_name: "Rhenock TC", constituencyNo: 19 },
  { tc_no: 42, tc_name: "Chujachen TC", constituencyNo: 20 },
  { tc_no: 43, tc_name: "Gnathang TC", constituencyNo: 21 },
  { tc_no: 44, tc_name: "Machong TC", constituencyNo: 21 },
  { tc_no: 45, tc_name: "Namcheybung TC", constituencyNo: 22 },
  // Mangan constituencies
  { tc_no: 46, tc_name: "Djongu TC", constituencyNo: 30 },
  { tc_no: 47, tc_name: "Lachen TC", constituencyNo: 31 },
  { tc_no: 48, tc_name: "Mangan TC", constituencyNo: 31 },
];

// GPUs (Gram Panchayat Units) - Sample for first few TCs
const gpus = [
  // Yoksam TC GPUs
  { gpu_no: 1, gpu_name: "Yoksam GPU", tc_no: 1 },
  { gpu_no: 2, gpu_name: "Dubdi GPU", tc_no: 1 },
  { gpu_no: 3, gpu_name: "Khecheopalri GPU", tc_no: 1 },
  // Tashiding TC GPUs
  { gpu_no: 4, gpu_name: "Tashiding GPU", tc_no: 2 },
  { gpu_no: 5, gpu_name: "Lasso GPU", tc_no: 2 },
  // Yangthang TC GPUs
  { gpu_no: 6, gpu_name: "Yangthang GPU", tc_no: 3 },
  { gpu_no: 7, gpu_name: "Legship GPU", tc_no: 3 },
  // Hee TC GPUs
  { gpu_no: 8, gpu_name: "Hee GPU", tc_no: 4 },
  { gpu_no: 9, gpu_name: "Pechrek GPU", tc_no: 4 },
  // Gyalshing TC GPUs
  { gpu_no: 10, gpu_name: "Gyalshing GPU", tc_no: 7 },
  { gpu_no: 11, gpu_name: "Tikjuk GPU", tc_no: 7 },
  // Barnyak TC GPUs
  { gpu_no: 12, gpu_name: "Barnyak GPU", tc_no: 8 },
  { gpu_no: 13, gpu_name: "Omchung GPU", tc_no: 8 },
  // Namchi TC GPUs
  { gpu_no: 14, gpu_name: "Namchi GPU", tc_no: 18 },
  { gpu_no: 15, gpu_name: "Boomtar GPU", tc_no: 18 },
  // Singtam TC GPUs
  { gpu_no: 16, gpu_name: "Singtam GPU", tc_no: 30 },
  { gpu_no: 17, gpu_name: "Rangpo GPU", tc_no: 30 },
  // Gangtok TC GPUs
  { gpu_no: 18, gpu_name: "Gangtok Central GPU", tc_no: 36 },
  { gpu_no: 19, gpu_name: "Development Area GPU", tc_no: 36 },
  // Mangan TC GPUs
  { gpu_no: 20, gpu_name: "Mangan GPU", tc_no: 48 },
  { gpu_no: 21, gpu_name: "Pentong GPU", tc_no: 48 },
];

// Wards for each GPU
const wards = [
  // Yoksam GPU Wards
  { ward_no: 1, ward_name: "Yoksam Ward 1", gpu_no: 1 },
  { ward_no: 2, ward_name: "Yoksam Ward 2", gpu_no: 1 },
  { ward_no: 3, ward_name: "Yoksam Ward 3", gpu_no: 1 },
  // Dubdi GPU Wards
  { ward_no: 1, ward_name: "Dubdi Ward 1", gpu_no: 2 },
  { ward_no: 2, ward_name: "Dubdi Ward 2", gpu_no: 2 },
  // Khecheopalri GPU Wards
  { ward_no: 1, ward_name: "Khecheopalri Ward 1", gpu_no: 3 },
  { ward_no: 2, ward_name: "Khecheopalri Ward 2", gpu_no: 3 },
  // Tashiding GPU Wards
  { ward_no: 1, ward_name: "Tashiding Ward 1", gpu_no: 4 },
  { ward_no: 2, ward_name: "Tashiding Ward 2", gpu_no: 4 },
  // Yangthang GPU Wards
  { ward_no: 1, ward_name: "Yangthang Ward 1", gpu_no: 6 },
  { ward_no: 2, ward_name: "Yangthang Ward 2", gpu_no: 6 },
  // Gyalshing GPU Wards
  { ward_no: 1, ward_name: "Gyalshing Ward 1", gpu_no: 10 },
  { ward_no: 2, ward_name: "Gyalshing Ward 2", gpu_no: 10 },
  { ward_no: 3, ward_name: "Gyalshing Ward 3", gpu_no: 10 },
  // Namchi GPU Wards
  { ward_no: 1, ward_name: "Namchi Ward 1", gpu_no: 14 },
  { ward_no: 2, ward_name: "Namchi Ward 2", gpu_no: 14 },
  { ward_no: 3, ward_name: "Namchi Ward 3", gpu_no: 14 },
  // Singtam GPU Wards
  { ward_no: 1, ward_name: "Singtam Ward 1", gpu_no: 16 },
  { ward_no: 2, ward_name: "Singtam Ward 2", gpu_no: 16 },
  // Gangtok Central GPU Wards
  { ward_no: 1, ward_name: "Gangtok Central Ward 1", gpu_no: 18 },
  { ward_no: 2, ward_name: "Gangtok Central Ward 2", gpu_no: 18 },
  { ward_no: 3, ward_name: "Gangtok Central Ward 3", gpu_no: 18 },
  // Mangan GPU Wards
  { ward_no: 1, ward_name: "Mangan Ward 1", gpu_no: 20 },
  { ward_no: 2, ward_name: "Mangan Ward 2", gpu_no: 20 },
];

// Municipalities
const municipalities = [
  {
    municipalityNo: 1,
    name: "Gangtok Municipal Corporation",
    districtName: "Gangtok",
    constituencyNo: 27,
  },
  {
    municipalityNo: 2,
    name: "Namchi Municipal Council",
    districtName: "Namchi",
    constituencyNo: 11,
  },
  {
    municipalityNo: 3,
    name: "Gyalshing Nagar Panchayat",
    districtName: "Gyalshing",
    constituencyNo: 4,
  },
  {
    municipalityNo: 4,
    name: "Mangan Nagar Panchayat",
    districtName: "Mangan",
    constituencyNo: 31,
  },
  {
    municipalityNo: 5,
    name: "Singtam Nagar Panchayat",
    districtName: "Gangtok",
    constituencyNo: 17,
  },
  {
    municipalityNo: 6,
    name: "Rangpo Nagar Panchayat",
    districtName: "Pakyong",
    constituencyNo: 17,
  },
  {
    municipalityNo: 7,
    name: "Jorethang Nagar Panchayat",
    districtName: "Namchi",
    constituencyNo: 12,
  },
];

// Municipal Wards
const municipalWards = [
  // Gangtok Municipal Corporation Wards
  { ward_no: 1, name: "Arithang Ward", municipalityNo: 1 },
  { ward_no: 2, name: "Development Area Ward", municipalityNo: 1 },
  { ward_no: 3, name: "Indira Bye Pass Ward", municipalityNo: 1 },
  { ward_no: 4, name: "Tibet Road Ward", municipalityNo: 1 },
  { ward_no: 5, name: "Gangtok Bazaar Ward", municipalityNo: 1 },
  { ward_no: 6, name: "Sichey Ward", municipalityNo: 1 },
  { ward_no: 7, name: "Bojoghari Ward", municipalityNo: 1 },
  { ward_no: 8, name: "Upper Tadong Ward", municipalityNo: 1 },
  { ward_no: 9, name: "Lower Tadong Ward", municipalityNo: 1 },
  { ward_no: 10, name: "5th Mile Ward", municipalityNo: 1 },
  // Namchi Municipal Council Wards
  { ward_no: 1, name: "Namchi Central Ward", municipalityNo: 2 },
  { ward_no: 2, name: "Boomtar Ward", municipalityNo: 2 },
  { ward_no: 3, name: "Singhithang Ward", municipalityNo: 2 },
  { ward_no: 4, name: "Upper Ghurpisey Ward", municipalityNo: 2 },
  { ward_no: 5, name: "Lower Ghurpisey Ward", municipalityNo: 2 },
  // Gyalshing Nagar Panchayat Wards
  { ward_no: 1, name: "Gyalshing Main Ward", municipalityNo: 3 },
  { ward_no: 2, name: "Kyongsa Ward", municipalityNo: 3 },
  { ward_no: 3, name: "Tikjuk Ward", municipalityNo: 3 },
  // Mangan Nagar Panchayat Wards
  { ward_no: 1, name: "Mangan Main Ward", municipalityNo: 4 },
  { ward_no: 2, name: "Pentong Ward", municipalityNo: 4 },
  // Singtam Nagar Panchayat Wards
  { ward_no: 1, name: "Singtam Bazaar Ward", municipalityNo: 5 },
  { ward_no: 2, name: "Upper Singtam Ward", municipalityNo: 5 },
  { ward_no: 3, name: "Lower Singtam Ward", municipalityNo: 5 },
  // Rangpo Nagar Panchayat Wards
  { ward_no: 1, name: "Rangpo Main Ward", municipalityNo: 6 },
  { ward_no: 2, name: "Majhitar Ward", municipalityNo: 6 },
  // Jorethang Nagar Panchayat Wards
  { ward_no: 1, name: "Jorethang Main Ward", municipalityNo: 7 },
  { ward_no: 2, name: "Nayabazar Ward", municipalityNo: 7 },
];

export async function seedAllData() {
  console.log("\n🌱 Starting comprehensive database seeding...\n");

  try {
    // 1. Seed Constituencies
    console.log("📍 Seeding Constituencies...");
    for (const c of constituencies) {
      const existing = await prisma.constituency.findUnique({
        where: { constituencyNo: c.no },
      });

      if (existing) {
        console.log(`⏭️  Constituency ${c.no} already exists, skipping...`);
        continue;
      }

      // Find district
      const district = await prisma.district.findUnique({
        where: { name: c.districtName },
      });

      const constituency = await prisma.constituency.create({
        data: {
          constituencyNo: c.no,
          name: c.name,
        },
      });

      // Create district-constituency relationship
      if (district) {
        await prisma.districtConstituency
          .create({
            data: {
              districtId: district.id,
              constituencyId: constituency.id,
            },
          })
          .catch(() => {}); // Ignore if already exists
      }

      console.log(`✅ Added constituency: ${c.no} - ${c.name}`);
    }
    console.log("🎉 Constituencies seeding complete!\n");

    // 2. Seed TCs
    console.log("📍 Seeding TCs (Territorial Councils)...");
    for (const tc of tcs) {
      const constituency = await prisma.constituency.findUnique({
        where: { constituencyNo: tc.constituencyNo },
      });

      if (!constituency) {
        console.log(
          `⚠️  Constituency ${tc.constituencyNo} not found for TC ${tc.tc_name}, skipping...`
        );
        continue;
      }

      const existing = await prisma.tc.findFirst({
        where: { tc_no: tc.tc_no, constituencyId: constituency.id },
      });

      if (existing) {
        console.log(`⏭️  TC ${tc.tc_no} already exists, skipping...`);
        continue;
      }

      await prisma.tc.create({
        data: {
          tc_no: tc.tc_no,
          tc_name: tc.tc_name,
          constituencyId: constituency.id,
        },
      });
      console.log(`✅ Added TC: ${tc.tc_no} - ${tc.tc_name}`);
    }
    console.log("🎉 TCs seeding complete!\n");

    // 3. Seed GPUs
    console.log("📍 Seeding GPUs (Gram Panchayat Units)...");
    for (const gpu of gpus) {
      const tc = await prisma.tc.findFirst({
        where: { tc_no: gpu.tc_no },
      });

      if (!tc) {
        console.log(
          `⚠️  TC ${gpu.tc_no} not found for GPU ${gpu.gpu_name}, skipping...`
        );
        continue;
      }

      const existing = await prisma.gpu.findFirst({
        where: { gpu_no: gpu.gpu_no, tcId: tc.id },
      });

      if (existing) {
        console.log(`⏭️  GPU ${gpu.gpu_no} already exists, skipping...`);
        continue;
      }

      await prisma.gpu.create({
        data: {
          gpu_no: gpu.gpu_no,
          gpu_name: gpu.gpu_name,
          tcId: tc.id,
        },
      });
      console.log(`✅ Added GPU: ${gpu.gpu_no} - ${gpu.gpu_name}`);
    }
    console.log("🎉 GPUs seeding complete!\n");

    // 4. Seed Wards (Rural)
    console.log("📍 Seeding Rural Wards...");
    for (const ward of wards) {
      const gpu = await prisma.gpu.findFirst({
        where: { gpu_no: ward.gpu_no },
      });

      if (!gpu) {
        console.log(
          `⚠️  GPU ${ward.gpu_no} not found for Ward ${ward.ward_name}, skipping...`
        );
        continue;
      }

      const existing = await prisma.ward.findFirst({
        where: { ward_no: ward.ward_no, gpuId: gpu.id },
      });

      if (existing) {
        console.log(
          `⏭️  Ward ${ward.ward_no} in GPU ${ward.gpu_no} already exists, skipping...`
        );
        continue;
      }

      await prisma.ward.create({
        data: {
          ward_no: ward.ward_no,
          ward_name: ward.ward_name,
          gpuId: gpu.id,
        },
      });
      console.log(`✅ Added Ward: ${ward.ward_no} - ${ward.ward_name}`);
    }
    console.log("🎉 Rural Wards seeding complete!\n");

    // 5. Seed Municipalities
    console.log("📍 Seeding Municipalities...");
    for (const m of municipalities) {
      const existing = await prisma.municipality.findUnique({
        where: { municipalityNo: m.municipalityNo },
      });

      if (existing) {
        console.log(
          `⏭️  Municipality ${m.municipalityNo} already exists, skipping...`
        );
        continue;
      }

      const district = await prisma.district.findUnique({
        where: { name: m.districtName },
      });

      const constituency = await prisma.constituency.findUnique({
        where: { constituencyNo: m.constituencyNo },
      });

      await prisma.municipality.create({
        data: {
          municipalityNo: m.municipalityNo,
          name: m.name,
          districtId: district?.id || null,
          constituencyId: constituency?.id || null,
        },
      });
      console.log(`✅ Added Municipality: ${m.municipalityNo} - ${m.name}`);
    }
    console.log("🎉 Municipalities seeding complete!\n");

    // 6. Seed Municipal Wards
    console.log("📍 Seeding Municipal Wards...");
    for (const mw of municipalWards) {
      const municipality = await prisma.municipality.findUnique({
        where: { municipalityNo: mw.municipalityNo },
      });

      if (!municipality) {
        console.log(
          `⚠️  Municipality ${mw.municipalityNo} not found for Ward ${mw.name}, skipping...`
        );
        continue;
      }

      const existing = await prisma.municipalWard.findFirst({
        where: { ward_no: mw.ward_no, municipalityId: municipality.id },
      });

      if (existing) {
        console.log(
          `⏭️  Municipal Ward ${mw.ward_no} in Municipality ${mw.municipalityNo} already exists, skipping...`
        );
        continue;
      }

      await prisma.municipalWard.create({
        data: {
          ward_no: mw.ward_no,
          name: mw.name,
          municipalityId: municipality.id,
        },
      });
      console.log(`✅ Added Municipal Ward: ${mw.ward_no} - ${mw.name}`);
    }
    console.log("🎉 Municipal Wards seeding complete!\n");

    console.log("✨✨✨ ALL DATA SEEDING COMPLETE! ✨✨✨\n");
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
  }
}

export default seedAllData;
