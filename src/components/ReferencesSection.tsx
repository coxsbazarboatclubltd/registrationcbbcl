import React from 'react';
import { MemberFormData } from '../types';

interface ReferencesSectionProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="section">
      <div className="section-title flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="section-num">06</div>
          <h2>Reference Information</h2>
        </div>
        <span className="text-[8px] text-[#9d7f46] font-semibold italic bg-[#f8f5ee] px-2 py-0.5 rounded border border-[#9d7f46]/30">
          * References should not be immediate family members
        </span>
      </div>

      <p className="text-[8px] text-[#6b6b6b] mb-3 leading-relaxed">
        Please provide details of two reputable references who can vouch for your character and standing. Note: References must not be immediate family members.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* REFERENCE 1 */}
        <div className="bg-[#faf8f5] border border-[#9d7f46]/30 rounded-lg p-2.5">
          <div className="border-b border-[#9d7f46]/30 pb-1 mb-2 font-bold text-[10px] text-[#1a2744] uppercase tracking-wider flex items-center gap-1.5">
            <span className="bg-[#1a2744] text-[#c4a56a] w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px]">1</span>
            Reference 1
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name of Reference 1"
                  value={data.ref1Name}
                  onChange={(e) => onChange('ref1Name', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Club Member No. (if member)</label>
                <input
                  type="text"
                  placeholder="e.g. P-0112 (optional)"
                  value={data.ref1MemNo}
                  onChange={(e) => onChange('ref1MemNo', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Business Associate"
                  value={data.ref1Relationship}
                  onChange={(e) => onChange('ref1Relationship', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Organization</label>
                <input
                  type="text"
                  placeholder="Company / Organization"
                  value={data.ref1Organization}
                  onChange={(e) => onChange('ref1Organization', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Designation</label>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={data.ref1Designation}
                  onChange={(e) => onChange('ref1Designation', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+880"
                  value={data.ref1Phone}
                  onChange={(e) => onChange('ref1Phone', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Email Address</label>
              <input
                type="email"
                placeholder="ref1@example.com"
                value={data.ref1Email}
                onChange={(e) => onChange('ref1Email', e.target.value)}
                className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
              />
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Address</label>
              <input
                type="text"
                placeholder="Office or official address"
                value={data.ref1Address}
                onChange={(e) => onChange('ref1Address', e.target.value)}
                className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
              />
            </div>

            <div className="pt-3 mt-1 border-t border-dashed border-[#9d7f46]/40 text-center">
              <div className="h-[26px]" />
              <div className="border-t border-[#1a2744] pt-1 text-[8px] font-bold uppercase text-[#1a2744]">
                Signature of Reference 1
              </div>
            </div>
          </div>
        </div>

        {/* REFERENCE 2 */}
        <div className="bg-[#faf8f5] border border-[#9d7f46]/30 rounded-lg p-2.5">
          <div className="border-b border-[#9d7f46]/30 pb-1 mb-2 font-bold text-[10px] text-[#1a2744] uppercase tracking-wider flex items-center gap-1.5">
            <span className="bg-[#1a2744] text-[#c4a56a] w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px]">2</span>
            Reference 2
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name of Reference 2"
                  value={data.ref2Name}
                  onChange={(e) => onChange('ref2Name', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Club Member No. (if member)</label>
                <input
                  type="text"
                  placeholder="e.g. P-0488 (optional)"
                  value={data.ref2MemNo}
                  onChange={(e) => onChange('ref2MemNo', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Professional Senior"
                  value={data.ref2Relationship}
                  onChange={(e) => onChange('ref2Relationship', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Organization</label>
                <input
                  type="text"
                  placeholder="Company / Organization"
                  value={data.ref2Organization}
                  onChange={(e) => onChange('ref2Organization', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Designation</label>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={data.ref2Designation}
                  onChange={(e) => onChange('ref2Designation', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+880"
                  value={data.ref2Phone}
                  onChange={(e) => onChange('ref2Phone', e.target.value)}
                  className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Email Address</label>
              <input
                type="email"
                placeholder="ref2@example.com"
                value={data.ref2Email}
                onChange={(e) => onChange('ref2Email', e.target.value)}
                className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
              />
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase text-[#1a2744]">Address</label>
              <input
                type="text"
                placeholder="Office or official address"
                value={data.ref2Address}
                onChange={(e) => onChange('ref2Address', e.target.value)}
                className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-white text-[#2c2c2c] focus:outline-none focus:border-[#1a2744]"
              />
            </div>

            <div className="pt-3 mt-1 border-t border-dashed border-[#9d7f46]/40 text-center">
              <div className="h-[26px]" />
              <div className="border-t border-[#1a2744] pt-1 text-[8px] font-bold uppercase text-[#1a2744]">
                Signature of Reference 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
