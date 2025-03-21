import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import PrivacyPolicyEl from '../../Templates/PrivacyPolicy/PrivacyPolicyEl';
import PrivacyPolicyEn from '../../Templates/PrivacyPolicy/PrivacyPolicyEn';
import TermsAndConditionsEl from '../../Templates/TermsAndConditions/TermsAndConditionsEl';
import TermsAndConditionsEn from '../../Templates/TermsAndConditions/TermsAndConditionsEn';
import s from './TermsAndPrivacyBox.module.scss';

type TermsAndPrivacyBoxPropsType = {
  type: 'terms' | 'privacy';
};

const privacyPolicy = {
  en: <PrivacyPolicyEn />,
  el: <PrivacyPolicyEl />,
};

const terms: { [key: string]: React.ReactNode } = {
  en: <TermsAndConditionsEn />,
  el: <TermsAndConditionsEl />,
};

const TermsAndPrivacyBox = ({ type }: TermsAndPrivacyBoxPropsType) => {
  const { language, translate } = useLanguageContext();

  const TITLE = type === 'terms' ? 'terms_of_service_title' : 'privacy_policy';
  const router = useRouter();
  const [savedLanguage, setSavedLanguage] = useState('');

  useEffect(() => {
    setSavedLanguage(language);
  }, [language]);

  return (
    <div className={s.form_wrapper}>
      <div className={`${s.main_wrapper} scrollbar`}>
        <div className={s.header}>
          <button onClick={() => router.back()}>
            <ArrowLeftOutlined />
            <span>{translate('go_back')}</span>
          </button>

          <p className={s.title}>{translate(TITLE)}</p>

          <span className={s.empty_space} />
        </div>

        <div className={s.content}>
          {type === 'privacy'
            ? privacyPolicy[savedLanguage as keyof typeof privacyPolicy]
            : terms[savedLanguage]}
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyBox;
