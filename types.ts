import { ReactNode } from 'react';

import { SUPPORTED_LANGUAGES } from './modules/constants';

export type SupportedLanguagesType = keyof typeof SUPPORTED_LANGUAGES;

export type ParamsLangType = {
  lang: SupportedLanguagesType;
};

export type ParamsType = {
  params: ParamsLangType;
};

export type TranslationsType = {
  [key: string]: string;
};

export type LanguageType = 'en' | 'el';

export type GetTranslationsType = (
  params: ParamsLangType
) => Promise<TranslationsType>;

export type ResponseStatusCodeType = 200 | 201 | 400 | 401 | 404 | 409 | 500;

export type UserSpecialtyType = 'dentist';

export type UserFEType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: UserSpecialtyType | string;
  password?: string;
};

export type InputValidationType =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'currentPassword'
  | 'password'
  | 'title'
  | 'amka'
  | 'phoneNumber';

export type LayoutPropsType = {
  children: React.ReactNode;
  params: {
    lang: string;
  };
};

export type SelectedModalContentType =
  | 'account'
  | 'settings'
  | 'billing'
  | 'support';

export type UserMenuContent = {
  [key in SelectedModalContentType]: ReactNode | null;
};

export type UserSpecialtyContent = {
  [key in UserSpecialtyType | string]: ReactNode | null;
};

export type IconSelector = {
  [key: string]: JSX.Element;
};

export type EventColorType = 'blue' | 'red' | 'green';

export type EventModalType =
  | 'idle'
  | 'new_event'
  | 'update_event'
  | 'new_with_initial_data';

export type CalendarEventType = {
  _id: string;
  _v: number;
  userId: string;
  date: Date;
  startingTime: string;
  endingTime: string;
  title: string;
  description: string;
  color: EventColorType;
};

export type TeethTasksType = {
  toothId?: string;
  tasks?: string[];
  description?: string;
};

type GenericPatientHistoryType = {
  _id?: string;
  appointmentDate: string;
};

export type UploadFileType = {
  uniqueId: string;
  name: string;
  uploadFileType: string;
  size: number;
  data?: string;
  isForUpload?: boolean;
};

export type DentistVisitFormDataType = GenericPatientHistoryType & {
  fullMouthTasks: string[];
  teethTasks: TeethTasksType[];
  files?: UploadFileType[];
};

// according to user specialty the patient history will be different, create a generic type

// TODO : finalize patient type
export type PatientType = {
  _id: string;
  amka: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  history?: DentistVisitFormDataType[];
  extraDetails?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MappingWithStringKeysType = {
  [key: string]: string;
};

export type PatientSearchType = {
  _id: string;
  firstName: string;
  lastName: string;
  amka: string;
  dob: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
};

export type TeethSelectorStateType = string[];

export type InputValidationCheckType = (
  e: React.ChangeEvent<HTMLInputElement>,
  translate: (key: string) => string,
  validationType: InputValidationType
) => string | 'passed';
