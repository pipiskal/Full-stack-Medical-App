import Link from 'next/link';
import React from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import s from './NoPatientSelected.module.scss';

type NoPatientSelectedPropsType = {
  hasRegisterPatientButton?: boolean;
};

const NoPatientSelected = ({
  hasRegisterPatientButton = true,
}: NoPatientSelectedPropsType) => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <p className={s.description}>{translate('search_patient_explanation')}</p>

      {hasRegisterPatientButton && (
        <>
          <p className={s.or}>
            <span />
            {translate('or')}
            <span />
          </p>

          <p className={s.description}>{translate('patient_not_registered')}</p>

          <div className={s.register_patient}>
            <Link href="/dashboard/add_patient">
              {translate('register_patient')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NoPatientSelected;
