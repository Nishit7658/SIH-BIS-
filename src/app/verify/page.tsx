"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LicenseRecord } from "@/lib/verify-data";
import {
  ShieldCheck,
  Search,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Calendar,
  Award,
  ExternalLink,
  Camera,
  Sparkles
} from "lucide-react";

export default function VerifyPage() {
  const { t } = useApp();
  const [cmlInput, setCmlInput] = useState("CM/L-8400012345");
  const [record, setRecord] = useState<LicenseRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);
  const [qrScanning, setQrScanning] = useState(false);

  const handleVerify = async (cmlToQuery?: string) => {
    const target = cmlToQuery || cmlInput;
    if (!target.trim()) return;

    setLoading(true);
    setNotFoundMsg(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/verify?cml=${encodeURIComponent(target.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setRecord(data.record);
      } else {
        const data = await res.json();
        setRecord(null);
        setNotFoundMsg(data.message || "License record not found.");
      }
    } catch (e) {
      setRecord(null);
      setNotFoundMsg("Error querying verification registry.");
    } finally {
      setLoading(false);
    }
  };

  const sampleLicenses = [
    { cml: "CM/L-8400012345", label: "Anchor (IS 1293) — ACTIVE" },
    { cml: "CM/L-9123456789", label: "Havells (IS 694) — ACTIVE" },
    { cml: "CM/L-3344556677", label: "Ganesh Heater — EXPIRED" },
    { cml: "CM/L-5566778899", label: "Speedy Plugs — SUSPENDED" },
    { cml: "R-41001234", label: "Samsung Battery — CRS ACTIVE" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          ISI Mark & CRS Authenticity Registry
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-bis-navy font-display">
          BIS License & Certificate Verification
        </h1>
        <p className="text-bis-text-secondary text-sm leading-relaxed max-w-3xl">
          Validate the authenticity of ISI Mark CM/L numbers and Compulsory Registration Scheme (CRS) licenses before purchasing, distribution, or lab testing.
        </p>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-bis-border shadow-xs space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cmlInput}
              onChange={(e) => setCmlInput(e.target.value)}
              placeholder="Enter CM/L Number (e.g. CM/L-8400012345) or CRS Registration Number..."
              className="w-full pl-11 pr-4 py-3 bg-bis-canvas border border-bis-border rounded-xl text-sm font-semibold text-bis-navy focus:outline-none focus:ring-2 focus:ring-bis-blue/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setQrScanning(!qrScanning)}
              className="px-4 py-3 bg-bis-canvas hover:bg-slate-200 text-bis-navy border border-bis-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              title="Simulate QR Code Scan"
            >
              <QrCode className="w-4 h-4 text-bis-blue" />
              <span>Scan QR</span>
            </button>

            <button
              type="submit"
              disabled={loading || !cmlInput.trim()}
              className="px-6 py-3 bg-bis-navy hover:bg-bis-navy-light disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <ShieldCheck className="w-4 h-4 text-bis-saffron" />
              <span>Verify License</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Clickers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-slate-400 font-semibold">Test Sample Licenses:</span>
          {sampleLicenses.map((s) => (
            <button
              key={s.cml}
              onClick={() => {
                setCmlInput(s.cml);
                handleVerify(s.cml);
              }}
              className="px-2.5 py-1 rounded-lg bg-bis-canvas hover:bg-slate-200 text-slate-700 border border-bis-border text-[11px] font-mono transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* QR Scanner Simulation Card */}
      {qrScanning && (
        <div className="bg-bis-navy text-white p-6 rounded-2xl border border-bis-navy-light space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 text-bis-saffron" />
              Digital Camera / QR Code Reader Active
            </h3>
            <button onClick={() => setQrScanning(false)} className="text-xs text-slate-400 hover:text-white">
              Close Camera
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Align the ISI Mark QR code printed on the product packaging within the target frame.
          </p>
          <div className="h-32 border-2 border-dashed border-bis-saffron/60 rounded-xl flex items-center justify-center bg-black/30">
            <button
              onClick={() => {
                setCmlInput("CM/L-8400012345");
                setQrScanning(false);
                handleVerify("CM/L-8400012345");
              }}
              className="px-4 py-2 bg-bis-saffron hover:bg-bis-saffron-dark text-white rounded-lg text-xs font-bold shadow-md"
            >
              Simulate Successful QR Detect (Anchor 16A Socket)
            </button>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {searched && (
        <div>
          {record ? (
            <div className="bg-white rounded-3xl border border-bis-border p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-bis-border pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-bis-blue bg-bis-blue-soft px-3 py-1 rounded-lg">
                      {record.cmlNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        record.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : record.status === "EXPIRED"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      ● {record.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-bis-navy font-display mt-2">{record.brand}</h2>
                  <p className="text-xs text-bis-text-secondary">{record.productName}</p>
                </div>

                <div className="p-3 bg-bis-canvas rounded-2xl border border-bis-border text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Governing Standard</span>
                  <p className="font-mono font-bold text-base text-bis-navy mt-0.5">{record.standardCode}</p>
                </div>
              </div>

              {/* Status Specific Banners */}
              {record.status === "EXPIRED" && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    <strong>Caution:</strong> This BIS certification expired on <strong>{record.validUpto}</strong>. Products manufactured after this date are not legally authorized to bear the ISI Mark.
                  </span>
                </div>
              )}

              {record.status === "SUSPENDED" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>
                    <strong>Enforcement Action:</strong> This license has been <strong>SUSPENDED</strong> by the Bureau of Indian Standards due to factory surveillance non-conformity. Immediate stop-sale applies.
                  </span>
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-bis-blue" />
                    Licensee / Manufacturer
                  </span>
                  <p className="font-bold text-bis-navy text-sm">{record.applicantName}</p>
                </div>

                <div className="p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-bis-blue" />
                    Validity Window
                  </span>
                  <p className="font-bold text-bis-navy text-sm">
                    {record.issueDate} to {record.validUpto}
                  </p>
                </div>

                <div className="sm:col-span-2 p-4 bg-bis-canvas rounded-xl border border-bis-border space-y-1">
                  <span className="text-slate-500 font-medium">Licensed Manufacturing Facility Location</span>
                  <p className="font-bold text-bis-navy text-xs">{record.factoryAddress}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-900">Unregistered / Counterfeit Risk</h3>
              <p className="text-xs text-red-800 max-w-lg mx-auto leading-relaxed">
                {notFoundMsg}
              </p>
              <div className="pt-2">
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Search National e-BIS Database
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
