#!/usr/bin/env python3
"""
National Standards Release Exporter
Generates exact release increments for the Bureau of Indian Standards (BIS) Smart Digital Expert.
Increment 1: 60 + 65 = 125 standards
Increment 2: 125 + 65 = 190 standards
Increment 3: 190 + 60 = 250 standards
"""

import json
import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PIPELINE_DIR = ROOT_DIR / "packages" / "data-pipeline"

sys.path.insert(0, str(DATA_PIPELINE_DIR))
from batch1_data import BATCH_1_DATA
from batch2_data import BATCH_2_DATA
from batch3_data import BATCH_3_DATA

def build_std_object(item):
    (sid, code, title, year, category, dept, mandatory, scheme, qco,
     business_types, summary, scope, keywords, clauses) = item
    return {
        "id": sid,
        "code": code,
        "title": title,
        "year": year,
        "category": category,
        "department": dept,
        "division": dept,
        "status": "Active",
        "isMandatory": mandatory,
        "mandatory": mandatory,
        "scheme": scheme,
        "certificationScheme": scheme,
        "qcoReference": qco,
        "qcoOrder": qco,
        "businessTypes": business_types,
        "summary": summary,
        "scope": scope,
        "keywords": keywords,
        "clauses": clauses,
        "factoryBlueprint": None,
        "blueprint": None,
        "amendments": []
    }

def get_base_standards():
    # Load original 60 standards from backup or curate_active_standards
    from curate_active_standards import ACTIVE_STANDARDS
    return list(ACTIVE_STANDARDS)

def generate_standards(target_batch: int):
    base_stds = get_base_standards()
    print(f"Loaded {len(base_stds)} base standards.")

    combined = list(base_stds)

    if target_batch >= 1:
        for item in BATCH_1_DATA:
            combined.append(build_std_object(item))
        print(f"After Batch 1: {len(combined)} standards.")

    if target_batch >= 2:
        for item in BATCH_2_DATA:
            combined.append(build_std_object(item))
        print(f"After Batch 2: {len(combined)} standards.")

    if target_batch >= 3:
        for item in BATCH_3_DATA:
            combined.append(build_std_object(item))
        print(f"After Batch 3: {len(combined)} standards.")

    return combined

def export_standards(target_batch: int):
    stds = generate_standards(target_batch)
    json_dest = DATA_PIPELINE_DIR / "active_standards_200.json"
    ts_dest = ROOT_DIR / "src" / "lib" / "standards-data.ts"

    # Write JSON
    with open(json_dest, "w", encoding="utf-8") as f:
        json.dump(stds, f, indent=2, ensure_ascii=False)

    # Write TypeScript
    ts_content = f"""// Auto-generated BIS Active Standards Registry ({len(stds)} Standards)
// Verified active and non-superseded Indian Standards

export interface Clause {{
  id: string;
  number: string;
  title: string;
  content: string;
  mandatory?: boolean;
  testRequirement?: string;
  testMethod?: string;
  tableData?: {{
    headers: string[];
    rows: (string | number)[][];
  }};
}}

export interface Amendment {{
  number: number;
  date: string;
  description: string;
}}

export interface FactoryBlueprint {{
  rawMaterials: {{
    material: string;
    specification: string;
    inwardTest: string;
  }}[];
  manufacturingMachinery: {{
    stage: string;
    machine: string;
    purpose: string;
  }}[];
  inHouseLaboratoryEquipment: {{
    equipmentName: string;
    clauseTested: string;
    calibrationRequirement: string;
  }}[];
  markingAndLabeling: {{
    item: string;
    requirement: string;
  }}[];
  bisLicensingRoadmap: {{
    step: number;
    title: string;
    description: string;
    estimatedDays: string;
  }}[];
}}

export interface Standard {{
  id: string;
  code: string;
  title: string;
  year: number;
  category: string;
  department: string;
  division: string;
  status: "Active";
  isMandatory: boolean;
  mandatory: boolean;
  scheme: string;
  certificationScheme: string;
  qcoReference?: string;
  qcoOrder?: string;
  gazetteDate?: string;
  businessTypes: string[];
  summary: string;
  scope: string;
  clauses: Clause[];
  factoryBlueprint?: FactoryBlueprint | null;
  blueprint?: FactoryBlueprint | null;
  amendments: Amendment[];
  keywords: string[];
}}

export const STANDARDS_DATABASE: Standard[] = {json.dumps(stds, indent=2, ensure_ascii=False)};

export function getStandardById(id: string): Standard | undefined {{
  return STANDARDS_DATABASE.find(s => 
    s.id.toLowerCase() === id.toLowerCase() || 
    s.code.toLowerCase().replace(/[\\s\\(\\):]/g, "-") === id.toLowerCase()
  );
}}

export function getAllStandards(): Standard[] {{
  return STANDARDS_DATABASE;
}}

export function getStandardsByBusinessType(query: string): Standard[] {{
  const q = query.toLowerCase().trim();
  return STANDARDS_DATABASE.filter(s => 
    s.businessTypes.some(b => b.toLowerCase().includes(q) || q.includes(b.toLowerCase())) ||
    s.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q)) ||
    s.title.toLowerCase().includes(q) ||
    s.summary.toLowerCase().includes(q)
  );
}}
"""
    with open(ts_dest, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"[OK] Exported {len(stds)} standards to {json_dest} and {ts_dest}")
    return len(stds)

if __name__ == "__main__":
    batch = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    export_standards(batch)
