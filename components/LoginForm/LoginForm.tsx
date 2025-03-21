import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';

import Input from '../Input/Input';
import s from './LoginForm.module.scss';

const LoginForm = () => {
  const { translate } = useLanguageContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMeSelected, setIsRememberMeSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isButtonDisabled = !email || !password || isLoading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email && password) {
      setIsLoading(true);

      const body = { email, password, rememberMe: isRememberMeSelected };
      const response = await requestClient('auth/login', body, 'POST');
      const { success, statusCode } = response;

      // The response is unauthorized
      if (!success && statusCode === 401) {
        toastMessage(translate('invalid_login_credentials'), 'error');
        setIsLoading(false);
        return;
      }

      // The provided data are invalid
      if (!success && statusCode === 404) {
        toastMessage('Email or password were not provided', 'error');
        setIsLoading(false);
        return;
      }

      router.push('/app_loader');
    }
  };

  return (
    <div className={s.form_wrapper}>
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.header}>
          <h3>{translate('login')}</h3>
          <Link href="/auth/registration" className={s.no_account}>
            {translate('dont_have_account')}
          </Link>
        </div>

        <Input
          onHandle={setEmail}
          label={translate('email_address')}
          elementId="email"
          placeholder={translate('enter_email_address')}
        />

        <Input
          onHandle={setPassword}
          label={translate('password')}
          elementId="password"
          placeholder={translate('enter_password')}
          type="password"
        />

        <div className={s.footer}>
          <div className={s.remember_me}>
            <input
              type="checkbox"
              id="remember"
              onChange={() => setIsRememberMeSelected(!isRememberMeSelected)}
              checked={isRememberMeSelected}
            />
            <label htmlFor="remember">{translate('remember_me')}</label>
          </div>

          <Link href="/auth/forgot_password" className={s.forgot_password}>
            {translate('forgot_password')}
          </Link>
        </div>

        <Button
          type="submit"
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
        >
          {translate('login_btn')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
