import Link from 'next/link';

import { useLanguageContext } from '@/context/LanguageProvider';

import s from './NoPatientFound.module.scss';

const NoPatientFound = () => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <p className={s.description}>
        {translate('patient_not_found_explanation')}
      </p>

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
    </div>
  );
};

export default NoPatientFound;
