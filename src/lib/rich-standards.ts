import { Standard } from "./standards-data";

export const RICH_STANDARDS_REGISTRY: Record<string, string> = {
  "IS 1786": `### Standard: IS 1786:2020 — High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT)
- **Department & Division:** Civil Engineering / Metallurgical (CED 54 / MTD 4)
- **Regulatory Mandate:** Mandatory Quality Control Order (Steel and Steel Products QCO) under BIS Act 2016.
- **Conformity Scheme:** Scheme I (ISI Mark Certification mandatory prior to sale).
- **Statutory Scope:** Prescribes chemical, physical, and mechanical requirements of ribbed thermo-mechanically treated (TMT) steel rebars and wires for concrete reinforcement across all Indian construction.

#### Table 1: Chemical Composition Limits (Maximum % by Mass)
| Grade | Carbon (C) | Sulfur (S) | Phosphorus (P) | S + P | Carbon Equivalent (CE) |
| --- | --- | --- | --- | --- | --- |
| Fe 415 | 0.30% | 0.060% | 0.060% | 0.110% | 0.42% |
| Fe 415D | 0.25% | 0.045% | 0.045% | 0.085% | 0.42% |
| Fe 500 | 0.30% | 0.055% | 0.055% | 0.105% | 0.42% |
| Fe 500D | 0.25% | 0.040% | 0.040% | 0.075% | 0.42% |
| Fe 550D | 0.25% | 0.035% | 0.035% | 0.070% | 0.42% |
| Fe 600 | 0.30% | 0.040% | 0.040% | 0.075% | 0.42% |
*Note:* Carbon Equivalent formula: CE = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15.

#### Table 2: Mechanical Properties & Acceptance Criteria (IS 1786 Clause 8)
| Property | Fe 415 | Fe 415D | Fe 500 | Fe 500D | Fe 550D | Fe 600 |
| --- | --- | --- | --- | --- | --- | --- |
| 0.2% Proof Stress / Yield (Min) | 415 MPa | 415 MPa | 500 MPa | 500 MPa | 550 MPa | 600 MPa |
| Tensile Strength (Min) | 485 MPa | 500 MPa | 545 MPa | 565 MPa | 600 MPa | 660 MPa |
| TS / YS Ratio (Min) | >= 1.10 | >= 1.12 | >= 1.08 | >= 1.10 | >= 1.08 | >= 1.06 |
| Total Elongation (Min %) | 14.5% | 18.0% | 12.0% | 16.0% | 14.5% | 10.0% |
| Uniform Elongation (Agt) | - | >= 5.0% | - | >= 5.0% | >= 5.0% | - |

#### Table 3: Nominal Sizes & Mass Tolerances (IS 1786 Clause 7)
| Nominal Diameter | Cross Section Area | Nominal Mass (kg/m) | Batch Tolerance on Mass |
| --- | --- | --- | --- |
| 8 mm | 50.3 sq mm | 0.395 kg/m | +/- 7.0% |
| 10 mm | 78.6 sq mm | 0.617 kg/m | +/- 7.0% |
| 12 mm | 113.1 sq mm | 0.888 kg/m | +/- 5.0% |
| 16 mm | 201.2 sq mm | 1.580 kg/m | +/- 5.0% |
| 20 mm | 314.2 sq mm | 2.470 kg/m | +/- 3.0% |
| 25 mm | 491.1 sq mm | 3.850 kg/m | +/- 3.0% |
| 32 mm | 804.2 sq mm | 6.310 kg/m | +/- 3.0% |

#### Bend and Rebend Test Parameters (Clause 9)
- **Bend Test:** Mandrel diameter 3d for dia <= 20 mm; 4d for dia > 20 mm (Fe 500D). 180° cold bend without rupture.
- **Rebend Test:** Bent to 135° around mandrel (5d for Fe 500D <= 10mm; 7d for > 10mm), immersed in boiling water (100°C) for 30 minutes, cooled, and bent back to 157.5°. No surface fracture allowed.

#### Scheme of Testing and Inspection (STI) Routine Rules
- Ladle chemical analysis conducted on every cast/heat.
- Tensile and elongation test conducted on 1 sample per 50 tonnes batch.
- Mandatory BIS ISI marking CM/L-XXXXXXXXXX and black paint band identification on bundles for Fe 500D.`,

  "IS 2062": `### Standard: IS 2062:2011 — Hot Rolled Medium and High Tensile Structural Steel — Specification
- **Department & Division:** Metallurgical Engineering / CED (MTD 4 / CED 7)
- **Regulatory Mandate:** Mandatory Quality Control Order (Steel and Steel Products QCO) under BIS Act 2016.
- **Conformity Scheme:** Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Covers requirements for structural steel plates, sheets, strips, sections (beams, channels, angles), and flats for welded, bolted, and riveted structural fabrication.

#### Table 1: Structural Steel Grades & Chemical Composition Limits
| Grade Designation | Quality Sub-Class | Carbon (C) Max | Manganese (Mn) Max | Sulfur (S) Max | Phosphorus (P) Max | CE Max |
| --- | --- | --- | --- | --- | --- | --- |
| E250 (Fe 410 W) | A | 0.23% | 1.50% | 0.045% | 0.045% | 0.42% |
| E250 (Fe 410 W) | BR (Killed, Room Temp) | 0.22% | 1.50% | 0.045% | 0.045% | 0.41% |
| E250 (Fe 410 W) | B0 (Killed, 0°C Test) | 0.22% | 1.50% | 0.040% | 0.040% | 0.41% |
| E250 (Fe 410 W) | C (Sub-Zero -20°C) | 0.20% | 1.50% | 0.040% | 0.040% | 0.39% |
| E350 (Fe 490) | A / BR / B0 | 0.20% | 1.60% | 0.040% | 0.040% | 0.45% |
| E450 (Fe 570) | BR / B0 | 0.22% | 1.65% | 0.040% | 0.040% | 0.47% |

#### Table 2: Mechanical Properties & Charpy V-Notch Impact Energy
| Grade | Thickness (t) | Yield Strength (Min) | Tensile Strength | Elongation (Min %) | Charpy Impact Energy (Min) |
| --- | --- | --- | --- | --- | --- |
| E250 A | t <= 20 mm | 250 MPa | 410 - 540 MPa | 23% | Not specified |
| E250 BR | t <= 20 mm | 250 MPa | 410 - 540 MPa | 23% | 27 Joules at +27°C |
| E250 B0 | t <= 20 mm | 250 MPa | 410 - 540 MPa | 23% | 27 Joules at 0°C |
| E250 C | t <= 20 mm | 250 MPa | 410 - 540 MPa | 23% | 27 Joules at -20°C |
| E350 B0 | t <= 20 mm | 350 MPa | 490 - 630 MPa | 22% | 27 Joules at 0°C |

#### Quality Testing & Factory Control (STI)
- 1 tensile test and 1 bend test per cast or per 50 tonnes batch.
- Charpy V-Notch impact testing at designated temperature on 3 test specimens per lot.
- Ultrasonic testing per IS 4225 for heavy structural plates >= 40 mm.
- Mandatory ISI Mark with manufacturer trademark and cast/heat number stamp.`,

  "IS 6911": `### Standard: IS 6911:2017 — Stainless Steel Plate, Sheet and Strip — Specification
- **Department & Division:** Metallurgical Engineering (MTD 4)
- **Regulatory Mandate:** Stainless Steel Products (Quality Control) Order. Scheme I (ISI Mark).
- **Statutory Scope:** Specifies chemical, physical, mechanical, and corrosion resistance requirements for hot-rolled and cold-rolled stainless steel plates, sheets, and coils used in food contact containers, pharmaceuticals, and industrial equipment.

#### Table 1: Chemical Composition Limits for Austenitic Stainless Steels
| Grade | Carbon (C) | Chromium (Cr) | Nickel (Ni) | Manganese (Mn) | Silicon (Si) | Molybdenum (Mo) |
| --- | --- | --- | --- | --- | --- | --- |
| SS 304 (X04Cr19Ni9) | <= 0.07% | 17.50% - 19.50% | 8.00% - 10.50% | <= 2.00% | <= 0.75% | - |
| SS 304L (X02Cr19Ni9) | <= 0.03% | 17.50% - 19.50% | 9.00% - 12.00% | <= 2.00% | <= 0.75% | - |
| SS 316 (X04Cr17Ni12Mo2) | <= 0.07% | 16.00% - 18.00% | 10.00% - 14.00% | <= 2.00% | <= 0.75% | 2.00% - 3.00% |
| SS 316L (X02Cr17Ni12Mo2) | <= 0.03% | 16.00% - 18.00% | 10.00% - 14.00% | <= 2.00% | <= 0.75% | 2.00% - 3.00% |
| SS 430 (Ferritic) | <= 0.12% | 16.00% - 18.00% | <= 0.75% | <= 1.00% | <= 1.00% | - |

#### Table 2: Mechanical Properties (Annealed Condition)
| Grade | 0.2% Proof Stress (Min) | Tensile Strength (MPa) | Elongation A50 (Min %) | Hardness (Max) |
| --- | --- | --- | --- | --- |
| SS 304 | 205 MPa | 520 - 750 MPa | 40% | 201 HB / 92 HRB |
| SS 304L | 175 MPa | 480 - 680 MPa | 40% | 201 HB / 92 HRB |
| SS 316 | 220 MPa | 520 - 720 MPa | 40% | 217 HB / 95 HRB |
| SS 316L | 200 MPa | 480 - 680 MPa | 40% | 217 HB / 95 HRB |

#### Special Acceptance Criteria & Regulatory Checks
- **Toxic/Radioactive Scrap Prohibition:** Radioactive scrap contamination strictly prohibited (Cobalt-60 < 0.1 Bq/g).
- **Intergranular Corrosion Test (IGC):** Conforming to ASTM A262 Practice E / IS 10461 (No grain boundary attack after 15-hour copper sulfate-sulfuric acid boil).
- **Food Safety Certification:** Certified non-reactive to citric acid, vinegar, and hot potable water.`,

  "IS 1293": `### Standard: IS 1293:2019 — Plugs and Socket-Outlets of Rated Voltage up to 250 V and Current up to 16 A
- **Department & Division:** Electrotechnical Division (ETD 14)
- **Regulatory Mandate:** Electrical Appliances Quality Control Order. Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Governs safety and dimensional requirements for household and commercial 250V AC electrical plugs and socket-outlets.

#### Table 1: Standard Current Ratings & Pin Configurations
| Device Type | Rated Voltage | Rated Current | Configuration | Mandatory Safety Feature |
| --- | --- | --- | --- | --- |
| Small Appliance Plug/Socket | 250 V AC | 6 A | 3 Round Pins (Small) | Integral Solid Resilient Earth Pin Contact |
| High-Power Plug/Socket | 250 V AC | 16 A | 3 Round Pins (Large) | Integral Solid Resilient Earth Pin Contact |
| Commercial Portable Multi-plug | 250 V AC | 10 A | Combined Shuttered | Automatic Internal Shutter Screen |

#### Critical Safety Tests & Acceptance Limits (Clauses 13 to 28)
1. **Temperature Rise Test (Clause 19):**
   - Current of 1.25 times rated current (20 A for 16 A plug) passed continuously for 1 hour.
   - Maximum allowable terminal temperature rise: **<= 45 K**.
2. **Glow-Wire Flammability Test (Clause 28):**
   - Non-metallic parts retaining live terminals in position: subjected to **850°C** glow wire for 30 seconds.
   - Enclosures and outer covers: subjected to **750°C** glow wire for 30 seconds.
   - Flame must extinguish within 30 seconds with no burning droplets falling on tissue paper.
3. **Safety Shutters & Live Part Protection (Clause 13):**
   - Socket contact tubes must have automatic shutters that prevent 1.0 mm probe access to live conductors when plug is removed.
4. **Mechanical Durability & Endurance (Clause 20):**
   - Socket-outlets must endure **10,000 insertions and withdrawals** under full electrical load without mechanical failure, arcing, or excessive contact resistance.
5. **Flexible Cable Retention (Clause 23):**
   - Cord grip subjected to 100 pulls of 60 N force; longitudinal displacement must not exceed 2 mm.`,

  "IS 17526": `### Standard: IS 17526:2021 — Stainless Steel Vacuum Flasks and Insulated Containers — Specification
- **Department & Division:** Consumer Products and Medical Equipment Division (MED 32)
- **Regulatory Mandate:** Insulated Flasks, Bottles and Containers Quality Control Order (QCO 2023). Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Specifies thermal, material, hygienic, and physical requirements for vacuum insulated stainless steel bottles and food containers.

#### Table 1: Raw Material Food-Grade Specifications (Clause 4)
| Component | Material Reference | Mandatory Food Grade Grade | Inward Quality Test |
| --- | --- | --- | --- |
| Inner Liner / Flask Body | IS 6911 | SS 304 (Grade 18/8) / SS 316 | Optical Emission Spectrometry (OES) |
| Outer Protective Shell | IS 6911 | SS 201 / SS 304 | Chemical Composition & Wall Thickness Gauge |
| Sealing Gasket / O-Ring | IS 9845 | Food Grade Silicone Elastomer | Overall Migration Limit (< 10 mg/dm²) |
| Stopper Lid & Spout | IS 10910 | Virgin Polypropylene (PP) | Heavy Metal Leaching (Lead < 0.1 mg/kg) |

#### Table 2: Mandatory Performance Tests & Acceptance Limits (Clause 6)
| Test Parameter | Test Procedure | Mandatory Acceptance Threshold |
| --- | --- | --- |
| Thermal Insulation (Hot) | Filled with boiling water (95°C), sealed in 20°C ambient room for 24 hours | Temperature must remain >= 55°C after 24h |
| Thermal Insulation (Cold) | Filled with chilled ice water (4°C) for 24 hours | Temperature must not exceed 10°C after 24h |
| Leakage Tightness Test | Filled with water, inverted 180° with 1.0 kg deadweight on stopper for 15 minutes | Zero leakage / zero droplet discharge |
| Drop & Impact Resistance | Dropped 3 consecutive times from 1.2 m height onto concrete slab | No thermal vacuum puncture or shell fracture |
| Corrosion Resistance | 24-hour Salt Fog Chamber (5% NaCl solution at 35°C) | No pitting, rust spots, or discoloration |`,

  "IS 694": `### Standard: IS 694:2010 — Polyvinyl Chloride (PVC) Insulated Cables for Working Voltages up to and Including 1100 V
- **Department & Division:** Electrotechnical Division (ETD 9)
- **Regulatory Mandate:** Wires and Cables Quality Control Order. Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Covers single and multi-core PVC insulated and sheathed electric cables with copper or aluminium conductors for fixed wiring and power distribution.

#### Table 1: Conductor Resistance & Insulation Thickness Limits
| Nominal Cross Section Area (sq mm) | Conductor Material | Max Conductor DC Resistance at 20°C (Ohm/km) | Nominal Insulation Thickness (mm) |
| --- | --- | --- | --- |
| 0.5 sq mm | Bare Annealed Copper | 39.0 Ohm/km | 0.6 mm |
| 0.75 sq mm | Bare Annealed Copper | 26.0 Ohm/km | 0.6 mm |
| 1.0 sq mm | Bare Annealed Copper | 18.1 Ohm/km | 0.6 mm |
| 1.5 sq mm | Bare Annealed Copper | 12.1 Ohm/km | 0.7 mm |
| 2.5 sq mm | Bare Annealed Copper | 7.41 Ohm/km | 0.8 mm |
| 4.0 sq mm | Bare Annealed Copper | 4.61 Ohm/km | 0.8 mm |
| 6.0 sq mm | Bare Annealed Copper | 3.08 Ohm/km | 0.8 mm |

#### Table 2: Mandatory Electrical & Mechanical Acceptance Tests
- **High Voltage Spark Test:** 100% inline spark testing at 6000 V AC during extrusion.
- **Water Immersion HV Test:** Cores immersed in water at 60°C for 24h; must withstand 3000 V AC for 5 minutes without breakdown.
- **Insulation Resistance (Volume Resistivity):** >= 1 x 10¹³ Ohm-cm at 27°C.
- **Flammability / Flame Retardance Test:** Bunch flame propagation conforming to IS 10810 (Part 53); charred length must not reach upper clamp.`
};

