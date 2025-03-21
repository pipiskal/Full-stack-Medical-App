/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from 'react';

import { requestClient } from '@/modules/request';
import { PatientType, UserFEType } from '@/types';
import { UserResponseType } from '@/typesApiResponses';

type DefaultContextValuesType = {
  user: UserFEType;
  setUser: (user: UserFEType) => void;
  patients: PatientType[] | null;
  setPatients: (patients: PatientType[] | null) => void;
  isLoading: boolean;
};

type DataProviderPropsType = {
  children: React.ReactNode;
};

const defaultContextValues: DefaultContextValuesType = {
  user: {
    _id: '',
    firstName: '',
    lastName: '',
    specialty: '',
    email: '',
  },
  setUser: () => {},
  patients: [],
  setPatients: () => {},
  isLoading: false,
};

const AppContext = createContext(defaultContextValues);

export const DataProvider = ({ children }: DataProviderPropsType) => {
  const [isLoading, setIsLoading] = useState<boolean>(
    defaultContextValues.isLoading
  );
  const [user, setUser] = useState<UserFEType>(defaultContextValues.user);
  const [patients, setPatients] = useState<PatientType[] | null>(
    defaultContextValues.patients
  );

  const getUserDetails = async () => {
    const { success, data }: UserResponseType = await requestClient('user');

    if (success && data !== null) {
      setUser(data);
    }
  };

  const getPatientDetails = async () => {
    const { success, data } = await requestClient('patients');

    if (success && data !== null) {
      setPatients(data);
    } else {
      setPatients(null);
    }
  };

  const getAllData = async () => {
    setIsLoading(true);

    await Promise.all([getUserDetails(), getPatientDetails()]);

    setIsLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, patients, setPatients, isLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const dataContext = () => {
  return useContext(AppContext);
};
