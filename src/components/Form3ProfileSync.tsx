import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';

interface Form3Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

export const Form3ProfileSync: React.FC<Form3Props> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  return (
    <div className="page" id="form-3-page">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <CbbcLogo clipPathId="cpathc" className="w-[52px] h-[52px]" />
          </div>
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title">
              Profile Synchronization &amp; Database Form
            </div>
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

      {/* MEMBERSHIP CATEGORY BAR */}
      <div className="cat-bar">
        <div>
          <div className="cat-label">A. Membership Category Classification</div>
          <div className="cat-options">
            <label>
              <input
                type="radio"
                name="memcat"
                value="permanent"
                checked={data.membershipCategory === 'permanent'}
                onChange={() => onChange('membershipCategory', 'permanent')}
              />{' '}
              Permanent Member
            </label>
            <label>
              <input
                type="radio"
                name="memcat"
                value="life"
                checked={data.membershipCategory === 'life'}
                onChange={() => onChange('membershipCategory', 'life')}
              />{' '}
              Life Member
            </label>
            <label>
              <input
                type="radio"
                name="memcat"
                value="associate"
                checked={data.membershipCategory === 'associate'}
                onChange={() => onChange('membershipCategory', 'associate')}
              />{' '}
              Associate Member
            </label>
            <label>
              <input
                type="radio"
                name="memcat"
                value="honorary"
                checked={data.membershipCategory === 'honorary'}
                onChange={() => onChange('membershipCategory', 'honorary')}
              />{' '}
              Honorary Member
            </label>
            <label>
              <input
                type="radio"
                name="memcat"
                value="donor"
                checked={data.membershipCategory === 'donor'}
                onChange={() => onChange('membershipCategory', 'donor')}
              />{' '}
              Donor Member
            </label>
          </div>
        </div>
        <div className="reg-num-box">
          <div className="rn-label">Registration Number</div>
          <input
            type="text"
            placeholder="P-0000"
            value={data.membershipNo}
            onChange={(e) => onChange('membershipNo', e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 01 – PRIMARY MEMBER INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Primary Member Information</h2>
        </div>
        <div className="title-row">
          <span className="tl">Title</span>
          <div className="title-opts">
            <label>
              <input
                type="radio"
                name="title"
                value="mr"
                checked={data.title === 'mr'}
                onChange={() => onChange('title', 'mr')}
              />{' '}
              Mr.
            </label>
            <label>
              <input
                type="radio"
                name="title"
                value="mrs"
                checked={data.title === 'mrs'}
                onChange={() => onChange('title', 'mrs')}
              />{' '}
              Mrs.
            </label>
            <label>
              <input
                type="radio"
                name="title"
                value="dr"
                checked={data.title === 'dr'}
                onChange={() => onChange('title', 'dr')}
              />{' '}
              Dr.
            </label>
            <label>
              <input
                type="radio"
                name="title"
                value="capt"
                checked={data.title === 'capt'}
                onChange={() => onChange('title', 'capt')}
              />{' '}
              Capt.
            </label>
            <label>
              <input
                type="radio"
                name="title"
                value="fl"
                checked={data.title === 'fl'}
                onChange={() => onChange('title', 'fl')}
              />{' '}
              Fl.Lt.
            </label>
            <label>
              <input
                type="radio"
                name="title"
                value="adm"
                checked={data.title === 'adm'}
                onChange={() => onChange('title', 'adm')}
              />{' '}
              Admiral
            </label>
          </div>
          <div className="title-name">
            <input
              type="text"
              placeholder="Full Name as per NID / Passport"
              value={data.candidateName}
              onChange={(e) => onChange('candidateName', e.target.value)}
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
            <label>Blood Group</label>
            <select
              value={data.bloodGroup}
              onChange={(e) => onChange('bloodGroup', e.target.value)}
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
          <div className="field w2">
            <label>NID No.</label>
            <input
              type="text"
              placeholder="National ID Number"
              value={data.nid}
              onChange={(e) => onChange('nid', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 02 – PROFESSIONAL PROFILE */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Professional Profile</h2>
        </div>
        <div className="prof-type-row">
          <span className="ptl">Profession Type:</span>
          <div className="prof-opts">
            <label>
              <input
                type="radio"
                name="proftype"
                value="business"
                checked={data.professionType === 'business'}
                onChange={() => onChange('professionType', 'business')}
              />{' '}
              Business
            </label>
            <label>
              <input
                type="radio"
                name="proftype"
                value="service"
                checked={data.professionType === 'service'}
                onChange={() => onChange('professionType', 'service')}
              />{' '}
              Service
            </label>
            <label>
              <input
                type="radio"
                name="proftype"
                value="retired"
                checked={data.professionType === 'retired'}
                onChange={() => onChange('professionType', 'retired')}
              />{' '}
              Retired
            </label>
            <label>
              <input
                type="radio"
                name="proftype"
                value="other"
                checked={data.professionType === 'other'}
                onChange={() => onChange('professionType', 'other')}
              />{' '}
              Other
            </label>
          </div>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Organization</label>
            <input
              type="text"
              placeholder="Company / Organization Name"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </div>
          <div className="field w2">
            <label>Designation</label>
            <input
              type="text"
              placeholder="Job Title / Rank"
              value={data.designation}
              onChange={(e) => onChange('designation', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w3">
            <label>Business / Office Address</label>
            <input
              type="text"
              placeholder="Building, Area, City"
              value={data.officeAddress}
              onChange={(e) => onChange('officeAddress', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Office Tel.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.officeTel}
              onChange={(e) => onChange('officeTel', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 03 – CONTACT REGISTRY GRID */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">03</div>
          <h2>Contact Registry Grid</h2>
        </div>
        <div className="field-row">
          <div className="field w2">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
          <div className="field w15">
            <label>Alternate Contact</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.altContact}
              onChange={(e) => onChange('altContact', e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field w15">
            <label>Primary Mobile</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.mobile}
              onChange={(e) => onChange('mobile', e.target.value)}
            />
          </div>
          <div className="field w15">
            <label>Residence Tel.</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.residenceTel}
              onChange={(e) => onChange('residenceTel', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 04 – DEPENDENT FAMILY DEMOGRAPHICS */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">04</div>
          <h2>Dependent Family Demographics</h2>
        </div>
        <div className="spouse-sync">
          <div className="ss-label">Spouse Digital Sync</div>
          <div className="field-row">
            <div className="field w2">
              <label>Name</label>
              <input
                type="text"
                placeholder="Spouse Full Name"
                value={data.spouseName}
                onChange={(e) => onChange('spouseName', e.target.value)}
              />
            </div>
            <div className="field w15">
              <label>Mobile</label>
              <input
                type="tel"
                placeholder="+880"
                value={data.spouseMobile}
                onChange={(e) => onChange('spouseMobile', e.target.value)}
              />
            </div>
            <div className="field w2">
              <label>Email</label>
              <input
                type="email"
                placeholder="spouse@email.com"
                value={data.spouseEmail}
                onChange={(e) => onChange('spouseEmail', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 05 – ADMINISTRATIVE AUDIT CHECKLIST & PRIVILEGES */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">05</div>
          <h2>Administrative Audit Checklist &amp; Privileges</h2>
        </div>
        <div className="checklist-grid">
          <div className="checklist-col">
            <div className="cl-title">KYC Verification Audit</div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c1"
                checked={data.kycPhoto}
                onChange={(e) => onChange('kycPhoto', e.target.checked)}
              />
              <label htmlFor="c1">Executive Member Photo (Passport)</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c2"
                checked={data.kycNid}
                onChange={(e) => onChange('kycNid', e.target.checked)}
              />
              <label htmlFor="c2">NID / Passport Copy Verified</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c3"
                checked={data.kycSponsor}
                onChange={(e) => onChange('kycSponsor', e.target.checked)}
              />
              <label htmlFor="c3">Sponsor / Proposer Signature</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c4"
                checked={data.kycTin}
                onChange={(e) => onChange('kycTin', e.target.checked)}
              />
              <label htmlFor="c4">TIN Certificate Submitted</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c5"
                checked={data.kycFeeReceipt}
                onChange={(e) => onChange('kycFeeReceipt', e.target.checked)}
              />
              <label htmlFor="c5">Membership Fee Receipt</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="c6"
                checked={data.kycCommittee}
                onChange={(e) => onChange('kycCommittee', e.target.checked)}
              />
              <label htmlFor="c6">Committee Approval Obtained</label>
            </div>
          </div>

          <div className="checklist-col">
            <div className="cl-title">
              Marina Berth &amp; Club Dining Privileges
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p1"
                checked={data.privMooring}
                onChange={(e) => onChange('privMooring', e.target.checked)}
              />
              <label htmlFor="p1">
                Request Deep Water Mooring / Sailing Berth Access
              </label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p2"
                checked={data.privDining}
                onChange={(e) => onChange('privDining', e.target.checked)}
              />
              <label htmlFor="p2">Club Dining &amp; Banquet Hall Access</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p3"
                checked={data.privSwimming}
                onChange={(e) => onChange('privSwimming', e.target.checked)}
              />
              <label htmlFor="p3">Swimming Bay &amp; Recreation Access</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p4"
                checked={data.privGuest}
                onChange={(e) => onChange('privGuest', e.target.checked)}
              />
              <label htmlFor="p4">Guest Invitation Privileges</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p5"
                checked={data.privVoting}
                onChange={(e) => onChange('privVoting', e.target.checked)}
              />
              <label htmlFor="p5">Voting Rights (Annual General Meeting)</label>
            </div>
            <div className="cl-item">
              <input
                type="checkbox"
                id="p6"
                checked={data.privDeepSea}
                onChange={(e) => onChange('privDeepSea', e.target.checked)}
              />
              <label htmlFor="p6">Deep Sea Vessel Access Clearance</label>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE ROW */}
      <div className="field-row mt-[10px]">
        <div className="field">
          <label>Member Signature</label>
          <div className="border-b border-[#c8c8c8] h-[22px]"></div>
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={docDate}
            onChange={(e) => onChange('dob', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Secretariat Stamp</label>
          <div className="border-b border-[#c8c8c8] h-[22px]"></div>
        </div>
        <div className="field">
          <label>Verified By</label>
          <div className="border-b border-[#c8c8c8] h-[22px]"></div>
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
