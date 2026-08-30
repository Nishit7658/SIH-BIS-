export interface Clause {
  id: string;
  number: string;
  title: string;
  content: string;
  testRequirement?: string;
  mandatory: boolean;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface Amendment {
  number: number;
  date: string;
  clauseAffected: string;
  description: string;
  supersededText?: string;
  newText: string;
}

export interface Standard {
  id: string;
  code: string;
  title: string;
  year: number;
  category: "Electrical" | "Electronics & IT" | "Chemical & Plastics" | "Civil & Construction" | "Consumer Goods" | "Mechanical";
  department: string;
  status: "Active" | "Under Revision" | "Withdrawn";
  isMandatory: boolean;
  scheme: "Scheme I (ISI Mark)" | "Compulsory Registration Scheme (CRS)" | "Scheme II (Self-Declaration)";
  qcoReference?: string;
  gazetteDate?: string;
  summary: string;
  scope: string;
  clauses: Clause[];
  amendments: Amendment[];
  keywords: string[];
}

export const STANDARDS_DATABASE: Standard[] = [
  {
    id: "is-1293-2019",
    code: "IS 1293:2019",
    title: "Plugs and Socket-Outlets for Domestic and Similar Purposes of Rated Voltage up to and including 250 V and Rated Current up to and including 16 A",
    year: 2019,
    category: "Electrical",
    department: "Electrotechnical Department (ETD 14)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Electrical Accessories (Quality Control) Order, 2020 (S.O. 4333(E))",
    gazetteDate: "2020-12-04",
    summary: "Mandatory standard for all domestic and industrial single-phase plugs, socket-outlets, multiway adaptors, and cord extension sets manufactured or imported into India.",
    scope: "Covers plugs and fixed or portable socket-outlets for a.c. only, with or without earthing contact, with a rated voltage above 50 V but not exceeding 250 V, and a rated current not exceeding 16 A.",
    keywords: ["plugs", "sockets", "16A", "6A", "earthing", "electrical safety", "ISI mark", "pins", "shutter"],
    clauses: [
      {
        id: "is1293-c1",
        number: "Clause 1.1",
        title: "Scope & Ratings",
        content: "Applies to plugs and fixed or portable socket-outlets for a.c. only, with a rated voltage not exceeding 250 V and rated current up to 16 A, intended for household, commercial and light industrial indoor use.",
        mandatory: true
      },
      {
        id: "is1293-c5",
        number: "Clause 5.1",
        title: "Standard Ratings",
        content: "The standard ratings of voltage and current shall be: 250 V a.c., and rated current shall be 6 A, 10 A, or 16 A. Rated currents other than 6 A, 10 A, and 16 A are strictly prohibited for domestic Indian configurations.",
        testRequirement: "Verification of rated marking and physical pin configuration template gauge.",
        mandatory: true
      },
      {
        id: "is1293-c6",
        number: "Clause 6.1",
        title: "Classification & Earthing",
        content: "Accessories are classified according to degree of protection against electric shock. 16 A accessories must have an earthing contact. 2-pin non-earthed configurations are permitted only for rating 6 A or 2.5 A (flat reversible plug).",
        mandatory: true
      },
      {
        id: "is1293-c9",
        number: "Clause 9.1",
        title: "Dimensions and Gauge Verification",
        content: "Plugs and socket-outlets shall comply with standard sheet dimensions. Pins shall be solid or resilient brass, nickel-plated or tin-plated. Plug pins must pass the 'GO' and 'NOT GO' gauge checks without deformation.",
        testRequirement: "Passage through Figure 1 & Figure 2 Go/No-Go plug gauges under 50 N insertion force.",
        mandatory: true,
        tableData: {
          headers: ["Rating", "Pin Configuration", "Pin Diameter (mm)", "Pin Pitch (mm)"],
          rows: [
            ["6 A / 250 V", "3-Pin Round (Earth, L, N)", "5.08 ± 0.05", "19.05 ± 0.15"],
            ["16 A / 250 V", "3-Pin Round (Earth, L, N)", "7.06 ± 0.05", "28.58 ± 0.20"],
            ["10 A / 250 V", "3-Pin (Type D compatible)", "6.00 ± 0.05", "22.20 ± 0.15"]
          ]
        }
      },
      {
        id: "is1293-c13",
        number: "Clause 13.2",
        title: "Resistance to Aging and Humidity",
        content: "Accessories shall be resistant to aging and to humidity. Samples are kept in a humidity cabinet at (40 ± 2)°C and 93% relative humidity for 7 days (168 h) followed by high-voltage dielectric test.",
        testRequirement: "Dielectric strength test at 2000 V a.c. for 1 minute immediately after humidity conditioning without flashover.",
        mandatory: true
      },
      {
        id: "is1293-c19",
        number: "Clause 19.1",
        title: "Temperature Rise Test",
        content: "The temperature rise of terminals and contact surfaces carrying rated current shall not exceed 45°C when tested with a continuous load current of 1.25 times the rated current for 1 hour.",
        testRequirement: "Thermocouple measurement on terminal screws; maximum temp rise <= 45 K.",
        mandatory: true
      },
      {
        id: "is1293-c28",
        number: "Clause 28.1",
        title: "Resistance to Heat, Fire and Tracking (Glow Wire Test)",
        content: "Insulating material parts retaining current-carrying parts in position shall withstand the Glow-Wire Test at 850°C in accordance with IS 11000 (Part 2/Sec 1). Parts not in contact shall withstand 650°C.",
        testRequirement: "Glow-wire tip applied for 30s; flames or glowing must extinguish within 30s after withdrawal.",
        mandatory: true
      }
    ],
    amendments: [
      {
        number: 1,
        date: "2021-06-15",
        clauseAffected: "Clause 9.1",
        description: "Clarification on combined socket-outlets (6/16A shutters)",
        newText: "Shutters on combined 6/16A socket outlets must automatically shield live contacts when a plug is withdrawn, preventing insertion of single-pin objects."
      },
      {
        number: 2,
        date: "2023-01-20",
        clauseAffected: "Clause 5.1",
        description: "Inclusion of 10 A rated plug configuration",
        newText: "Added 10 A rating as recognized Indian standard plug alongside 6 A and 16 A to harmonize with consumer appliance trends."
      }
    ]
  },
  {
    id: "is-302-1-2008",
    title: "Safety of Household and Similar Electrical Appliances — General Requirements",
    code: "IS 302-1:2008",
    year: 2008,
    category: "Electrical",
    department: "Electrotechnical Department (ETD 32)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Household Electrical Appliances (Quality Control) Order",
    gazetteDate: "2018-09-12",
    summary: "Primary safety standard covering household electrical appliances including geysers, irons, toasters, room heaters, immersion rods, and food mixers.",
    scope: "Deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase appliances and 415 V for other appliances.",
    keywords: ["appliances", "geyser", "electric iron", "heater", "leakage current", "insulation", "safety", "ISI mark"],
    clauses: [
      {
        id: "is302-c7",
        number: "Clause 7.1",
        title: "Marking and Instructions",
        content: "Appliances shall be marked with rated voltage or voltage range in Volts, rated power input in Watts or rated current in Amperes, manufacturer name or trade mark, model or type reference, and official ISI certification mark.",
        mandatory: true
      },
      {
        id: "is302-c13",
        number: "Clause 13.2",
        title: "Leakage Current and Electric Strength at Operating Temperature",
        content: "Under normal operating temperature, leakage current shall not exceed: Class 0, Class II appliances: 0.25 mA; Class I portable appliances: 0.75 mA; Class I stationary heating appliances: 0.75 mA or 0.75 mA per kW rated power input, up to a maximum of 5 mA.",
        testRequirement: "Measurement with circuit described in IEC 60990 under 1.06 times rated voltage.",
        mandatory: true
      },
      {
        id: "is302-c19",
        number: "Clause 19.1",
        title: "Abnormal Operation & Thermal Cut-Out",
        content: "Appliances shall be designed so that risk of fire, mechanical damage, or electric shock is obviated during abnormal or careless operation. Electronic circuits shall fail-safe.",
        testRequirement: "Locked rotor test for motor-operated units, dry boiling test for water heating elements.",
        mandatory: true
      },
      {
        id: "is302-c22",
        number: "Clause 22.11",
        title: "Cord Anchorage and Supply Connection",
        content: "Supply cords shall be anchored such that conductors are relieved from strain, including twisting, and the insulation is protected from abrasion.",
        testRequirement: "Pull force of 60 N applied 25 times followed by torque of 0.25 Nm; displacement <= 2 mm.",
        mandatory: true
      }
    ],
    amendments: [
      {
        number: 1,
        date: "2019-11-10",
        clauseAffected: "Clause 19.11",
        description: "Functional safety requirements for software-controlled appliances",
        newText: "Software controlling protective safety loops must comply with Class B or Class C software architecture verification."
      }
    ]
  },
  {
    id: "is-694-2010",
    title: "PVC Insulated Cables for Working Voltages up to and including 1100 V",
    code: "IS 694:2010",
    year: 2010,
    category: "Electrical",
    department: "Electrotechnical Department (ETD 9)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Wires and Cables (Quality Control) Order, 2023",
    gazetteDate: "2023-04-18",
    summary: "Comprehensive standard for building wires, flexible cords, and power supply cables with PVC insulation and sheathing up to 1.1 kV.",
    scope: "Covers single-core and multi-core unsheathed and sheathed cables with plain or tinned copper or aluminium conductors.",
    keywords: ["cables", "wires", "PVC", "copper conductor", "1100V", "flame retardant", "FR-LSH", "insulation resistance"],
    clauses: [
      {
        id: "is694-c4",
        number: "Clause 4.1",
        title: "Conductor Material and Construction",
        content: "Conductors shall consist of high conductivity annealed plain or tinned copper conforming to IS 8130, or aluminium class 2 or class 5. Copper purity must be >= 99.9% electrolytic grade.",
        mandatory: true
      },
      {
        id: "is694-c5",
        number: "Clause 5.2",
        title: "Insulation Thickness & Tensile Properties",
        content: "The insulation shall be PVC Compound Type A or Type C (heat resistant). The average thickness shall not be less than specified nominal value, and smallest value shall not fall below 0.1 mm + 0.1 nominal thickness.",
        testRequirement: "Tensile strength >= 12.5 N/mm², elongation at break >= 150% before and after thermal aging.",
        mandatory: true
      },
      {
        id: "is694-c16",
        number: "Clause 16.1",
        title: "Spark Test and High Voltage Routine Test",
        content: "Every core of cable shall be subjected to spark test at voltages specified in Table 3 (up to 10 kV a.c. peak) during extrusion. Completed cables must pass 3 kV a.c. immersion test for 5 minutes.",
        testRequirement: "Zero breakdown under spark electrode continuous line test at extrusion speed.",
        mandatory: true
      },
      {
        id: "is694-c18",
        number: "Clause 18.2",
        title: "Flame Retardant Properties (FR / FRLS)",
        content: "For FR-marked cables, oxygen index shall not be less than 29% when tested per IS 10810 (Part 58). Temperature index shall be >= 250°C.",
        testRequirement: "Flammability bunsen burner test: flame self-extinguishes within 60 seconds with no burn beyond 50 mm.",
        mandatory: true
      }
    ],
    amendments: [
      {
        number: 1,
        date: "2020-08-14",
        clauseAffected: "Clause 18.3",
        description: "Introduction of Halogen-Free and Low-Smoke (HF-LS) cable grades",
        newText: "Addition of Annexure D for halogen acid gas emission <= 0.5% and smoke density light transmittance >= 60%."
      }
    ]
  },
  {
    id: "is-16046-2018",
    title: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)",
    code: "IS 16046 (Part 2):2018 / IEC 62133-2:2017",
    year: 2018,
    category: "Electronics & IT",
    department: "Electronics and Information Technology (LITD)",
    status: "Active",
    isMandatory: true,
    scheme: "Compulsory Registration Scheme (CRS)",
    qcoReference: "Electronics and Information Technology Goods (Compulsory Registration Order) by MeitY",
    gazetteDate: "2019-03-14",
    summary: "Safety standard for portable secondary lithium cells and batteries used in smartphones, laptops, power banks, and electric mobility devices.",
    scope: "Covers safety requirements for portable sealed secondary lithium cells, and batteries made from them, for use in portable electronic and computing applications.",
    keywords: ["lithium battery", "cell", "power bank", "smart phone battery", "CRS", "MeitY", "thermal runaway", "short circuit"],
    clauses: [
      {
        id: "is16046-c7",
        number: "Clause 7.2.1",
        title: "Continuous Charging at Constant Voltage (Cells)",
        content: "Fully discharged cells are charged at specified upper charge voltage for 7 days. Results: No fire, no explosion, no leakage.",
        testRequirement: "7-day constant voltage exposure in ambient 20°C and 45°C chambers.",
        mandatory: true
      },
      {
        id: "is16046-c7-3",
        number: "Clause 7.3.2",
        title: "External Short Circuit (Cell & Battery)",
        content: "Fully charged battery is short-circuited by connecting positive and negative terminals with total external resistance of (80 ± 20) mΩ at (55 ± 5)°C until case temp drops to 20% of max temp rise.",
        testRequirement: "No fire, no explosion; maximum temperature shall not exceed 150°C.",
        mandatory: true
      },
      {
        id: "is16046-c7-3-6",
        number: "Clause 7.3.6",
        title: "Drop Test",
        content: "Each cell or battery is dropped three times from a height of 1.0 m onto a flat concrete surface. No fire, no explosion.",
        mandatory: true
      },
      {
        id: "is16046-c7-3-8",
        number: "Clause 7.3.8",
        title: "Overcharge of Battery",
        content: "Discharged battery is charged at 2.0 times rated charge current until 1.5 times upper charge voltage. Protective circuit must intervene. No fire, no explosion.",
        mandatory: true
      }
    ],
    amendments: []
  },
  {
    id: "is-14534-1998",
    title: "Guidelines for Recovery and Recycling of Plastics Waste",
    code: "IS 14534:1998",
    year: 1998,
    category: "Chemical & Plastics",
    department: "Petroleum, Coal and Related Products (PCD 12)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Plastic Waste Management Rules, 2016 (MoEFCC)",
    gazetteDate: "2016-03-18",
    summary: "Defines the standard numbering system and resin identification coding (RIC 1 to 7) for marking plastic packaging and products in India.",
    scope: "Prescribes guidelines for the selection, segregation and recycling of plastics waste and specifies marking symbols to facilitate recycling.",
    keywords: ["plastic recycling", "PET", "HDPE", "PVC", "LDPE", "PP", "PS", "symbols", "environment", "MoEFCC"],
    clauses: [
      {
        id: "is14534-c5",
        number: "Clause 5.1",
        title: "Marking and Identification Code",
        content: "Every plastic product or container shall have an embossed or printed recycling mark containing three rotating arrows forming an equilateral triangle with the resin code inside and abbreviation underneath.",
        mandatory: true,
        tableData: {
          headers: ["Code", "Polymer Abbreviation", "Polymer Name", "Common Application"],
          rows: [
            ["1", "PET / PETE", "Polyethylene Terephthalate", "Water and beverage bottles"],
            ["2", "HDPE", "High-Density Polyethylene", "Milk jugs, shampoo bottles, detergent tubs"],
            ["3", "V / PVC", "Polyvinyl Chloride", "Pipes, blister packs, window profiles"],
            ["4", "LDPE", "Low-Density Polyethylene", "Plastic bags, squeeze bottles, shrink film"],
            ["5", "PP", "Polypropylene", "Bottle caps, yogurt containers, food containers"],
            ["6", "PS", "Polystyrene", "Disposable cups, packaging foam, cutlery"],
            ["7", "OTHER", "Other resins or multilayer composites", "Engineering plastics, multilayer pouches"]
          ]
        }
      },
      {
        id: "is14534-c6",
        number: "Clause 6.1",
        title: "Restriction on Recycled Plastics for Food Contact",
        content: "Recycled plastics shall not be used in the manufacture of containers or packaging meant for storing, carrying, dispensing, or packaging foodstuffs, pharmaceuticals, and drinking water unless specifically cleared under FSSAI regulations.",
        mandatory: true
      }
    ],
    amendments: []
  },
  {
    id: "is-269-2015",
    title: "Ordinary Portland Cement — Specification (33, 43 and 53 Grade)",
    code: "IS 269:2015",
    year: 2015,
    category: "Civil & Construction",
    department: "Civil Engineering Department (CED 2)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Cement (Quality Control) Order, 2003 (Mandatory ISI Certification)",
    gazetteDate: "2003-02-17",
    summary: "Defines chemical and physical requirements for Ordinary Portland Cement of 33, 43, and 53 grades used across Indian structural construction.",
    scope: "Covers manufacture and chemical/physical requirements of 33 grade, 43 grade and 53 grade ordinary Portland cement.",
    keywords: ["cement", "OPC 53", "OPC 43", "compressive strength", "setting time", "soundness", "construction", "ISI mark"],
    clauses: [
      {
        id: "is269-c6",
        number: "Clause 6.1",
        title: "Physical Requirements & Compressive Strength",
        content: "The compressive strength of mortar cubes (area 50 cm²) prepared with standard sand shall satisfy minimum values: for 53 Grade: 72h >= 27 MPa; 168h >= 37 MPa; 672h (28 days) >= 53 MPa.",
        testRequirement: "Testing per IS 4031 (Part 6) on 70.6 mm mortar cubes.",
        mandatory: true,
        tableData: {
          headers: ["Property", "33 Grade", "43 Grade", "53 Grade"],
          rows: [
            ["Fineness (Specific Surface, m²/kg min)", "225", "225", "225"],
            ["Initial Setting Time (min)", "30 minutes", "30 minutes", "30 minutes"],
            ["Final Setting Time (max)", "600 minutes", "600 minutes", "600 minutes"],
            ["28-Day Strength (MPa min)", "33.0", "43.0", "53.0"]
          ]
        }
      },
      {
        id: "is269-c5",
        number: "Clause 5.1",
        title: "Chemical Requirements",
        content: "Ratio of percentage of lime to percentages of silica, alumina and iron oxide (Lime Saturation Factor) shall be between 0.66 and 1.02. Insoluble residue shall not exceed 5.0% by mass. Magnesia shall not exceed 6.0%. Total loss on ignition shall not exceed 5.0%.",
        mandatory: true
      }
    ],
    amendments: []
  },
  {
    id: "is-9873-1-2019",
    title: "Safety of Toys — Part 1: Safety Aspects Related to Mechanical and Physical Properties",
    code: "IS 9873 (Part 1):2019 / ISO 8124-1:2018",
    year: 2019,
    category: "Consumer Goods",
    department: "Consumer Goods Department (TXD)",
    status: "Active",
    isMandatory: true,
    scheme: "Scheme I (ISI Mark)",
    qcoReference: "Toys (Quality Control) Order, 2020 (S.O. 858(E))",
    gazetteDate: "2020-02-25",
    summary: "Rigorous mandatory safety standard for all children's toys sold or imported into India, preventing choking hazards, sharp edges, and pinch points.",
    scope: "Applies to all toys intended for use in play by children under 14 years of age. Contains special requirements for toys intended for children under 36 months.",
    keywords: ["toys", "small parts", "choking hazard", "sharp edges", "children", "QCO", "ISI mark"],
    clauses: [
      {
        id: "is9873-c4-4",
        number: "Clause 4.4",
        title: "Small Parts (For Children Under 36 Months)",
        content: "Toys intended for children under 36 months, and their removable components, shall not fit entirely inside the small parts test cylinder (diameter 31.7 mm, truncated depth 25.4 mm to 57.1 mm).",
        testRequirement: "Insertion into Small Parts Test Fixture under self-weight without compression.",
        mandatory: true
      },
      {
        id: "is9873-c4-7",
        number: "Clause 4.7",
        title: "Accessible Sharp Edges and Sharp Points",
        content: "Accessible edges of toys shall not present an unreasonable risk of cutting hazard. Metal edges must be rolled, curled or hemmed.",
        testRequirement: "Sharp edge tester (PTFE tape rotation over cylinder) and sharp point tester per Clause 5.8.",
        mandatory: true
      }
    ],
    amendments: []
  }
];

export function getStandardById(id: string): Standard | undefined {
  return STANDARDS_DATABASE.find(s => s.id.toLowerCase() === id.toLowerCase() || s.code.toLowerCase().replace(/[\s\(\):]/g, "-") === id.toLowerCase());
}

export function getAllStandards(): Standard[] {
  return STANDARDS_DATABASE;
}
