import { useState } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import { UserResponseType } from '@/typesApiResponses';

import s from './Account.module.scss';

type AccountPropsType = {
  handleCloseModal?: () => void;
};

const Account = ({ handleCloseModal }: AccountPropsType): JSX.Element => {
  const { translate } = useLanguageContext();
  const { user, setUser } = dataContext();
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [currentPassword, setCurrentPassword] = useState<string>(
    user.password || ''
  );
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFirstNameValid = firstName.length > 2 && firstName.length < 20;
  const isLastNameValid = lastName.length > 2 && lastName.length < 20;
  const isFirstNameAndLastValid = isFirstNameValid && isLastNameValid;

  const noAccountChanges =
    firstName === user.firstName && lastName === user.lastName;

  const isCurrentAndNewPasswordProvided =
    currentPassword.length > 0 && newPassword.length >= 4;

  // For passwords to be valid both must be provided or none
  const arePasswordsValid =
    (!currentPassword && !newPassword) || isCurrentAndNewPasswordProvided;

  const isButtonDisabled =
    !isFirstNameAndLastValid ||
    !arePasswordsValid ||
    (noAccountChanges && !isCurrentAndNewPasswordProvided);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const request: UserResponseType = await requestClient(
      'user',
      {
        firstName,
        lastName,
        ...(currentPassword && { currentPassword: currentPassword }),
        ...(currentPassword && { newPassword: newPassword }),
      },
      'PATCH'
    );

    const { success, statusCode, data } = request;

    if (!success && statusCode === 400) {
      toastMessage(translate('invalid_current_password'), 'error');
      setIsLoading(false);
      return;
    }

    if (success && data !== null) {
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      toastMessage(translate('account_updated'), 'success');

      handleCloseModal?.();
      setIsLoading(false);
      return;
    } else {
      toastMessage(translate('account_update_failed'), 'error');
      setIsLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.name_wrapper}>
        <Input
          onHandle={setFirstName}
          label={translate('first_name')}
          defaultValue={firstName}
          elementId="first_name"
          placeholder="John"
          validationType="firstName"
          maxLength={20}
        />

        <Input
          onHandle={setLastName}
          label={translate('last_name')}
          defaultValue={lastName}
          elementId="last_name"
          placeholder="Doe"
          validationType="lastName"
          maxLength={20}
        />
      </div>

      {newPassword ? (
        <Input
          onHandle={setCurrentPassword}
          label={translate('current_password')}
          elementId="current_password"
          validationType={'currentPassword'}
          type="password"
        />
      ) : (
        <Input
          onHandle={setCurrentPassword}
          label={translate('current_password')}
          elementId="current_password"
          type="password"
        />
      )}

      <Input
        onHandle={setNewPassword}
        label={translate('new_password')}
        elementId="new_password"
        type="password"
        validationType="password"
      />

      <div className={s.button_wrapper}>
        <Button
          type="submit"
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
        >
          {translate('update_account')}
        </Button>
      </div>
    </form>
  );
};

export default Account;
