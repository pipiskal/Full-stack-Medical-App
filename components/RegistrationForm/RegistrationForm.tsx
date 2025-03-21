import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import { SPECIALTIES } from '@/modules/constants';
import {
  checkEmailValidity,
  checkNameValidity,
  checkPasswordStrength,
  checkPasswordValidity,
  toastMessage,
} from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import { LanguageType } from '@/types';

import DropdownSelector from '../DropdownSelector/DropdownSelector';
import Input from '../Input/Input';
import s from './RegistrationForm.module.scss';

const RegistrationForm = () => {
  const { translate } = useLanguageContext();
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageType>('el');
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isButtonDisabled =
    checkEmailValidity(email) !== 'passed' ||
    checkPasswordValidity(password) !== 'passed' ||
    checkNameValidity(firstName) !== 'passed' ||
    checkNameValidity(lastName) !== 'passed' ||
    !specialty ||
    isLoading;

  const passwordStrength = checkPasswordStrength(password);

  const handleOptionSelect = (option: string) => {
    setSpecialty(option);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const body = {
      firstName,
      lastName,
      specialty,
      email,
      password,
      preferableLanguage: language,
    };

    // TODO - Add typescript api response
    const { success, statusCode } = await requestClient(
      'auth/register',
      body,
      'POST'
    );

    if (success && statusCode === 201) {
      router.push('/auth/welcome');
    } else if (!success && statusCode === 409) {
      toastMessage(translate('duplicate_user'), 'error');
    } else {
      toastMessage(translate('generic_error'), 'error');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const localLanguage = localStorage.getItem('language') as LanguageType;
    setLanguage(localLanguage);
  }, []);

  return (
    <div className={s.form_wrapper}>
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.header}>
          <h3> {translate('sign_up')}</h3>

          <Link href="/auth/login" className={s.have_account}>
            {translate('already_have_account')}
          </Link>
        </div>

        <div className={s.name_wrapper}>
          <Input
            onHandle={setFirstName}
            label={translate('first_name')}
            elementId="first_name"
            placeholder="John"
            validationType="firstName"
            maxLength={20}
            isFieldMandatory
          />

          <Input
            onHandle={setLastName}
            label={translate('last_name')}
            elementId="last_name"
            placeholder="Doe"
            validationType="lastName"
            maxLength={20}
            isFieldMandatory
          />
        </div>

        <DropdownSelector
          label={translate('specialty')}
          options={SPECIALTIES}
          defaultTitle={translate('choose_specialty')}
          onSelect={handleOptionSelect}
          isFieldMandatory
        />

        <Input
          onHandle={setEmail}
          label={translate('email_address')}
          elementId="email"
          placeholder="demo@mail.com"
          validationType="email"
          isFieldMandatory
        />

        <Input
          onHandle={setPassword}
          label={translate('password')}
          elementId="password"
          placeholder="********"
          type="password"
          validationType="password"
          isFieldMandatory
        />

        <div className={s.password_checker_wrapper}>
          <div className={`${s.password_checker} ${s[passwordStrength]}`} />
          <p>{translate(passwordStrength)}</p>
        </div>

        <p className={s.terms}>
          {translate('by_signing_up')}{' '}
          <Link href="/auth/terms_of_service">
            {translate('terms_of_service')}
          </Link>{' '}
          {translate('and')}{' '}
          <Link href="/auth/privacy_policy">{translate('privacy_policy')}</Link>
        </p>

        <Button
          type="submit"
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
        >
          {translate('create_account')}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
