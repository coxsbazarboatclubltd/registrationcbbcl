import React, { useState, useMemo } from 'react';
import { Form1PermanentMembership } from './components/Form1PermanentMembership';
import { Form2ProximityCard } from './components/Form2ProximityCard';
import { Form3ProfileSync } from './components/Form3ProfileSync';
import { CbbcLogo } from './components/CbbcLogo';
import { MemberFormData, SAMPLE_MEMBER_DATA, EMPTY_MEMBER_DATA } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<MemberFormData>(SAMPLE_MEMBER_DATA);

  // Auto-generate Doc Numbers and Date once on initial load
  const { dateStr, docNo1, docNo2, docNo3 } = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const cleanDate = dStr.replace(/-/g, '');
    const timeBase = String(now.getTime()).slice(-5);

    const uid1 = timeBase + String(Math.floor(Math.random() * 900) + 100);
    const uid2 = timeBase + String(Math.floor(Math.random() * 900) + 100);
    const uid3 = timeBase + String(Math.floor(Math.random() * 900) + 100);

    return {
      dateStr: dStr,
      docNo1: `CBBC-PM-${cleanDate}-${uid1}`,
      docNo2: `CBBC-PX-${cleanDate}-${uid2}`,
      docNo3: `CBBC-PS-${cleanDate}-${uid3}`,
    };
  }, []);

  const handleFieldChange = (field: keyof MemberFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e8e8]">
      {/* SECTION A: TOP BAR (Hidden on print) */}
      <header className="top-bar no-print">
        <div className="flex items-center gap-3">
          <CbbcLogo clipPathId="clippath-topbar" className="w-[42px] h-[42px]" />
          <div className="text-left hidden sm:block">
            <span className="text-[7px] text-gray-300 tracking-[1.5px] uppercase block">
              Established 2026
            </span>
            <span className="font-['Cinzel'] text-[13px] font-bold text-[#c4a56a] tracking-[1px]">
              COX'S BAZAR BOAT CLUB
            </span>
          </div>
        </div>

        <div className="title-center">COX'S BAZAR BOAT CLUB LTD.</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFormData(SAMPLE_MEMBER_DATA)}
            className="text-[9px] uppercase tracking-wider text-[#c4a56a] hover:text-white underline transition-colors cursor-pointer mr-2"
            title="Pre-fill with sample member profile"
          >
            Sample Data
          </button>
          <button
            onClick={() => setFormData(EMPTY_MEMBER_DATA)}
            className="text-[9px] uppercase tracking-wider text-gray-400 hover:text-white underline transition-colors cursor-pointer mr-2"
            title="Reset form fields"
          >
            Clear Form
          </button>
          <div className="portal-label">Member Portal</div>
        </div>
      </header>

      {/* THREE TAB BUTTONS (Hidden on print) */}
      <nav className="tab-nav no-print">
        <button
          className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <span>01</span> Application for Permanent Membership
        </button>
        <button
          className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          <span>02</span> Database for Proximity ID Card
        </button>
        <button
          className={`tab-btn ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          <span>03</span> Profile Synchronization &amp; Database Form
        </button>
      </nav>

      {/* CANVAS & ACTIVE FORM PANEL */}
      <main className="canvas-container flex-1">
        {/* Floating / Top Print Button (Hidden on print) */}
        <div className="print-btn-wrap no-print">
          <button onClick={handlePrint} className="print-btn">
            🖨 Print / Save as PDF
          </button>
        </div>

        {/* Form 1 */}
        <div className={`form-panel ${activeTab === 1 ? 'block' : 'hidden'}`}>
          <Form1PermanentMembership
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo1}
            docDate={dateStr}
          />
        </div>

        {/* Form 2 */}
        <div className={`form-panel ${activeTab === 2 ? 'block' : 'hidden'}`}>
          <Form2ProximityCard
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo2}
            docDate={dateStr}
          />
        </div>

        {/* Form 3 */}
        <div className={`form-panel ${activeTab === 3 ? 'block' : 'hidden'}`}>
          <Form3ProfileSync
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo3}
            docDate={dateStr}
          />
        </div>
      </main>
    </div>
  );
}
