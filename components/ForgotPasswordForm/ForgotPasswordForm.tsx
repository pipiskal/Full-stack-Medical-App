import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { checkEmailValidity, toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';

import Button from '../Button/Button';
import Input from '../Input/Input';
import s from './ForgotPasswordForm.module.scss';

const ForgotPasswordForm = () => {
  const { translate } = useLanguageContext();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isButtonDisabled = !email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = checkEmailValidity(email);

    if (result === 'invalid_email') {
      toastMessage(translate('invalid_email'), 'error');
      return;
    }
    setIsLoading(true);

    const response = await requestClient(
      'auth/forgot_password',
      { email: email },
      'POST'
    );

    if (response.success) {
      toastMessage(translate('successful_email_sent'), 'success');
      setIsEmailSent(true);
    } else {
      toastMessage(translate('something_went_wrong'), 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className={s.form_wrapper}>
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.header}>
          <button type="button" onClick={() => router.back()}>
            <ArrowLeftOutlined />
            <span>{translate('go_back')}</span>
          </button>

          <p className={s.title}>{translate('Reset_password')}</p>

          <span className={s.empty_space} />
        </div>

        {isEmailSent ? (
          <div className={s.sent_email_success}>
            <CheckCircleOutlined />

            <p className={s.success_text}>
              {translate('successful_email_sent')}
            </p>
          </div>
        ) : (
          <>
            <p className={s.instructions}>
              {translate('reset_password_instructions')}
            </p>

            <Input
              onHandle={setEmail}
              label={translate('email_address')}
              elementId="email"
              placeholder={translate('enter_email_address')}
            />

            <Button
              type="submit"
              isDisabled={isButtonDisabled}
              isLoading={isLoading}
            >
              {translate('send')}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
