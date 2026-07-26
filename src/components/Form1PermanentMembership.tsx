import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';

interface Form1Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

export const Form1PermanentMembership: React.FC<Form1Props> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  return (
    <div className="page" id="form-1-page">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <CbbcLogo clipPathId="clippath-f1" className="w-[52px] h-[52px]" />
          </div>
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title">Application for Permanent Membership</div>
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

      {/* SECTION 01 – PERSONAL PROFILE */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Personal Profile</h2>
        </div>
        <div className="photo-section">
          <div className="fields-col">
            <div className="field-row">
              <div className="field w3">
                <label>Candidate Full Name</label>
                <input
                  type="text"
                  placeholder="Full name as per NID / Passport"
                  value={data.candidateName}
                  onChange={(e) => onChange('candidateName', e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field w3">
                <label>Father / Husband Name</label>
                <input
                  type="text"
                  value={data.fatherHusbandName}
                  onChange={(e) => onChange('fatherHusbandName', e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field w3">
                <label>Mother's Name</label>
                <input
                  type="text"
                  value={data.motherName}
                  onChange={(e) => onChange('motherName', e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={data.dob}
                  onChange={(e) => onChange('dob', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Nationality</label>
                <select
                  value={data.nationality}
                  onChange={(e) => onChange('nationality', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Blood Group</label>
                <select
                  value={data.bloodGroup}
                  onChange={(e) => onChange('bloodGroup', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="A+">A+ (Positive)</option>
                  <option value="A-">A- (Negative)</option>
                  <option value="B+">B+ (Positive)</option>
                  <option value="B-">B- (Negative)</option>
                  <option value="O+">O+ (Positive)</option>
                  <option value="O-">O- (Negative)</option>
                  <option value="AB+">AB+ (Positive)</option>
                  <option value="AB-">AB- (Negative)</option>
                </select>
              </div>
              <div className="field">
                <label>Religion</label>
                <select
                  value={data.religion}
                  onChange={(e) => onChange('religion', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Islam">Islam</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field w2">
                <label>National ID (NID)</label>
                <input
                  type="text"
                  placeholder="NID Number"
                  value={data.nid}
                  onChange={(e) => onChange('nid', e.target.value)}
                />
              </div>
              <div className="field w2">
                <label>Passport Number (if any)</label>
                <input
                  type="text"
                  placeholder=""
                  value={data.passportNo}
                  onChange={(e) => onChange('passportNo', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="photo-box">
            <div className="photo-label">Candidate Photo</div>
            <div className="photo-size">Passport Size<br />2 inch × 2 inch</div>
            <div className="seal-label">Member Seal</div>
          </div>
        </div>
      </div>

      {/* SECTION 02 – CONTACT INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Contact Information</h2>
        </div>
        <div className="field-row">
          <div className="field w3">
            <label>Present Address</label>
            <input
              type="text"
              placeholder="House, Road, Area, City, Bangladesh"
              value={data.presentAddress}
              onChange={(e) => onChange('presentAddress', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w3">
            <label>Permanent Address</label>
            <input
              type="text"
              placeholder="Permanent / Hometown Address"
              value={data.permanentAddress}
              onChange={(e) => onChange('permanentAddress', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w15">
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.mobile}
              onChange={(e) => onChange('mobile', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 03 – PROFESSIONAL PROFILE */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">03</div>
          <h2>Professional Profile</h2>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Designation</label>
            <input
              type="text"
              placeholder="Job Title / Position"
              value={data.designation}
              onChange={(e) => onChange('designation', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Company / Organization Name</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w3">
            <label>Office Address</label>
            <input
              type="text"
              value={data.officeAddress}
              onChange={(e) => onChange('officeAddress', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Business Nature</label>
            <input
              type="text"
              placeholder="e.g. Maritime, Trade, Services"
              value={data.businessNature}
              onChange={(e) => onChange('businessNature', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Highest Degree</label>
            <input
              type="text"
              value={data.highestDegree}
              onChange={(e) => onChange('highestDegree', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Institution</label>
            <input
              type="text"
              value={data.institution}
              onChange={(e) => onChange('institution', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Year</label>
            <input
              type="text"
              placeholder="YYYY"
              value={data.degreeYear}
              onChange={(e) => onChange('degreeYear', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w15">
            <label>TIN Number</label>
            <input
              type="text"
              value={data.tinNumber}
              onChange={(e) => onChange('tinNumber', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Circle / Zone</label>
            <input
              type="text"
              placeholder="e.g. Circle 12, Zone 2 (Chittagong)"
              value={data.circleZone}
              onChange={(e) => onChange('circleZone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 04 – SPOUSE & CHILDREN DETAILS */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">04</div>
          <h2>Spouse &amp; Children Details</h2>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Spouse Full Name</label>
            <input
              type="text"
              value={data.spouseName}
              onChange={(e) => onChange('spouseName', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Spouse Blood Group</label>
            <select
              value={data.spouseBloodGroup}
              onChange={(e) => onChange('spouseBloodGroup', e.target.value)}
            >
              <option value="">Select</option>
              <option value="A+">A+ (Positive)</option>
              <option value="A-">A- (Negative)</option>
              <option value="B+">B+ (Positive)</option>
              <option value="B-">B- (Negative)</option>
              <option value="O+">O+ (Positive)</option>
              <option value="O-">O- (Negative)</option>
              <option value="AB+">AB+ (Positive)</option>
              <option value="AB-">AB- (Negative)</option>
            </select>
          </div>
          <div className="field w15">
            <label>Spouse NID / Passport</label>
            <input
              type="text"
              value={data.spouseNidPassport}
              onChange={(e) => onChange('spouseNidPassport', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Child 01 – Name</label>
            <input
              type="text"
              value={data.child01Name}
              onChange={(e) => onChange('child01Name', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={data.child01Dob}
              onChange={(e) => onChange('child01Dob', e.target.value)}
            />
          </div>
          <div className="field">
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
        <div className="field-row">
          <div className="field">
            <label>Child 02 – Name</label>
            <input
              type="text"
              value={data.child02Name}
              onChange={(e) => onChange('child02Name', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={data.child02Dob}
              onChange={(e) => onChange('child02Dob', e.target.value)}
            />
          </div>
          <div className="field">
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
      </div>

      {/* SECTION 05 – DECLARATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">05</div>
          <h2>Declaration</h2>
        </div>
        <p className="text-[8px] color-[#6b6b6b] leading-[1.6] mb-[10px]">
          I hereby declare that all information provided in this application is true and correct to the best of my knowledge. I agree to abide by the rules, regulations, and bye-laws of Cox's Bazar Boat Club Ltd. and understand that any false declaration may result in disqualification or cancellation of membership.
        </p>
        <div className="field-row mt-[14px]">
          <div className="field w2">
            <label>Applicant's Signature</label>
            <div className="border-b border-[#c8c8c8] h-[24px]"></div>
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={docDate}
              onChange={(e) => onChange('dob', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Proposer's Name &amp; Signature</label>
            <div className="border-b border-[#c8c8c8] h-[24px]"></div>
          </div>
        </div>
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
