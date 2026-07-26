import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';

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
    <div className="page" id="form-2-page">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <CbbcLogo clipPathId="clippath-f2" className="w-[52px] h-[52px]" />
          </div>
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title">Database for Proximity ID Card</div>
          </div>
        </div>
        <div className="header-right">
          <table className="doc-table">
            <tbody>
              <tr>
                <td>DOC NO:</td>
                <td>{docNo}</td>
              </tr>
              <tr>
                <td>DATE:</td>
                <td>{docDate}</td>
              </tr>
              <tr>
                <td>VER/REV:</td>
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
            <div className="field w2">
              <label>Primary Member</label>
              <input
                type="text"
                placeholder="Full Name"
                value={data.candidateName}
                onChange={(e) => onChange('candidateName', e.target.value)}
              />
            </div>
            <div className="field">
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
        <div className="photo-box">
          <div className="photo-label">Member Photo</div>
          <div className="photo-size">Passport Size<br />Colour Name</div>
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
            <div className="dep-photo">
              <span>Photo<br />Passport</span>
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
            <div className="dep-photo">
              <span>Photo<br />Passport</span>
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
            <div className="dep-photo">
              <span>Photo<br />Passport</span>
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
            <div className="dep-photo">
              <span>Photo<br />Passport</span>
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
          Proximity ID cards are the exclusive property of Cox's Bazar Boat Club Ltd. Members and registered dependents must carry these cards at all times on Club premises, deep sea vessels, marine berths, and swimming bays. Loss of card must be reported immediately to the Secretariat Registrar. Issuance of any <strong>duplicate card</strong> incurs a surcharge of BDT 5,000 and is subject to <strong>security clearance and executive committee review</strong>.
        </p>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Marine Drive, Cox's Bazar, Bangladesh
        </div>
        <div className="footer-center">Confidential Institutional Document</div>
        <div className="footer-right">Page 1 of 1 &nbsp;|&nbsp; Print-Ready A4</div>
      </div>
    </div>
  );
};
