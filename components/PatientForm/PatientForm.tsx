import { useState } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { useLanguageContext } from '@/context/LanguageProvider';
import useDocument from '@/hooks/useDocument';
import {
  checkAmkaValidity,
  checkEmailValidity,
  checkNameValidity,
  checkPhoneNumberValidity,
  isDateOfBirthValid,
  toastMessage,
} from '@/modules/helpers';
import { PatientType } from '@/types';

import s from './PatientForm.module.scss';

type PatientFormProps = {
  initialFormDetails: PatientType;
  isReadOnly?: boolean;
  formType?: 'createNewPatient' | 'updatePatient';
  onSubmit?: (patientDetails: Omit<PatientType, '_id'>) => Promise<void>;
  onCancel?: () => void;
};

const PatientForm = ({
  initialFormDetails,
  isReadOnly = false,
  formType = 'createNewPatient',
  onSubmit,
  onCancel,
}: PatientFormProps): JSX.Element => {
  const { translate } = useLanguageContext();
  const { document } = useDocument();
  const [patientDetails, setPatientDetails] =
    useState<Omit<PatientType, '_id'>>(initialFormDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDOBValid, setIsDOBValid] = useState(true);

  const isOriginalDetailsSame =
    JSON.stringify(initialFormDetails) === JSON.stringify(patientDetails);

  const isFirstNameValid =
    checkNameValidity(patientDetails.firstName) === 'passed';
  const isLastNameValid =
    checkNameValidity(patientDetails.lastName) === 'passed';
  const isPhoneNUmberValid =
    checkPhoneNumberValidity(patientDetails.phoneNumber) === 'passed';

  const areMandatoryFieldsEmpty =
    !patientDetails.firstName ||
    !patientDetails.lastName ||
    !patientDetails.amka;

  const isAmkaValid = checkAmkaValidity(patientDetails.amka) === 'passed';

  const isEmailValid =
    checkEmailValidity(patientDetails?.email || '') === 'passed' ||
    !patientDetails?.email;

  const isProvidedDateValid =
    isDateOfBirthValid(patientDetails.dob) || !patientDetails.dob;

  const areValidationsFailed =
    !isAmkaValid || !isEmailValid || !isProvidedDateValid;

  const isButtonDisabled =
    areMandatoryFieldsEmpty ||
    isLoading ||
    areValidationsFailed ||
    !isFirstNameValid ||
    !isLastNameValid ||
    !isPhoneNUmberValid;

  const isUpdateButtonDisabled = isOriginalDetailsSame || isButtonDisabled;

  const checkDateValidity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientDetails({ ...patientDetails, dob: e.target.value });

    const isDateValid = isDateOfBirthValid(e.target.value);

    if (e.target.value.length === 0) {
      setIsDOBValid(true);
    } else if (e.target.value.length !== 0 && isDateValid) {
      setIsDOBValid(true);
    }

    if (!isDateValid && e.target.value.length !== 0) {
      toastMessage(translate('invalid_date_of_birth'), 'error');
      setIsDOBValid(false);
    }
  };

  const handleOnCancel = () => {
    setPatientDetails(initialFormDetails);
    (document?.getElementById('patient_form') as HTMLFormElement).reset();
    onCancel?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const patientProvidedDetails: Omit<PatientType, '_id'> = {
      amka: patientDetails.amka,
      firstName: patientDetails.firstName,
      lastName: patientDetails.lastName,
      phoneNumber: patientDetails.phoneNumber,
      dob: patientDetails.dob,
      email: patientDetails.email,
      address: patientDetails.address,
      city: patientDetails.city,
      extraDetails: patientDetails.extraDetails,
    };

    await onSubmit?.(patientProvidedDetails);
    setIsLoading(false);

    if (formType === 'createNewPatient') {
      setPatientDetails(initialFormDetails);
    }
  };

  const updateFormClassName = isReadOnly
    ? s.update_patient_form
    : s.edit_patient_form;

  const formClassName =
    formType === 'createNewPatient' ? s.patient_form : updateFormClassName;

  return (
    <form className={formClassName} onSubmit={handleSubmit} id="patient_form">
      <div className={s.grid_design}>
        <Input
          elementId="amka"
          validationType="amka"
          maxLength={20}
          label={translate('amka')}
          isFieldMandatory
          value={patientDetails.amka}
          onHandle={
            isReadOnly
              ? null
              : (value: string) =>
                  setPatientDetails({ ...patientDetails, amka: value })
          }
        />

        <Input
          elementId="first_name"
          label={translate('first_name')}
          validationType="firstName"
          value={patientDetails.firstName}
          onHandle={(value: string) =>
            isReadOnly
              ? null
              : setPatientDetails({ ...patientDetails, firstName: value })
          }
          maxLength={20}
          isFieldMandatory
        />

        <Input
          elementId="last_name"
          label={translate('last_name')}
          validationType="lastName"
          value={patientDetails.lastName}
          onHandle={(value: string) =>
            isReadOnly
              ? null
              : setPatientDetails({ ...patientDetails, lastName: value })
          }
          maxLength={20}
          isFieldMandatory
        />

        <Input
          elementId="phone_number"
          label={translate('phone')}
          validationType="phoneNumber"
          value={patientDetails.phoneNumber}
          onHandle={(value: string) =>
            isReadOnly
              ? null
              : setPatientDetails({ ...patientDetails, phoneNumber: value })
          }
        />

        <div className={s.form_element}>
          <label
            htmlFor="date_of_birth"
            className={`${isReadOnly ? s.label : s.edit_label}`}
          >
            {translate('dob')}
          </label>

          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            className={`${isDOBValid ? '' : 'invalid_input'} ${s.date_input}`}
            onChange={(e) => (isReadOnly ? null : checkDateValidity(e))}
            value={patientDetails.dob}
            readOnly={isReadOnly}
          />
        </div>

        <Input
          elementId="email"
          label={translate('email')}
          validationType="email"
          value={patientDetails.email}
          onHandle={(value: string) =>
            isReadOnly
              ? null
              : setPatientDetails({ ...patientDetails, email: value })
          }
        />
      </div>

      {/* Address and Extra Details */}
      <div className={`${s.grouped_elements}`}>
        <div
          className={`${isReadOnly ? s.edit_input_wrapper : s.input_wrapper}`}
        >
          <Input
            elementId="address"
            label={translate('address')}
            value={patientDetails.address}
            onHandle={(value: string) =>
              isReadOnly
                ? null
                : setPatientDetails({ ...patientDetails, address: value })
            }
          />
        </div>

        <div
          className={`${isReadOnly ? s.edit_input_wrapper : s.input_wrapper}`}
        >
          <Input
            elementId="city"
            label={translate('city')}
            value={patientDetails.city}
            onHandle={(value: string) =>
              isReadOnly
                ? null
                : setPatientDetails({ ...patientDetails, city: value })
            }
          />
        </div>
      </div>

      <div
        className={`${s.form_element} ${
          (formType === 'createNewPatient' || !isReadOnly) && s.spacing_bottom
        }`}
      >
        <label
          htmlFor="extra_details"
          className={`${
            isReadOnly ? s.extra_details_label : s.extra_details_edit_label
          }`}
        >
          {translate('extra_details')}
        </label>

        <div>
          {isReadOnly ? (
            <textarea
              id="extra_details"
              name="extra_details"
              defaultValue={patientDetails.extraDetails}
            />
          ) : (
            <textarea
              id="extra_details"
              name="extra_details"
              value={patientDetails.extraDetails}
              onChange={(e) =>
                isReadOnly
                  ? null
                  : setPatientDetails({
                      ...patientDetails,
                      extraDetails: e.target.value,
                    })
              }
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {formType === 'createNewPatient' && (
        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={isButtonDisabled}
        >
          {translate('add_patient')}
        </Button>
      )}

      {formType === 'updatePatient' && !isReadOnly && (
        <div className={s.update_actions}>
          <div>
            <Button type="button" onClick={handleOnCancel} variant="secondary">
              {translate('cancel')}
            </Button>
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={isUpdateButtonDisabled}
              variant="primary"
            >
              {translate('update_patient')}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PatientForm;
