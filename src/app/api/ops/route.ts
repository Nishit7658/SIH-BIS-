import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/server/services/admin.service";
import { apiSuccess, apiError } from "@/server/utils/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const tickets = AdminService.getOpsTickets();

  // If empty, populate initial default tickets
  if (tickets.length === 0) {
    AdminService.createOpsTicket({
      query: "Can 10A plugs manufactured under IS 1293 Amendment 2 be exported to ASEAN without dual-pin retesting?",
      userContext: "Manufacturer inquiry regarding mutual recognition agreements (MRA).",
      priority: "HIGH",
      assignedOfficer: "Dr. R. Sharma (Electrotechnical Committee)",
    });
    AdminService.createOpsTicket({
      query: "Clarification on flame retardant test chamber dimensions under IS 694 Annexure D.",
      userContext: "Cable testing laboratory seeking calibration tolerance threshold.",
      priority: "MEDIUM",
      assignedOfficer: "Er. S. Meena (Chemical / Cable Division)",
    });
  }

  const activeTickets = AdminService.getOpsTickets();

  return NextResponse.json({
    success: true,
    activeTickets,
    totalCount: activeTickets.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, userContext = "Self-escalated from digital expert", priority = "HIGH" } = body;

    const newTicket = AdminService.createOpsTicket({
      query: query || "General Technical Standard Inquiry",
      userContext,
      priority,
      assignedOfficer: "Assigned to BIS Technical Liaison Desk",
    });

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Escalation ticket dispatched to BIS Sectional Committee.",
    });
  } catch (error: any) {
    return apiError("SERVER_ERROR", "Failed to create escalation ticket.", 500);
  }
}
