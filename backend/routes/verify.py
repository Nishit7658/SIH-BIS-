import re
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

router = APIRouter(prefix="/api/verify", tags=["verify"])

VERIFICATION_DATABASE = [
    {
        "cmlNumber": "CM/L-8400012345",
        "applicantName": "Anchor Electricals Pvt Ltd",
        "brand": "Anchor by Panasonic",
        "standardCode": "IS 1293:2019",
        "productName": "16A 3-Pin Shuttered Socket-Outlet with Switch",
        "factoryAddress": "Plot No. 42, GIDC Industrial Estate, Daman - 396210, India",
        "status": "ACTIVE",
        "issueDate": "2020-01-15",
        "validUpto": "2027-01-14",
        "scheme": "Scheme I (ISI Mark)",
        "qrPayload": "BIS:CML:8400012345:IS1293:ANCHOR:VALID"
    },
    {
        "cmlNumber": "CM/L-9123456789",
        "applicantName": "Havells India Limited",
        "brand": "Havells Life Line Plus",
        "standardCode": "IS 694:2010",
        "productName": "PVC Insulated Copper Conductor Single Core Cables (1.5 sq mm)",
        "factoryAddress": "Industrial Area Phase II, Alwar, Rajasthan - 301030, India",
        "status": "ACTIVE",
        "issueDate": "2018-05-10",
        "validUpto": "2026-05-09",
        "scheme": "Scheme I (ISI Mark)",
        "qrPayload": "BIS:CML:9123456789:IS694:HAVELLS:VALID"
    },
    {
        "cmlNumber": "CM/L-7234567890",
        "applicantName": "UltraTech Cement Ltd",
        "brand": "UltraTech Super",
        "standardCode": "IS 269:2015",
        "productName": "53 Grade Ordinary Portland Cement",
        "factoryAddress": "Aditya Nagar, Malkhed, Kalaburagi, Karnataka - 585292",
        "status": "ACTIVE",
        "issueDate": "2016-03-20",
        "validUpto": "2028-03-19",
        "scheme": "Scheme I (ISI Mark)",
        "qrPayload": "BIS:CML:7234567890:IS269:ULTRATECH:VALID"
    }
]

def normalize_cml(cml: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]", "", cml).lower()

@router.get("")
def verify_license(cml: Optional[str] = Query(None)):
    if not cml:
        return {
            "totalRecords": len(VERIFICATION_DATABASE),
            "sampleLicenses": [
                {"cml": v["cmlNumber"], "brand": v["brand"], "standard": v["standardCode"]}
                for v in VERIFICATION_DATABASE
            ]
        }

    clean = normalize_cml(cml)
    for v in VERIFICATION_DATABASE:
        if normalize_cml(v["cmlNumber"]) == clean or clean in normalize_cml(v["cmlNumber"]):
            record = dict(v)
            record["licenseeName"] = record["applicantName"]
            record["productDescription"] = record["productName"]
            record["standardTitle"] = f"Specification for {record['productName']}"
            record["validFrom"] = record["issueDate"]
            record["validUntil"] = record["validUpto"]
            record["branchOffice"] = "Western Regional Office (Mumbai / Daman)"
            return {"found": True, "record": record}

    raise HTTPException(
        status_code=404,
        detail=f"No active or historical BIS certification record found matching '{cml}'."
    )
