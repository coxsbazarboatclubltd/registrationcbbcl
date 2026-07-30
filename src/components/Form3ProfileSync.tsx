import React from 'react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { SearchableCategorySelect } from './SearchableCategorySelect';

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
    <div className="page" id="form-4-page">
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
                <td>{docDate}</td>
              </tr>
              <tr>
                <td>Document Version:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
          <div className="form-title text-[#1a2744]">FORM D · Member Database Synchronization</div>
        </div>
      </div>

      {/* MEMBERSHIP CATEGORY BAR */}
      <div className="bg-[#1a2744]/5 border border-[#9d7f46]/40 rounded-lg p-2.5 mb-3">
        <SearchableCategorySelect
          value={data.membershipCategory}
          onChange={(cat) => onChange('membershipCategory', cat)}
        />
      </div>

      {/* SECTION 01 – PRIMARY MEMBER INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Primary Member Information</h2>
        </div>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <div className="title-row">
              <span className="tl">Title</span>
              <div className="title-opts">
                <select
                  className="title-select border border-[#9d7f46]/50 rounded px-2 py-1 text-[10px] bg-white text-[#1a2744] font-semibold h-[26px]"
                  value={data.title}
                  onChange={(e) => onChange('title', e.target.value)}
                >
                  <option value="mr">Mr.</option>
                  <option value="mrs">Mrs.</option>
                  <option value="miss">Miss</option>
                  <option value="ms">Ms.</option>
                  <option value="dr">Dr.</option>
                  <option value="prof">Prof.</option>
                  <option value="engr">Engr.</option>
                  <option value="arch">Architect</option>
                  <option value="barrister">Barrister</option>
                  <option value="advocate">Advocate</option>
                  <option value="hon">Hon.</option>
                  <option value="other">Other</option>
                </select>
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
          <div className="w-[105px] flex-shrink-0">
            <PhotoUploader
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
              placeholder="Job Title / Designation"
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

      {/* SECTION 05 – CLUB FACILITIES & PRIVILEGES REQUEST */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">05</div>
          <h2>Club Facilities &amp; Privileges Request</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 p-2 bg-[#faf8f5] border border-[#9d7f46]/30 rounded">
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p1"
              checked={data.privMooring}
              onChange={(e) => onChange('privMooring', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p1" className="text-[9px] font-semibold text-[#1a2744]">
              Private Lounge &amp; Executive Club Facilities Access
            </label>
          </div>
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p2"
              checked={data.privDining}
              onChange={(e) => onChange('privDining', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p2" className="text-[9px] font-semibold text-[#1a2744]">
              Club Dining &amp; Banquet Hall Reservation Privileges
            </label>
          </div>
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p3"
              checked={data.privSwimming}
              onChange={(e) => onChange('privSwimming', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p3" className="text-[9px] font-semibold text-[#1a2744]">
              Swimming Pool &amp; Water Sports Recreation Access
            </label>
          </div>
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p4"
              checked={data.privGuest}
              onChange={(e) => onChange('privGuest', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p4" className="text-[9px] font-semibold text-[#1a2744]">
              Guest &amp; Family Invitation Privileges
            </label>
          </div>
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p5"
              checked={data.privVoting}
              onChange={(e) => onChange('privVoting', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p5" className="text-[9px] font-semibold text-[#1a2744]">
              Voting Rights &amp; AGM Participation (Permanent Members)
            </label>
          </div>
          <div className="cl-item flex items-center gap-2">
            <input
              type="checkbox"
              id="p6"
              checked={data.privDeepSea}
              onChange={(e) => onChange('privDeepSea', e.target.checked)}
              className="accent-[#0f5132]"
            />
            <label htmlFor="p6" className="text-[9px] font-semibold text-[#1a2744]">
              Executive Sports &amp; Deep-Sea Angling Charter Privileges
            </label>
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
          Tel: +880 13328 86688<br />
          Email: registration@cbbcl.org<br />
          info@cbbcl.org
        </div>
        <div className="footer-right-group">
          <div className="footer-center">Confidential Document</div>
          <div className="footer-right">Page 4 of 7 &nbsp;|&nbsp; Official Registration Package</div>
        </div>
      </div>
    </div>
  );
};
