import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';

interface FormBProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const childField = (i: number, suffix: string) => `child${pad2(i)}${suffix}` as keyof MemberFormData;

export const FormBProfessionalFamily: React.FC<FormBProps> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  const childCount = Math.min(Math.max(Number(data.numberOfChildren) || 0, 0), 6);
  const childIndexes = Array.from({ length: childCount }, (_, i) => i + 1);

  return (
    <div className="page" id="form-2-page">
      {/* WATERMARK */}
      <div className="watermark-overlay" aria-hidden="true">
        <CbbcWatermarkLogo className="w-full h-auto" />
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1 className="whitespace-nowrap">COX'S BAZAR BOAT CLUB LTD.</h1>
            <div className="sub">
              Level 9, House 28, Block A, Kolatoli R/A.<br />
              4700, Cox's Bazar, Bangladesh
            </div>
            <div className="site-url">www.coxsbazarboatclubltd.com</div>
          </div>
        </div>
        <div className="header-center">
          <CbbcLogo className="w-[92px] h-[92px]" />
        </div>
        <div className="header-right">
          <table className="doc-table">
            <tbody>
              <tr>
                <td>Registration No.:</td>
                <td className="font-bold text-[#0f5132]">{data.registrationNumber || 'CBBCL-2026-000001'}</td>
              </tr>
              <tr>
                <td>Document No.:</td>
                <td>{docNo || 'CBBCL-DOC-20260726-00001'}</td>
              </tr>
              <tr>
                <td>Application Date:</td>
                <td>{docDate}</td>
              </tr>
              <tr>
                <td>Document Version:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
          <div className="form-title text-[#1a2744]">FORM B · Professional &amp; Family Information</div>
        </div>
      </div>

      {/* SECTION 01 – PROFESSIONAL & BUSINESS INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Professional &amp; Business Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mb-2">
          {/* Two Column Pair 1: Designation & Company */}
          <div className="field">
            <label>Designation / Job Title</label>
            <input
              type="text"
              placeholder="Designation / Position"
              value={data.designation}
              onChange={(e) => onChange('designation', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Company / Organization Name</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </div>

          <div className="field col-span-2">
            <label>Office / Business Address</label>
            <input
              type="text"
              placeholder="Full office address"
              value={data.officeAddress}
              onChange={(e) => onChange('officeAddress', e.target.value)}
            />
          </div>

          {/* Two Column Pair 2: Business Nature & Work Phone */}
          <div className="field">
            <label>Business Nature / Sector</label>
            <input
              type="text"
              placeholder="e.g. Commerce, Trade, Services"
              value={data.businessNature}
              onChange={(e) => onChange('businessNature', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Office Telephone / Work Contact</label>
            <input
              type="tel"
              placeholder="Office Phone / Ext"
              value={data.officeTel}
              onChange={(e) => onChange('officeTel', e.target.value)}
            />
          </div>

          {/* Two Column Pair 3: Highest Degree & Institution */}
          <div className="field">
            <label>Highest Degree</label>
            <input
              type="text"
              placeholder="e.g. B.Sc, MBA, Ph.D"
              value={data.highestDegree}
              onChange={(e) => onChange('highestDegree', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Institution / University</label>
            <input
              type="text"
              value={data.institution}
              onChange={(e) => onChange('institution', e.target.value)}
            />
          </div>

          {/* Two Column Pair 4: Graduation Year & TIN Number */}
          <div className="field">
            <label>Year of Graduation</label>
            <input
              type="text"
              placeholder="YYYY"
              value={data.degreeYear}
              onChange={(e) => onChange('degreeYear', e.target.value)}
            />
          </div>

          <div className="field">
            <label>TIN Number (Taxpayer ID)</label>
            <input
              type="text"
              value={data.tinNumber}
              onChange={(e) => onChange('tinNumber', e.target.value)}
            />
          </div>

          {/* Two Column Pair 5: Circle/Zone */}
          <div className="field col-span-2">
            <label>Tax Circle / Zone</label>
            <input
              type="text"
              placeholder="e.g. Circle 12, Zone 2, Dhaka"
              value={data.circleZone}
              onChange={(e) => onChange('circleZone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 02 – FAMILY & DEPENDENT INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Family &amp; Dependent Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mb-2">
          {/* Spouse Details */}
          <div className="field">
            <label>Spouse Full Name</label>
            <input
              type="text"
              value={data.spouseName}
              onChange={(e) => onChange('spouseName', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Spouse Date of Birth &amp; Anniversary</label>
            <div className="flex gap-2">
              <input
                type="date"
                title="Spouse Date of Birth"
                value={data.spouseDob}
                onChange={(e) => onChange('spouseDob', e.target.value)}
                className="flex-1"
              />
              <input
                type="date"
                title="Wedding Anniversary Date"
                value={data.weddingAnniversary}
                onChange={(e) => onChange('weddingAnniversary', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="field">
            <label>Spouse Blood Group &amp; NID / Passport</label>
            <div className="flex gap-2">
              <select
                value={data.spouseBloodGroup}
                onChange={(e) => onChange('spouseBloodGroup', e.target.value)}
                className="w-24"
              >
                <option value="">Blood</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <input
                type="text"
                placeholder="Spouse NID / Passport"
                value={data.spouseNidPassport}
                onChange={(e) => onChange('spouseNidPassport', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="field">
            <label>Spouse Mobile Contact &amp; Email</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+880"
                value={data.spouseMobile}
                onChange={(e) => onChange('spouseMobile', e.target.value)}
                className="w-1/2"
              />
              <input
                type="email"
                placeholder="Spouse Email"
                value={data.spouseEmail}
                onChange={(e) => onChange('spouseEmail', e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Children Information */}
          <div className="col-span-2 border-t border-[#9d7f46]/20 pt-2 mt-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-[9px] uppercase tracking-wider text-[#1a2744]">
                Children Information
              </label>
              <div className="field w-24 !mb-0">
                <label>No. of Children</label>
                <select
                  value={data.numberOfChildren}
                  onChange={(e) => onChange('numberOfChildren', Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={childIndexes.length > 3 ? 'compact-child' : undefined}>
            {childIndexes.map((i) => (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 bg-white/60 p-1.5 rounded border border-[#c8c8c8]" key={i}>
                <div className="field md:col-span-1">
                  <label>Child {pad2(i)} – Name</label>
                  <input
                    type="text"
                    placeholder={`Child ${i} Name`}
                    value={data[childField(i, 'Name')] as string}
                    onChange={(e) => onChange(childField(i, 'Name'), e.target.value)}
                  />
                </div>
                <div className="field md:col-span-1">
                  <label>DOB &amp; Gender</label>
                  <div className="flex gap-1">
                    <input
                      type="date"
                      value={data[childField(i, 'Dob')] as string}
                      onChange={(e) => onChange(childField(i, 'Dob'), e.target.value)}
                      className="w-2/3"
                    />
                    <select
                      value={data[childField(i, 'Gender')] as string}
                      onChange={(e) => onChange(childField(i, 'Gender'), e.target.value)}
                      className="w-1/3"
                    >
                      <option value="">Sex</option>
                      <option value="Male">M</option>
                      <option value="Female">F</option>
                    </select>
                  </div>
                </div>
                <div className="field md:col-span-1">
                  <label>School / Occupation</label>
                  <input
                    type="text"
                    placeholder="School or Work"
                    value={data[childField(i, 'SchoolOccupation')] as string}
                    onChange={(e) => onChange(childField(i, 'SchoolOccupation'), e.target.value)}
                  />
                </div>
                <div className="field md:col-span-1">
                  <label>Blood Group</label>
                  <select
                    value={data[childField(i, 'BloodGroup')] as string}
                    onChange={(e) => onChange(childField(i, 'BloodGroup'), e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 03 – COMMUNICATION & EMERGENCY CONTACT */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">03</div>
          <h2>Communication Preferences &amp; Emergency Contact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mb-2">
          {/* Preferences */}
          <div className="field">
            <label>Preferred Mailing Address</label>
            <select
              value={data.preferredMailingAddress}
              onChange={(e) => onChange('preferredMailingAddress', e.target.value as any)}
            >
              <option value="present">Present Address</option>
              <option value="office">Office Address</option>
              <option value="permanent">Permanent Address</option>
            </select>
          </div>

          <div className="field">
            <label>Communication Preference</label>
            <select
              value={data.commPreference}
              onChange={(e) => onChange('commPreference', e.target.value as any)}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>

          <div className="field border-t border-[#9d7f46]/20 pt-2 col-span-2 md:col-span-1">
            <label>Emergency Contact Person</label>
            <input
              type="text"
              placeholder="Full name of emergency contact"
              value={data.emergencyContactName}
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
            />
          </div>

          <div className="field border-t border-[#9d7f46]/20 pt-2 col-span-2 md:col-span-1">
            <label>Relationship</label>
            <input
              type="text"
              placeholder="e.g. Spouse, Brother, Business Partner"
              value={data.emergencyRelationship}
              onChange={(e) => onChange('emergencyRelationship', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Emergency Mobile Number</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.emergencyMobile}
              onChange={(e) => onChange('emergencyMobile', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Alternative Telephone</label>
            <input
              type="tel"
              placeholder="Residence / Alt Phone"
              value={data.emergencyAltTel}
              onChange={(e) => onChange('emergencyAltTel', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Tel: +880 13328 86688<br />
          Email: registration@cbbcl.org<br />
          info@cbbcl.org
        </div>
        <div className="footer-right-group">
          <div className="footer-center">Confidential Document</div>
          <div className="footer-right">Page 2 of 7 &nbsp;|&nbsp; Official Registration Package</div>
        </div>
      </div>
    </div>
  );
};
