import React from 'react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { SearchableCategorySelect } from './SearchableCategorySelect';
import { formatLongDate } from '../utils/formatDate';
import { REGISTRATION_NUMBER_PENDING } from '../utils/ids';

interface FormAProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
  lockedEmail?: string;
}

export const FormAPersonalInfo: React.FC<FormAProps> = ({
  data,
  onChange,
  docNo,
  docDate,
  lockedEmail,
}) => {
  return (
    <div className="page" id="form-1-page">
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
                <td className="font-bold text-[#0f5132]">{data.registrationNumber || REGISTRATION_NUMBER_PENDING}</td>
              </tr>
              <tr>
                <td>Document No.:</td>
                <td>{docNo}</td>
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
          <div className="form-title text-[#1a2744]">FORM A · Membership Application</div>
        </div>
      </div>

      {/* CATEGORY BANNER */}
      <div className="bg-[#1a2744]/5 border border-[#9d7f46]/40 rounded-lg p-2.5 mb-3">
        <SearchableCategorySelect
          value={data.membershipCategory}
          onChange={(cat) => onChange('membershipCategory', cat)}
        />
      </div>

      {/* SECTION 01 – APPLICANT PERSONAL INFORMATION (TWO COLUMN LAYOUT) */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Applicant Personal Information</h2>
        </div>

        <div className="photo-section">
          <div className="fields-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mb-2">
              <div className="field col-span-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-1">
                  <label>Title <span className="text-red-600">*</span></label>
                  <div className="flex gap-1">
                  <select
                    value={data.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    className={data.title === 'other' ? 'w-1/2 flex-1' : undefined}
                  >
                    <option value="mr">Mr.</option>
                    <option value="mrs">Mrs.</option>
                    <option value="miss">Miss</option>
                    <option value="ms">Ms.</option>
                    <option value="dr">Dr.</option>
                    <option value="prof">Prof.</option>
                    <option value="engr">Engr.</option>
                    <option value="barrister">Barrister</option>
                    <option value="advocate">Advocate</option>
                    <option value="arch">Architect</option>
                    <option value="hon">Hon.</option>
                    <option value="other">Other</option>
                  </select>
                  {data.title === 'other' && (
                    <input
                      type="text"
                      aria-label="Your title"
                      placeholder="Your title"
                      value={data.titleOther || ''}
                      onChange={(e) => onChange('titleOther', e.target.value)}
                      className="w-1/2 flex-1"
                    />
                  )}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label>Candidate Full Name (as per NID / Passport) <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    placeholder="Full name as per NID / Passport"
                    value={data.candidateName}
                    onChange={(e) => onChange('candidateName', e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Father / Husband Name</label>
                <input
                  type="text"
                  value={data.fatherHusbandName}
                  onChange={(e) => onChange('fatherHusbandName', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Mother's Name</label>
                <input
                  type="text"
                  value={data.motherName}
                  onChange={(e) => onChange('motherName', e.target.value)}
                />
              </div>

              {/* DOB & Place of Birth */}
              <div className="field">
                <label>Date of Birth <span className="text-red-600">*</span></label>
                <input
                  type="date"
                  value={data.dob}
                  onChange={(e) => onChange('dob', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Place of Birth</label>
                <input
                  type="text"
                  placeholder="District / Country"
                  value={data.placeOfBirth}
                  onChange={(e) => onChange('placeOfBirth', e.target.value)}
                />
              </div>

              {/* Blood Group & Marital Status */}
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
                <label>Marital Status</label>
                <select
                  value={data.maritalStatus}
                  onChange={(e) => onChange('maritalStatus', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried / Single</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              {/* Nationality & Religion */}
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
                <label>Religion (Optional)</label>
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

              {/* NID & Passport */}
              <div className="field">
                <label>National ID (NID)</label>
                <input
                  type="text"
                  placeholder="NID Number"
                  value={data.nid}
                  onChange={(e) => onChange('nid', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Passport Number &amp; Expiry</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Passport No"
                    value={data.passportNo}
                    onChange={(e) => onChange('passportNo', e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="date"
                    title="Passport Expiry Date"
                    value={data.passportExpiry}
                    onChange={(e) => onChange('passportExpiry', e.target.value)}
                    className="!w-28 text-[9px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="photo-box flex flex-col items-center justify-between p-1">
            <PhotoUploader
              label="Candidate Photo"
              sublabel="Passport Size&#10;2 inch × 2 inch"
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

      {/* SECTION 02 – CONTACT & RESIDENTIAL INFORMATION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Contact &amp; Residential Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 mb-2">
          <div className="field col-span-2">
            <label>Present Address</label>
            <input
              type="text"
              placeholder="House, Road, Area, City, Bangladesh"
              value={data.presentAddress}
              onChange={(e) => onChange('presentAddress', e.target.value)}
            />
          </div>

          <div className="field col-span-2">
            <label>Permanent Address</label>
            <input
              type="text"
              placeholder="Permanent / Hometown Address"
              value={data.permanentAddress}
              onChange={(e) => onChange('permanentAddress', e.target.value)}
            />
          </div>

          {/* Mobile, WhatsApp & Email */}
          <div className="field">
            <label>Mobile Number <span className="text-red-600">*</span></label>
            <input
              type="tel"
              placeholder="+880"
              value={data.mobile}
              onChange={(e) => onChange('mobile', e.target.value)}
            />
          </div>

          <div className="field">
            <label>WhatsApp Number</label>
            <input
              type="tel"
              placeholder="+880"
              value={data.whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
            />
          </div>

          <div className="field col-span-2 md:col-span-1">
            <label>Email Address <span className="text-red-600">*</span></label>
            <input
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              readOnly={Boolean(lockedEmail)}
              title={lockedEmail ? 'Verified email address (locked)' : undefined}
              className={lockedEmail ? 'bg-gray-100 cursor-not-allowed' : undefined}
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
          Email: registration@cbbcl.org
        </div>
        <div className="footer-right-group">
          <div className="footer-center">Confidential Document</div>
          <div className="footer-right">Page 1 of 7 &nbsp;|&nbsp; Official Registration Form</div>
        </div>
      </div>
    </div>
  );
};
