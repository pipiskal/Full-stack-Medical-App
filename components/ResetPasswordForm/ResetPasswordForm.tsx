import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { checkPasswordStrength, toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';

import Button from '../Button/Button';
import Input from '../Input/Input';
import s from './ResetPasswordForm.module.scss';

const ResetPasswordForm = () => {
  const { translate } = useLanguageContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetKey = searchParams?.get('reset_key');
  const isButtonDisabled = !password || !resetKey;
  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resetKey) {
      return;
    }

    if (password && resetKey) {
      setIsLoading(true);
      const response = await requestClient(
        'auth/reset_password',
        { password, resetKey },
        'POST'
      );

      if (response.success) {
        toastMessage(translate('successful_password_reset'), 'success');
        router.push('/auth/login');
      } else {
        setIsLoading(false);

        toastMessage(translate('generic_error'), 'error');
      }
    } else {
      toastMessage(translate('generic_error'), 'error');
    }
  };

  return (
    <div className={s.form_wrapper}>
      <form onSubmit={handleSubmit} className={s.form}>
        <h3>{translate('reset_account_password')}</h3>

        <Input
          onHandle={setPassword}
          label={translate('password')}
          elementId="password"
          placeholder={translate('enter_password')}
          type="password"
        />

        <div className={s.password_checker_wrapper}>
          <div className={`${s.password_checker} ${s[passwordStrength]}`} />
          <p>{translate(passwordStrength)}</p>
        </div>

        <Button
          type="submit"
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
        >
          {translate('reset_password')}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
