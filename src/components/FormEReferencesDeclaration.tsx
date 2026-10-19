import React from 'react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import { ReferencesSection } from './ReferencesSection';
import { DeclarationsAndConsent } from './DeclarationsAndConsent';
import { formatLongDate } from '../utils/formatDate';
import { REGISTRATION_NUMBER_PENDING } from '../utils/ids';

interface FormEProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

export const FormEReferencesDeclaration: React.FC<FormEProps> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  return (
    <div className="page" id="form-5-page">
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
          <div className="form-title text-[#1a2744]">FORM E · References &amp; Legal Declaration</div>
        </div>
      </div>

      {/* SECTION 01 – REFERENCES (PROPOSER & SECONDER) */}
      <ReferencesSection data={data} onChange={onChange} />

      {/* SECTION 02 & 03 – SELF DECLARATION, CONFIDENTIALITY & PRIVACY CONSENT */}
      <DeclarationsAndConsent data={data} onChange={onChange} docDate={formatLongDate(docDate)} />

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
          <div className="footer-right">Page 5 of 7 &nbsp;|&nbsp; Official Registration Form</div>
        </div>
      </div>
    </div>
  );
};
