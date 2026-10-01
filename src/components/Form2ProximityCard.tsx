import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { formatLongDate } from '../utils/formatDate';

interface Form2Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const childField = (i: number, suffix: string) => `child${pad2(i)}${suffix}` as keyof MemberFormData;

export const Form2ProximityCard: React.FC<Form2Props> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  const childCount = Math.min(Math.max(Number(data.numberOfChildren) || 0, 0), 6);
  const childIndexes = Array.from({ length: childCount }, (_, i) => i + 1);

  return (
    <div className="page" id="form-3-page">
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
              Anderson Road,<br />
              Cox's Bazar 4700. Bangladesh.
            </div>
            <div className="site-url">www.cbbcl.org</div>
          </div>
        </div>
        <div className="header-center">
          <CbbcWatermarkLogo className="w-[92px] h-[92px]" />
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
                <td>{formatLongDate(docDate)}</td>
              </tr>
              <tr>
                <td>Document Version:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
          <div className="form-title text-[#1a2744]">FORM C · Proximity Access Card Requisition</div>
        </div>
      </div>

      {/* PRIMARY MEMBER BAR */}
      <div className="primary-bar">
        <div className="fields">
          <div className="pb-row">
            <div className="field flex-1">
              <label>Primary Member Name</label>
              <input
                type="text"
                readOnly
                title="Filled automatically from Form A"
                value={data.candidateName}
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="field flex-1">
              <label>Name to appear on Proximity Card</label>
              <input
                type="text"
                readOnly
                title="Filled automatically from Form A"
                value={data.candidateName}
                className="bg-gray-100 cursor-not-allowed font-bold uppercase tracking-wider text-[#0f5132]"
              />
            </div>
            <div className="field w-28">
              <label>Category</label>
              <input
                type="text"
                readOnly
                value={data.membershipCategory || 'Permanent Member'}
                className="bg-gray-100 font-bold text-[#1a2744]"
              />
            </div>
            <div className="field w-28">
              <label>Membership No.</label>
              {/* Assigned by the Secretariat after approval — never applicant-editable */}
              <input
                type="text"
                readOnly
                title="Assigned by the Club Secretariat after approval"
                value=""
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        <div className="photo-box p-1 flex items-center justify-center">
          <PhotoUploader
                  locked
            label="Member Photo"
            sublabel="Passport Size"
            photoUrl={data.candidatePhotoUrl}
            onPhotoChange={(url) => {
              onChange('candidatePhotoUrl', url);
              if (url) onChange('docPassportPhoto', true);
            }}
            className="w-full h-[135px]"
          />
        </div>
      </div>

      {/* SECTION 01 – DEPENDENT CARDS ENROLLMENT REGISTRY */}
      <div className="section">
        <div className="section-title flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="section-num">01</div>
            <h2>Dependent Cards Enrollment Registry</h2>
          </div>
          <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[1px] text-[var(--label)]" title="Filled automatically from an earlier page">
            No. of Children:
            <span className="locked-field px-2 py-0.5 rounded border border-[var(--border)] text-[9px] text-[var(--text)]">{data.numberOfChildren}</span>
          </div>
        </div>
        <p className="text-[7.5px] color-[#6b6b6b] italic mb-[8px] leading-[1.5]">
          The following direct dependents are registered for institutional proximity security cards. Upload or verify physical passports as required by the Club Secretariat.
        </p>

        <div className={`dep-grid${childCount + 1 > 4 ? ' compact' : ''}`}>
          {/* SPOUSE */}
          <div className="dep-card">
            <div className="dep-type">Spouse</div>
            <div className="dep-photo p-0.5 overflow-hidden">
              <PhotoUploader
                label="Spouse Photo"
                sublabel="Passport"
                photoUrl={data.spousePhotoUrl}
                onPhotoChange={(url) => {
                  onChange('spousePhotoUrl', url);
                  if (url) onChange('docSpousePhoto', true);
                }}
                className="w-full h-full border-none bg-transparent"
              />
            </div>
            <div className="dep-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Spouse name"
                value={data.spouseName}
                readOnly
                className="locked-field"
                title="Filled automatically from an earlier page"
              />
            </div>
            <div className="dep-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={data.spouseDob}
                readOnly
                className="locked-field"
                title="Filled automatically from an earlier page"
              />
            </div>
            <div className="dep-field">
              <label>Blood Group</label>
              <select
                value={data.spouseBloodGroup}
                disabled
                className="locked-field"
                title="Filled automatically from an earlier page"
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

          {/* CHILDREN (dynamic based on No. of Children) */}
          {childIndexes.map((i) => (
            <div className="dep-card" key={i}>
              <div className="dep-type">Child {pad2(i)}</div>
              <div className="dep-photo p-0.5 overflow-hidden">
                <PhotoUploader
                  label={`Child ${pad2(i)} Photo`}
                  sublabel="Passport"
                  photoUrl={data[childField(i, 'PhotoUrl')] as string | undefined}
                  onPhotoChange={(url) => {
                    onChange(childField(i, 'PhotoUrl'), url);
                    if (url) onChange('docChildrenPhoto', true);
                  }}
                  className="w-full h-full border-none bg-transparent"
                />
              </div>
              <div className="dep-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Child name"
                  value={data[childField(i, 'Name')] as string}
                  readOnly
                  className="locked-field"
                  title="Filled automatically from an earlier page"
                />
              </div>
              <div className="dep-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={data[childField(i, 'Dob')] as string}
                  readOnly
                  className="locked-field"
                  title="Filled automatically from an earlier page"
                />
              </div>
              <div className="dep-field">
                <label>Blood Group</label>
                <select
                  value={data[childField(i, 'BloodGroup')] as string}
                  disabled
                  className="locked-field"
                  title="Filled automatically from an earlier page"
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

        <div className="field-row">
          <div className="field w2">
            <label>Spouse NID / Passport</label>
            <input
              type="text"
              placeholder="NID or Passport Number"
              value={data.spouseNidPassport}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
          <div className="field w15">
            <label>Spouse Mobile No.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.spouseMobile}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
        </div>
      </div>

      {/* SECTION 02 – EMERGENCY CONTACT PROFILE */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Emergency Contact Profile</h2>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Contact Full Name</label>
            <input
              type="text"
              placeholder="Emergency contact person"
              value={data.emergencyContactName}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
          <div className="field w15">
            <label>Primary Mobile</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.emergencyMobile}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Relationship</label>
            <input
              type="text"
              value={data.emergencyRelationship}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
          <div className="field w15">
            <label>Alternative Tel.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.emergencyAltTel}
              readOnly
              className="locked-field"
              title="Filled automatically from an earlier page"
            />
          </div>
        </div>
      </div>

      {/* WARNING BOX */}
      <div className="warning-box">
        <div className="warn-title inline-flex items-center gap-1">
          <AlertTriangle className="w-[10px] h-[10px] shrink-0" aria-hidden="true" /> Important Notice · Security Protocols
        </div>
        <p>
          Proximity ID cards are the exclusive property of Cox's Bazar Boat Club Ltd. Members and registered dependents must carry these cards at all times on Club premises, lounges, recreational facilities, and dining rooms. Loss of card must be reported immediately to the Secretariat Registrar. Issuance of any <strong>duplicate card</strong> incurs a surcharge of BDT 5,000 and is subject to <strong>security clearance and executive committee review</strong>.
        </p>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Tel: +880 13328 86688<br />
          Email: registration@cbbcl.org
        </div>
        <div className="footer-right-group">
          <div className="footer-center">Confidential Document</div>
          <div className="footer-right">Page 3 of 7 &nbsp;|&nbsp; Official Registration Form</div>
        </div>
      </div>
    </div>
  );
};
