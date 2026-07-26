import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';
import { ReferencesSection } from './ReferencesSection';
import { DeclarationsAndConsent } from './DeclarationsAndConsent';

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
            <div className="form-title">FORM E · References &amp; Legal Declaration</div>
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

      {/* SECTION 01 – REFERENCES (PROPOSER & SECONDER) */}
      <ReferencesSection data={data} onChange={onChange} />

      {/* SECTION 02 & 03 – SELF DECLARATION, CONFIDENTIALITY & PRIVACY CONSENT */}
      <DeclarationsAndConsent data={data} onChange={onChange} docDate={docDate} />

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
        <div className="footer-right">Page 5 of 7 &nbsp;|&nbsp; Official Registration Package</div>
      </div>
    </div>
  );
};
