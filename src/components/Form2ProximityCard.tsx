import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';
import { PhotoUploader } from './PhotoUploader';

interface Form2Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

export const Form2ProximityCard: React.FC<Form2Props> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  return (
    <div className="page" id="form-3-page">
      {/* WATERMARK */}
      <div className="watermark-overlay" aria-hidden="true">
        <CbbcLogo className="w-full h-auto" />
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title">FORM C · Proximity Access Card Requisition</div>
          </div>
        </div>
        <div className="header-center">
          <CbbcLogo className="w-[58px] h-[58px]" />
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
                placeholder="Full Name"
                value={data.candidateName}
                onChange={(e) => onChange('candidateName', e.target.value)}
              />
            </div>
            <div className="field flex-1">
              <label>Name to appear on Proximity Card</label>
              <input
                type="text"
                placeholder="e.g. S. R. CHOWDHURY"
                value={data.preferredCardName || data.candidateName}
                onChange={(e) => onChange('preferredCardName', e.target.value)}
                className="font-bold uppercase tracking-wider text-[#0f5132]"
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
              <input
                type="text"
                placeholder="P-0000"
                value={data.membershipNo}
                onChange={(e) => onChange('membershipNo', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="photo-box p-1 flex items-center justify-center">
          <PhotoUploader
            label="Member Photo"
            sublabel="Passport Size"
            photoUrl={data.candidatePhotoUrl}
            onPhotoChange={(url) => {
              onChange('candidatePhotoUrl', url);
              if (url) onChange('docPassportPhoto', true);
            }}
            className="w-full h-[120px]"
          />
        </div>
      </div>

      {/* SECTION 01 – DEPENDENT CARDS ENROLLMENT REGISTRY */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Dependent Cards Enrollment Registry</h2>
        </div>
        <p className="text-[7.5px] color-[#6b6b6b] italic mb-[8px] leading-[1.5]">
          The following direct dependents are registered for institutional proximity security cards. Upload or verify physical passports as required by the Club Secretariat.
        </p>

        <div className="dep-grid">
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
                onChange={(e) => onChange('spouseName', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Blood Group</label>
              <select
                value={data.spouseBloodGroup}
                onChange={(e) => onChange('spouseBloodGroup', e.target.value)}
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

          {/* CHILD 01 */}
          <div className="dep-card">
            <div className="dep-type">Child 01</div>
            <div className="dep-photo p-0.5 overflow-hidden">
              <PhotoUploader
                label="Child 01 Photo"
                sublabel="Passport"
                photoUrl={data.child01PhotoUrl}
                onPhotoChange={(url) => {
                  onChange('child01PhotoUrl', url);
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
                value={data.child01Name}
                onChange={(e) => onChange('child01Name', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={data.child01Dob}
                onChange={(e) => onChange('child01Dob', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Blood Group</label>
              <select
                value={data.child01BloodGroup}
                onChange={(e) => onChange('child01BloodGroup', e.target.value)}
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

          {/* CHILD 02 */}
          <div className="dep-card">
            <div className="dep-type">Child 02</div>
            <div className="dep-photo p-0.5 overflow-hidden">
              <PhotoUploader
                label="Child 02 Photo"
                sublabel="Passport"
                photoUrl={data.child02PhotoUrl}
                onPhotoChange={(url) => {
                  onChange('child02PhotoUrl', url);
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
                value={data.child02Name}
                onChange={(e) => onChange('child02Name', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={data.child02Dob}
                onChange={(e) => onChange('child02Dob', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Blood Group</label>
              <select
                value={data.child02BloodGroup}
                onChange={(e) => onChange('child02BloodGroup', e.target.value)}
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

          {/* CHILD 03 */}
          <div className="dep-card">
            <div className="dep-type">Child 03</div>
            <div className="dep-photo p-0.5 overflow-hidden">
              <PhotoUploader
                label="Child 03 Photo"
                sublabel="Passport"
                photoUrl={data.child03PhotoUrl}
                onPhotoChange={(url) => {
                  onChange('child03PhotoUrl', url);
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
                value={data.child03Name}
                onChange={(e) => onChange('child03Name', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={data.child03Dob}
                onChange={(e) => onChange('child03Dob', e.target.value)}
              />
            </div>
            <div className="dep-field">
              <label>Blood Group</label>
              <select
                value={data.child03BloodGroup}
                onChange={(e) => onChange('child03BloodGroup', e.target.value)}
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
        </div>

        <div className="field-row">
          <div className="field w2">
            <label>Spouse NID / Passport</label>
            <input
              type="text"
              placeholder="NID or Passport Number"
              value={data.spouseNidPassport}
              onChange={(e) => onChange('spouseNidPassport', e.target.value)}
            />
          </div>
          <div className="field w15">
            <label>Spouse Mobile No.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.spouseMobile}
              onChange={(e) => onChange('spouseMobile', e.target.value)}
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
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
            />
          </div>
          <div className="field w15">
            <label>Primary Mobile</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.emergencyMobile}
              onChange={(e) => onChange('emergencyMobile', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Relationship</label>
            <select
              value={data.emergencyRelationship}
              onChange={(e) => onChange('emergencyRelationship', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Child">Child</option>
              <option value="Colleague & Close Friend">
                Colleague &amp; Close Friend
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field w15">
            <label>Alternative Tel.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.emergencyAltTel}
              onChange={(e) => onChange('emergencyAltTel', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* WARNING BOX */}
      <div className="warning-box">
        <div className="warn-title">⚠ Important Notice · Security Protocols</div>
        <p>
          Proximity ID cards are the exclusive property of Cox's Bazar Boat Club Ltd. Members and registered dependents must carry these cards at all times on Club premises, lounges, recreational facilities, and dining rooms. Loss of card must be reported immediately to the Secretariat Registrar. Issuance of any <strong>duplicate card</strong> incurs a surcharge of BDT 5,000 and is subject to <strong>security clearance and executive committee review</strong>.
        </p>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Marine Drive, Cox's Bazar, People's Republic of Bangladesh
          <br />
          Tel: +880 1700-000000 | Email: info@coxsbazarboatclub.com | Web: www.coxsbazarboatclub.com
        </div>
        <div className="footer-center">Confidential Document</div>
        <div className="footer-right">Page 3 of 7 &nbsp;|&nbsp; Official Registration Package</div>
      </div>
    </div>
  );
};
