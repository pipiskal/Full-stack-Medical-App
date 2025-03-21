import React from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { getAgeFromDate } from '@/modules/helpers';
import { PatientType } from '@/types';

import s from './PatientDataDisplay.module.scss';

type PatientDataDisplayPropsType = {
  patientData: PatientType;
  isDisplayMode?: boolean;
};

const PatientDataDisplay = ({
  patientData,
  isDisplayMode,
}: PatientDataDisplayPropsType) => {
  const { translate } = useLanguageContext();

  return (
    <div className={`${isDisplayMode ? s.remove_headroom : ''} ${s.wrapper}`}>
      <h3 className={s.title}>
        {translate(isDisplayMode ? 'patient_data' : 'selected_patient')}
      </h3>

      <div className={s.sections_wrapper}>
        {patientData.amka && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('amka')}</p>
            <p className={s.section_details}>{patientData.amka}</p>
          </div>
        )}

        <div className={s.section}>
          <p className={s.section_title}>{translate('last_name')}</p>
          <p className={s.section_details}>{patientData.lastName}</p>
        </div>

        <div className={s.section}>
          <p className={s.section_title}>{translate('first_name')}</p>
          <p className={s.section_details}>{patientData.firstName}</p>
        </div>

        {patientData.dob && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('age')}</p>
            <p className={s.section_details}>
              {getAgeFromDate(patientData.dob)}
            </p>
          </div>
        )}

        {patientData.phoneNumber && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('phone')}</p>
            <p className={s.section_details}>{patientData.phoneNumber}</p>
          </div>
        )}

        {patientData.email && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('email')}</p>
            <p className={s.section_details}>{patientData.email}</p>
          </div>
        )}

        {patientData.address && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('address')}</p>
            <p className={s.section_details}>{patientData.address}</p>
          </div>
        )}

        {patientData.city && (
          <div className={s.section}>
            <p className={s.section_title}>{translate('city')}</p>
            <p className={s.section_details}>{patientData.city}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDataDisplay;
