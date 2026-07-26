import React from 'react';
import { MemberFormData } from '../types';
import { FormAPersonalInfo } from './FormAPersonalInfo';
import { FormBProfessionalFamily } from './FormBProfessionalFamily';

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
    <div className="space-y-6">
      {/* PAGE 1: FORM A - MEMBERSHIP APPLICATION */}
      <FormAPersonalInfo
        data={data}
        onChange={onChange}
        docNo={docNo}
        docDate={docDate}
      />

      {/* PAGE 2: FORM B - PROFESSIONAL & FAMILY INFORMATION */}
      <FormBProfessionalFamily
        data={data}
        onChange={onChange}
        docNo={docNo}
        docDate={docDate}
      />
    </div>
  );
};
