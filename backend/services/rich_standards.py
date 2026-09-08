"""
Rich Standards Knowledge & Technical Dossier Repository
Provides authoritative 800 to 1000-token chunks with complete technical tables,
chemical compositions, mechanical properties, and STI testing requirements.
"""

from typing import Dict, Any, Optional

RICH_STANDARDS_REGISTRY: Dict[str, str] = {
    "IS 1786": """### Standard: IS 1786:2020 — High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT)
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
- Mandatory BIS ISI marking CM/L-XXXXXXXXXX and black paint band identification on bundles for Fe 500D.""",

    "IS 2062": """### Standard: IS 2062:2011 — Hot Rolled Medium and High Tensile Structural Steel — Specification
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
- Mandatory ISI Mark with manufacturer trademark and cast/heat number stamp.""",

    "IS 6911": """### Standard: IS 6911:2017 — Stainless Steel Plate, Sheet and Strip — Specification
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
- **Food Safety Certification:** Certified non-reactive to citric acid, vinegar, and hot potable water.""",

    "IS 800": """### Standard: IS 800:2007 — General Construction in Steel — Code of Practice (Limit State Method)
- **Department & Division:** Civil Engineering (CED 7)
- **Regulatory Mandate:** Statutory Indian National Building Code (NBC) Compliance.
- **Statutory Scope:** Formulates comprehensive design rules, safety factors, and construction guidelines for structural steel frames, PEB sheds, industrial bridges, and towers using Limit State Design.

#### Core Design & Safety Acceptance Criteria
1. **Limit State of Strength (Collapse):**
   - Structural steel elements must resist flexural bending, shear buckling, axial tension, and compression forces under factored load combinations (1.5 Dead Load + 1.5 Imposed Load).
   - Partial safety factors: $\gamma_{m0} = 1.10$ for yield stress resistance; $\gamma_{m1} = 1.25$ for ultimate tensile fracture resistance.
2. **Limit State of Serviceability (Deflection & Vibration):**
   - Maximum vertical deflection for industrial shed rafters: Span / 300 (or Span / 250 for corrugated roofing).
   - Maximum vertical deflection for commercial building floors: Span / 360.
   - Lateral drift in multi-storey buildings limited to Story Height / 500.
3. **Connections & Fasteners:**
   - High Strength Friction Grip (HSFG) bolts conforming to IS 3757 with minimum proof load.
   - Fillet and butt welds complying with IS 816 with 100% radiographic or ultrasonic inspection on tension flanges.""",

    "IS 269": """### Standard: IS 269:2015 — Ordinary Portland Cement — Specification (33, 43 and 53 Grade)
- **Department & Division:** Civil Engineering (CED 2)
- **Regulatory Mandate:** Cement Quality Control Order. Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Prescribes physical, mechanical, and chemical criteria for 33, 43, and 53 grade Ordinary Portland Cement (OPC) across all construction.

#### Table 1: Compressive Strength Requirements (IS 269 Clause 6)
| Grade | 72 ± 1 Hour (3 Days) | 168 ± 2 Hours (7 Days) | 672 ± 4 Hours (28 Days) |
| --- | --- | --- | --- |
| 33 Grade | >= 16.0 MPa | >= 22.0 MPa | >= 33.0 MPa |
| 43 Grade | >= 23.0 MPa | >= 33.0 MPa | >= 43.0 MPa |
| 53 Grade | >= 27.0 MPa | >= 37.0 MPa | >= 53.0 MPa |

#### Table 2: Physical Properties & Quality Acceptance Limits
| Physical Property | Statutory Requirement | Test Standard |
| --- | --- | --- |
| Fineness (Specific Surface) | >= 225 sq m/kg | Blaine Permeability (IS 4031-2) |
| Initial Setting Time | >= 30 Minutes | Vicat Needle Test (IS 4031-5) |
| Final Setting Time | <= 600 Minutes | Vicat Needle Test (IS 4031-5) |
| Soundness (Le Chatelier) | <= 10.0 mm | Le Chatelier Mould (IS 4031-3) |
| Soundness (Autoclave Expansion) | <= 0.80% | Autoclave Expansion (IS 4031-3) |

#### Table 3: Chemical Composition Thresholds
- Ratio of percentage of lime to percentages of silica, alumina and iron oxide (Lime Saturation Factor LSF): 0.66 to 1.02.
- Insoluble Residue: <= 5.0% by mass.
- Magnesia (MgO): <= 6.0% by mass.
- Total Sulfur calculated as sulfuric anhydride (SO3): <= 3.5% (for C3A <= 5%) or <= 3.0% (for C3A > 5%).
- Loss on Ignition (LOI): <= 5.0% by mass.""",

    "IS 1293": """### Standard: IS 1293:2019 — Plugs and Socket-Outlets of Rated Voltage up to 250 V and Current up to 16 A
- **Department & Division:** Electrotechnical Division (ETD 14)
- **Regulatory Mandate:** Electrical Appliances Quality Control Order. Scheme I (ISI Mark Mandatory).
- **Statutory Scope:** Governs safety and dimensional requirements for household and commercial 250V AC electrical plugs and socket-outlets.

#### Table 1: Standard Current Ratings & Pin Configurations
| Device Type | Rated Voltage | Rated Current | Configuration | Mandatory Safety Feature |
| --- | --- | --- | --- | --- |
| Small Appliance Plug/Socket | 250 V AC | 6 A | 3 Round Pins (Small) | Integral Earth Pin Contact |
| High-Power Plug/Socket | 250 V AC | 16 A | 3 Round Pins (Large) | Integral Earth Pin Contact |
| Commercial Portable Multi-plug | 250 V AC | 10 A | Combined Shuttered | Automatic Internal Shutter Screen |

#### Critical Safety Tests & Acceptance Limits (Clauses 13 to 24)
1. **Temperature Rise Test (Clause 19):**
   - Current of 1.25 times rated current (20 A for 16 A plug) passed continuously for 1 hour.
   - Maximum allowable terminal temperature rise: **<= 45 K**.
2. **Glow-Wire Flammability Test (Clause 28):**
   - Non-metallic parts retaining live terminals in position: subjected to **850°C** glow wire for 30 seconds.
   - Enclosures and outer covers: subjected to **750°C** glow wire for 30 seconds.
   - Flame must extinguish within 30 seconds with no burning droplets falling on tissue paper.
3. **Safety Shutters & Live Part Protection (Clause 13):**
   - Socket contact tubes must have automatic shutters that prevent 1.0 mm probe access to live conductors when plug is removed.
4. **Mechanical Durability (Clause 20):**
   - Socket-outlets must endure **10,000 insertions and withdrawals** under full electrical load without mechanical failure, arcing, or excessive contact resistance.""",
}

