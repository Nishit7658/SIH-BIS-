import { NextRequest, NextResponse } from "next/server";

interface EscalationTicket {
  id: string;
  query: string;
  userContext: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  createdAt: string;
  assignedOfficer: string;
}

let mockTickets: EscalationTicket[] = [
  {
    id: "BIS-ESC-1092",
    query: "Can 10A plugs manufactured under IS 1293 Amendment 2 be exported to ASEAN without dual-pin retesting?",
    userContext: "Manufacturer inquiry regarding mutual recognition agreements (MRA).",
    priority: "HIGH",
    status: "OPEN",
    createdAt: "2026-08-29T14:30:00Z",
    assignedOfficer: "Dr. R. Sharma (Electrotechnical Committee)"
  },
  {
    id: "BIS-ESC-1088",
    query: "Clarification on flame retardant test chamber dimensions under IS 694 Annexure D.",
    userContext: "Cable testing laboratory seeking calibration tolerance threshold.",
    priority: "MEDIUM",
    status: "IN_REVIEW",
    createdAt: "2026-08-28T09:15:00Z",
    assignedOfficer: "Er. S. Meena (Chemical / Cable Division)"
  }
];

export async function GET() {
  return NextResponse.json({
    activeTickets: mockTickets,
    totalCount: mockTickets.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, userContext = "Self-escalated from digital expert" } = body;

    const newTicket: EscalationTicket = {
      id: `BIS-ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      query: query || "General Technical Standard Inquiry",
      userContext,
      priority: "HIGH",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      assignedOfficer: "Assigned to BIS Technical Liaison Desk"
    };

    mockTickets.unshift(newTicket);

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Inquiry successfully dispatched to BIS Technical Desk."
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to escalate ticket" }, { status: 500 });
  }
}
