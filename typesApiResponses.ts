// What the front end expects to receive from the backend

import {
  CalendarEventType,
  PatientType,
  ResponseStatusCodeType,
  UserFEType,
} from './types';

type BasicApiResponseType = {
  success: boolean;
  message: string;
  statusCode: ResponseStatusCodeType;
};

export type ServerResponseResponseType2 = BasicApiResponseType & {
  data: unknown;
};

export type LoginApiType = BasicApiResponseType;

export type UserResponseType = BasicApiResponseType & {
  data: UserFEType | null;
};

export type CalendarResponseEventType = BasicApiResponseType & {
  data: CalendarEventType | null;
};

export type PatientDetailsResponseEventType = BasicApiResponseType & {
  data: PatientType | null;
};
