// Common functions ex. for converting timestamp to date

import { toast } from 'react-toastify';

import { InputValidationCheckType, InputValidationType } from '@/types';

export const toastMessage = (
  message: string,
  type: 'warning' | 'error' | 'success'
) => {
  toast(message, {
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: message,
    type: type,
  });
};

export const capitalizeFirstLetter = (str: string) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
};

export const checkPasswordStrength = (password: string) => {
  const goodRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  );
  const normalRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');
  const weakRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.{4,})');

  if (goodRegex.test(password)) {
    return 'good';
  } else if (normalRegex.test(password)) {
    return 'normal';
  } else if (weakRegex.test(password)) {
    return 'weak';
  } else {
    return 'poor';
  }
};

export const getFlag = (language: string) => {
  const flags = {
    en: '🇬🇧',
    el: '🇬🇷',
  };

  return flags[language as keyof typeof flags];
};

export const getLanguageFullName = (language: string) => {
  const languageNames = {
    en: 'English',
    el: 'Ελληνικά',
  };

  return languageNames[language as keyof typeof languageNames];
};

// TODO add return types to all functions

type EmailResponseType = 'passed' | 'invalid_email';

export const checkEmailValidity = (email: string): EmailResponseType => {
  let result: EmailResponseType = 'passed';

  const regex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

  if (!regex.test(email)) {
    result = 'invalid_email';
  }

  return result;
};

export const checkNameValidity = (name: string) => {
  let result = 'passed';

  const regex = new RegExp('^(?:[a-zA-Z0-9._-\\s]|[\u0370-\u03FF]){3,}$');

  if (!regex.test(name)) {
    result = 'invalid_name';
  }

  if (name.length < 3 || name.length > 20) {
    result = 'name_should_be';
  }

  return result;
};

export const checkPasswordValidity = (password: string) => {
  let result = 'passed';

  if (password.length < 4) {
    result = 'password_should_be';
  }

  return result;
};

export const checkTitleValidity = (title: string) => {
  const result = 'passed';

  const regex = new RegExp('^(?:[a-zA-Z0-9._-\\s]|[\u0370-\u03FF]){3,}$');

  if (!regex.test(title)) {
    return 'invalid_title';
  }

  if (title.length < 3 || title.length > 50) {
    return 'title_should_be';
  }

  return result;
};

export const checkCurrentPasswordValidity = (currentPassword: string) => {
  let result = 'passed';

  if (!currentPassword) {
    result = 'current_password_cannot_be_empty';
  }

  return result;
};

export const checkPhoneNumberValidity = (phoneNumber: string) => {
  const isNumber = !isNaN(Number(phoneNumber));
  return !isNumber ? 'invalid_phone_number' : 'passed';
};

export const checkAmkaValidity = (value: string) => {
  const isNumberAndNotEmpty =
    value && !isNaN(Number(value)) && value.length <= 20;

  return !isNumberAndNotEmpty ? 'invalid_amka' : 'passed';
};

export const isDateOfBirthValid = (date: string) => {
  const currentDate = new Date();
  const newDate = new Date();

  const dateArray = date.split('-');
  const formattedDate = new Date(
    Number(dateArray[0]),
    Number(dateArray[1]) - 1,
    Number(dateArray[2])
  );

  const currentTime = currentDate.getTime();
  const dateInPastTime = newDate.setFullYear(newDate.getFullYear() - 120);
  const providedDateTime = formattedDate.getTime();

  if (!isNaN(providedDateTime) && !isNaN(dateInPastTime)) {
    return (
      providedDateTime <= currentTime && providedDateTime >= dateInPastTime
    );
  }

  return false;
};

const validationSelector = {
  email: checkEmailValidity,
  firstName: checkNameValidity,
  lastName: checkNameValidity,
  currentPassword: checkCurrentPasswordValidity,
  password: checkPasswordValidity,
  title: checkTitleValidity,
  amka: checkAmkaValidity,
  phoneNumber: checkPhoneNumberValidity,
};

export const handleInputValidation: InputValidationCheckType = (
  e,
  translate,
  validationType
) => {
  e.preventDefault();

  const testResult = validationSelector[validationType](e.target.value);

  if (testResult !== 'passed') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e.nativeEvent as any)?.relatedTarget === null) {
      toastMessage(translate(testResult), 'error');
    }
  }

  return testResult;
};

// function that returns text to uppercase and removes tone from greek letters
export const capitalizeText = (str: string) => {
  const toneless: { [key: string]: string } = {
    ά: 'α',
    έ: 'ε',
    ή: 'η',
    ί: 'ι',
    ό: 'ο',
    ύ: 'υ',
    ώ: 'ω',
  };

  return str
    .split('')
    .map((char) => (toneless[char] ? toneless[char] : char))
    .join('')
    .toUpperCase();
};

export const formatTimeToDisplay = (
  time: string,
  translate: (key: string) => string
) => {
  const timeArray = time.split('-');

  const result = `${timeArray[0]} ${translate(timeArray[1])}`;

  return result;
};

export const destructureTimeToObj = (time: string) => {
  const hoursArray = time?.split(':') || [];

  const dayZoneArray = hoursArray[1]?.split('-') || [];

  const result = {
    hours: hoursArray[0],
    minutes: dayZoneArray[0],
    dayZone: dayZoneArray[1],
  };

  return result;
};

export const compareDates = (date1: string | Date, date2: string | Date) => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  const yearObj1 = date1Obj.getFullYear();
  const monthObj1 = date1Obj.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month (January is 0)
  const dayObj1 = date1Obj.getDate();

  const yearObj2 = date2Obj.getFullYear();
  const monthObj2 = date2Obj.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month (January is 0)
  const dayObj2 = date2Obj.getDate();

  const comparison =
    yearObj1 === yearObj2 && monthObj1 === monthObj2 && dayObj1 === dayObj2;

  if (comparison) {
    return true;
  } else {
    return false;
  }
};

export const getAgeFromDate = (date: string) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age ? age : '';
};

export const formatDateToDisplayFromBE = (
  date: string,
  type?: 'default' | 'full',
  translate?: (key: string) => string
) => {
  const dateArray = date.split('-');

  const monthFullNames = translate
    ? translate(
        new Date(date)
          .toLocaleString('default', {
            month: 'long',
          })
          .toLowerCase()
      )
    : dateArray[1];

  const result =
    type === 'default'
      ? `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
      : `${dateArray[2]} ${monthFullNames} ${dateArray[0]}`;

  return result;
};