export function getRichStandardChunk(std: Standard): string {
  const code = std.code || "";
  const codePrefix = code.split(":")[0].trim().toUpperCase();

  for (const [prefix, richText] of Object.entries(RICH_STANDARDS_REGISTRY)) {
    if (codePrefix.startsWith(prefix) || prefix.includes(codePrefix) || code.toUpperCase().includes(prefix)) {
      return richText;
    }
  }

  // Dynamic assembly from standard clauses and blueprint
  const parts: string[] = [];
  parts.push(`### Standard: ${std.code} — ${std.title}`);
  parts.push(`- **Department / Division:** ${std.division} (${std.department || "BIS"})`);
  parts.push(`- **Regulatory Status:** ${std.mandatory ? "Mandatory Quality Control Order (QCO) Enforced" : "Voluntary BIS Standard"}`);
  parts.push(`- **Certification Scheme:** ${std.certificationScheme || "Scheme I (ISI Mark)"}`);
  if (std.qcoOrder) parts.push(`- **Quality Control Order Gazette:** ${std.qcoOrder}`);
  if (std.scope) parts.push(`- **Scope:** ${std.scope}`);
  if (std.summary) parts.push(`- **Technical Summary:** ${std.summary}`);

  if (std.clauses && std.clauses.length > 0) {
    parts.push("\n#### Key Technical Clauses & Specifications:");
    for (const cl of std.clauses.slice(0, 6)) {
      parts.push(`**${cl.number} — ${cl.title}**\n- Requirement: ${cl.content}`);
      if (cl.testRequirement || cl.testMethod) {
        parts.push(`- Testing Method / Threshold: ${cl.testRequirement || cl.testMethod}`);
      }
      if (cl.tableData && cl.tableData.headers && cl.tableData.rows) {
        const h = cl.tableData.headers;
        let t = "\n| " + h.join(" | ") + " |\n";
        t += "| " + h.map(() => "---").join(" | ") + " |\n";
        for (const row of cl.tableData.rows) {
          t += "| " + row.join(" | ") + " |\n";
        }
        parts.push(t);
      }
    }
  }

  if (std.blueprint) {
    parts.push("\n#### Mandatory Factory Blueprint (Scheme of Testing & Inspection - STI):");
    if (std.blueprint.rawMaterials && std.blueprint.rawMaterials.length > 0) {
      parts.push("**Raw Material Inward Acceptance:**");
      std.blueprint.rawMaterials.forEach(rm => {
        parts.push(`- ${rm.material}: ${rm.specification} (Test: ${rm.inwardTest})`);
      });
    }
    if (std.blueprint.inHouseLaboratoryEquipment && std.blueprint.inHouseLaboratoryEquipment.length > 0) {
      parts.push("\n**In-House Laboratory Instruments Required:**");
      std.blueprint.inHouseLaboratoryEquipment.forEach(lab => {
        parts.push(`- ${lab.equipmentName}: Tests ${lab.clauseTested} (${lab.calibrationRequirement})`);
      });
    }
  }

  return parts.join("\n");
}
