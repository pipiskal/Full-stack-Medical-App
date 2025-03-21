import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

import Error from '@/components/Error/Error';
import Loader from '@/components/Loader/Loader';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import { PatientType } from '@/types';

import PatientManagementTable from './PatientManagementTable/PatientManagementTable';
import s from './PatientsManagement.module.scss';

const PatientsManagement = (): JSX.Element => {
  const { translate } = useLanguageContext();
  const { patients, setPatients, isLoading } = dataContext();
  const [searchedValue, setSearchedValue] = useState<string>('');

  const filteredPatients =
    patients && searchedValue
      ? patients.filter((patientDetails: PatientType) => {
          const { amka, firstName, lastName, phoneNumber } = patientDetails;

          const searchedValueLower = searchedValue.toLowerCase();

          return (
            amka.toLowerCase().includes(searchedValueLower) ||
            firstName.toLowerCase().includes(searchedValueLower) ||
            lastName.toLowerCase().includes(searchedValueLower) ||
            phoneNumber.toLowerCase().includes(searchedValueLower)
          );
        })
      : patients;

  const handlePatientDeletion = async (patientId: string) => {
    const { success, statusCode } = await requestClient(
      `patients/${patientId}`,
      false,
      'DELETE'
    );

    if (success && statusCode === 200 && patients !== null) {
      setPatients(patients.filter((patient) => patient._id !== patientId));
      toastMessage(translate('patient_deleted_successfully'), 'success');
    }
  };

  const handlePatientUpdate = async (
    patientId: string,
    patient: Omit<PatientType, '_id'>
  ) => {
    const { success, statusCode, data } = await requestClient(
      `patients/${patientId}`,
      patient,
      'PATCH'
    );

    if (success && statusCode === 200 && patients !== null) {
      const updatedPatients = patients.map((p) => {
        if (p._id === data._id) {
          return data;
        }
        return p;
      });

      setPatients(updatedPatients);
      toastMessage(translate('patient_updated_successfully'), 'success');
    } else {
      toastMessage('Something went wrong', 'error');
    }
  };

  return isLoading ? (
    <div className={s.loader_wrapper}>
      <Loader type="colorful" />
    </div>
  ) : patients === null ? (
    <Error />
  ) : (
    <div className={s.wrapper}>
      <div className={s.search_wrapper}>
        <SearchOutlined className={s.search_icon} />

        <input
          id="searchBar"
          type="text"
          name="Search"
          onChange={(e) => setSearchedValue(e.target.value)}
          className={s.searchBar}
          placeholder={translate('search_patient')}
          maxLength={45}
        />
      </div>

      <div className={`${s.table} scrollbar`}>
        {filteredPatients && filteredPatients.length >= 0 && (
          <PatientManagementTable
            patients={filteredPatients}
            onDeletePatient={(patientId) => handlePatientDeletion(patientId)}
            onUpdatePatient={(patientId, updatedInfo) =>
              handlePatientUpdate(patientId, updatedInfo)
            }
          />
        )}
      </div>
    </div>
  );
};

export default PatientsManagement;