def get_rich_standard_chunk(std: Dict[str, Any]) -> str:
    """
    Returns an authoritative 800-1000 token technical chunk for a standard.
    Uses pre-curated deep specifications if available, or dynamically constructs one from metadata.
    """
    code = std.get("code", "")
    code_prefix = code.split(":")[0].strip().upper()
    # Normalize e.g. "IS 1786:2020" -> "IS 1786"
    for prefix, rich_text in RICH_STANDARDS_REGISTRY.items():
        if code_prefix.startswith(prefix) or prefix in code.upper():
            return rich_text

    # Dynamic fallback: build 800-token chunk from standard metadata
    parts = []
    parts.append(f"### Standard: {std.get('code', '')} — {std.get('title', '')}")
    parts.append(f"- **Category & Department:** {std.get('category', '')} / {std.get('department', '')}")
    parts.append(f"- **Regulatory Mandate:** {'Mandatory Quality Control Order (QCO) Enforced' if std.get('isMandatory') else 'Voluntary Indian Standard'}")
    parts.append(f"- **Certification Scheme:** {std.get('scheme', 'Scheme I (ISI Mark)')}")
    if std.get('qcoReference'):
        parts.append(f"- **Quality Control Order:** {std.get('qcoReference')}")
    if std.get('scope'):
        parts.append(f"- **Statutory Scope:** {std.get('scope')}")
    if std.get('summary'):
        parts.append(f"- **Technical Summary:** {std.get('summary')}")

    clauses = std.get("clauses", [])
    if clauses:
        parts.append("\n#### Governing Clauses & Technical Acceptance Criteria:")
        for cl in clauses:
            parts.append(f"**{cl.get('number', '')} — {cl.get('title', '')}**\n- Requirement: {cl.get('content', '')}")
            if cl.get('testMethod') or cl.get('testRequirement'):
                parts.append(f"- Test Method: {cl.get('testMethod') or cl.get('testRequirement')}")
            if cl.get('tableData'):
                td = cl['tableData']
                headers = td.get('headers', [])
                rows = td.get('rows', [])
                if headers and rows:
                    table_md = "\n| " + " | ".join(headers) + " |\n"
                    table_md += "| " + " | ".join(["---"] * len(headers)) + " |\n"
                    for row in rows:
                        table_md += "| " + " | ".join(str(cell) for cell in row) + " |\n"
                    parts.append(table_md)

    return "\n".join(parts)
