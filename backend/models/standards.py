from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ClauseTableData(BaseModel):
    headers: List[str]
    rows: List[List[str]]

class Clause(BaseModel):
    id: str
    number: str
    title: str
    content: str
    testRequirement: Optional[str] = None
    testMethod: Optional[str] = None
    mandatory: bool
    tableData: Optional[ClauseTableData] = None

class RawMaterial(BaseModel):
    material: str
    specification: str
    inwardTest: str

class MachineryStage(BaseModel):
    stage: str
    machine: str
    purpose: str

class LabEquipment(BaseModel):
    equipmentName: str
    clauseTested: str
    calibrationRequirement: str

class MarkingRule(BaseModel):
    item: str
    requirement: str

class RoadmapStep(BaseModel):
    step: int
    title: str
    description: str
    estimatedDays: str

class FactoryBlueprint(BaseModel):
    rawMaterials: List[RawMaterial]
    manufacturingMachinery: List[MachineryStage]
    inHouseLaboratoryEquipment: List[LabEquipment]
    markingAndLabeling: List[MarkingRule]
    bisLicensingRoadmap: List[RoadmapStep]

class StandardItem(BaseModel):
    id: str
    code: str
    title: str
    year: int
    category: str
    department: str
    division: str
    status: str
    isMandatory: bool
    mandatory: bool
    scheme: str
    certificationScheme: str
    qcoReference: Optional[str] = None
    qcoOrder: Optional[str] = None
    clausesCount: int
    hasBlueprint: bool
    summary: str
    officialBisPortalUrl: str = "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"

class StandardDetail(BaseModel):
    id: str
    code: str
    title: str
    year: int
    category: str
    department: str
    division: str
    status: str
    isMandatory: bool
    mandatory: bool
    scheme: str
    certificationScheme: str
    qcoReference: Optional[str] = None
    qcoOrder: Optional[str] = None
    businessTypes: List[str]
    summary: str
    scope: str
    keywords: List[str]
    clauses: List[Clause]
    factoryBlueprint: Optional[FactoryBlueprint] = None
    blueprint: Optional[FactoryBlueprint] = None
    officialBisPortalUrl: str = "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/"
