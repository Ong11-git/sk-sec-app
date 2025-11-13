import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

/**
 * Extract text from a PDF file
 * @param {string} pdfPath
 * @returns {Promise<string>}
 */
export async function extractTextFromPdf(pdfPath) {
  try {
    const buffer = fs.readFileSync(pdfPath);
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error("Error reading PDF:", err);
    return null;
  }
}

/**
 * Extract header info (state, tc, gpu, ward)
 */
function extractHeaderInfo(content) {
  const header = {};

  const stateMatch = content.match(/STATE OF (.+)/);
  header.state = stateMatch ? stateMatch[1].trim() : "";

  const tcMatch = content.match(/TC No\.&\s*Name:\s*(.+)/);
  if (tcMatch) {
    const tcParts = tcMatch[1].split(".", 2);
    header.tc_no = tcParts[0] || "";
    header.tc_name = tcParts[1] ? tcParts[1].trim() : tcMatch[1];
  }

  const gpuMatch = content.match(/GPU No &\s*Name:\s*(.+)/);
  if (gpuMatch) {
    const gpuParts = gpuMatch[1].split(".", 2);
    header.gpu_no = gpuParts[0] || "";
    header.gpu_name = gpuParts[1] ? gpuParts[1].trim() : gpuMatch[1];
  }

  const wardMatch = content.match(/Ward No &\s*Name:\s*(.+)/);
  if (wardMatch) {
    const wardParts = wardMatch[1].split(".", 2);
    header.ward_no = wardParts[0] || "";
    header.ward_name = wardParts[1] ? wardParts[1].trim() : wardMatch[1];
  }

  return header;
}

/**
 * Build complete voter record
 */
function createCompleteVoter(voter, header, sourceFile) {
  return {
    epic_no: voter.epic_no || "",
    name: voter.name || "",
    relation_type: voter.relation_type || "",
    relation_name: voter.relation_name || "",
    age: voter.age || 0,
    gender: voter.gender || "",
    source_file_id: sourceFile,
    country: "INDIA",
    district: "",
    gpu_name: header.gpu_name || "",
    gpu_no: header.gpu_no || "",
    state: header.state || "",
    tc_name: header.tc_name || "",
    tc_no: header.tc_no || "",
    ward_name: header.ward_name || "",
    ward_no: header.ward_no || "",
  };
}

/**
 * Parse voter records from extracted PDF text
 */
function parseVoterRecords(content, sourceFile) {
  const headerInfo = extractHeaderInfo(content);
  const voters = [];
  const lines = content.split("\n").map((l) => l.trim());

  let current = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of voter
    const voterMatch = line.match(/N (\d+)\s+EPIC NO\.\s*:([A-Z0-9]+)/);
    if (voterMatch) {
      if (current.epic_no && current.name && current.age && current.gender) {
        voters.push(createCompleteVoter(current, headerInfo, sourceFile));
      }
      current = {
        serial_no: voterMatch[1],
        epic_no: voterMatch[2],
      };
      continue;
    }

    // Name
    if (line.startsWith("Name :")) {
      let name = line.replace("Name :", "").trim();
      let j = i + 1;
      while (
        j < lines.length &&
        lines[j] &&
        !lines[j].includes("Father's Name") &&
        !lines[j].includes("Husband's Name") &&
        !lines[j].includes("Mother's Name") &&
        !lines[j].includes("Age :")
      ) {
        name += " " + lines[j].trim();
        j++;
      }
      current.name = name;
      continue;
    }

    // Relation
    ["Father's Name", "Husband's Name", "Mother's Name"].forEach((rel) => {
      if (line.includes(rel)) {
        let relationName = line.replace(rel + " :", "").trim();
        let j = i + 1;
        while (j < lines.length && lines[j] && !lines[j].includes("Age :")) {
          relationName += " " + lines[j].trim();
          j++;
        }
        current.relation_type = rel.replace("'s Name", "").toLowerCase();
        current.relation_name = relationName;
      }
    });

    // Age and Gender
    if (line.includes("Age :") && line.includes("Gender:")) {
      const ageGenderMatch = line.match(/Age : (\d+)\s+Gender: ([MF])/);
      if (ageGenderMatch) {
        current.age = parseInt(ageGenderMatch[1], 10);
        current.gender = ageGenderMatch[2];
      }
    }
  }

  // Last voter
  if (current.epic_no && current.name && current.age && current.gender) {
    voters.push(createCompleteVoter(current, headerInfo, sourceFile));
  }

  return voters;
}

/**
 * Convert uploaded PDF file to JSON
 */
export async function convertPdfToJson(pdfPath) {
  console.log("Processing PDF:", pdfPath);

  const content = await extractTextFromPdf(pdfPath);
  if (!content) return [];

  const voters = parseVoterRecords(content, pdfPath);
  return voters;
}
