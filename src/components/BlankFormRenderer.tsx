import React from 'react';
import { BlankFormContext } from './BlankFormContext';
import { FormAPersonalInfo } from './FormAPersonalInfo';
import { FormBProfessionalFamily } from './FormBProfessionalFamily';
import { Form2ProximityCard } from './Form2ProximityCard';
import { Form3ProfileSync } from './Form3ProfileSync';
import { FormEReferencesDeclaration } from './FormEReferencesDeclaration';
import { FormFDocumentChecklist } from './FormFDocumentChecklist';
import { FormGOfficialUseOnlyPage } from './FormGOfficialUseOnlyPage';
import { EMPTY_MEMBER_DATA, MemberFormData, MembershipCategoryType } from '../types';

// A non-breaking space renders an empty-looking value where the pages would
// otherwise fall back to a sample registration / document number.
const BLANK = '\u00a0';

/**
 * Empty application used for the hand-fillable blank form. Marital status and
 * child count are set only so the spouse section and three child rows are
 * printed for people to write in; the values themselves never appear.
 */
const BLANK_FORM_DATA: MemberFormData = {
  ...EMPTY_MEMBER_DATA,
  registrationNumber: BLANK,
  membershipCategory: BLANK as MembershipCategoryType,
  maritalStatus: 'Married',
  numberOfChildren: 3,
  professionType: 'other',
  email: '',
};

const noop = () => undefined;

/** Renders all seven printable pages with no applicant data, off-screen. */
export const BlankFormRenderer = React.forwardRef<HTMLDivElement>((_props, ref) => (
  <BlankFormContext.Provider value={true}>
    <div ref={ref} aria-hidden="true" style={{ position: 'fixed', left: '-99999px', top: 0 }}>
      <FormAPersonalInfo data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <FormBProfessionalFamily data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <Form2ProximityCard data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <Form3ProfileSync data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <FormEReferencesDeclaration data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <FormFDocumentChecklist data={BLANK_FORM_DATA} onChange={noop} docNo={BLANK} docDate="" />
      <FormGOfficialUseOnlyPage data={BLANK_FORM_DATA} docNo={BLANK} docDate="" />
    </div>
  </BlankFormContext.Provider>
));
BlankFormRenderer.displayName = 'BlankFormRenderer';
