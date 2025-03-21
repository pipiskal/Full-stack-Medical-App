import mongoose from 'mongoose';

import { SPECIALTIES } from './modules/constants';

export type StatusCodeType = 200 | 201 | 400 | 401 | 404 | 409 | 500;

export type DecodedAccessTokenType = {
  userId: string;
  rememberMe: boolean;
  exp: number;
  iat: number;
};

export type AccessTokenValuesType = {
  userId: string | undefined;
  rememberMe?: boolean;
};

type SpecialtyType = (typeof SPECIALTIES)[number];

export type PatientType = {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  doctorId: string;
  amka: string;
  firstName: string;
  lastName: string;
  dob: string;
  history: {
    _id: string;
    appointmentDate: string;
    fullMouthTasks: string[];
    teethTasks: {
      toothId: string;
      tasks: string[];
      description?: string;
    }[];
    files: {
      uniqueId: string;
      name: string;
      uploadFileType: string;
      size: number;
    }[];
  };
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  extraDetails: string;
};

export type UserBEType = {
  _id: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  comparePasswords: (
    password: string,
    userPassword: string
  ) => Promise<boolean>;
  firstName: string;
  lastName: string;
  specialty: SpecialtyType;
  subscriptionPlan?: 'trial' | 'monthly' | 'yearly';
  isSubscriptionActive?: boolean;
  isSubscriptionSuspended?: boolean;
  isSubscriptionCanceled?: boolean;
  preferableLanguage?: 'el' | 'en';
  createdAt: Date;
  updatedAt: Date;
  // passwordChangedAt?: string;
};

export type UserDoc = mongoose.Document & UserBEType;

export type CalendarEventType = {
  userId: string;
  date: Date;
  startingTime: string;
  endingTime: string;
  title: string;
  description: string;
  color: 'blue' | 'red' | 'green';
  createdAt: Date;
};

export enum HTTPMethods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
// export type UserDoc = mongoose.Document & UserType;
