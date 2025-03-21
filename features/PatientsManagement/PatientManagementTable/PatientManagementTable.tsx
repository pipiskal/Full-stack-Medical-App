import { RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import HandleEventsButtons from '@/components/HandleEventsButtons/HandleEventsButtons';
import PatientForm from '@/components/PatientForm/PatientForm';
import { useLanguageContext } from '@/context/LanguageProvider';
import { PatientType } from '@/types';

import NoPatientFound from '../NoPatientFound/NoPatientFound';
import s from './PatientManagementTable.module.scss';

type PatientManagementTablePropsType = {
  patients: PatientType[];
  onDeletePatient: (patientId: string) => void;
  onUpdatePatient: (
    patientId: string,
    patient: Omit<PatientType, '_id'>
  ) => Promise<void>;
};

const PatientManagementTable = ({
  patients,
  onDeletePatient,
  onUpdatePatient,
}: PatientManagementTablePropsType): JSX.Element => {
  const { translate } = useLanguageContext();
  const [expandedPatient, setExpandedPatient] = useState<PatientType | null>(
    null
  );
  const [isFormReadOnly, setIsFormReadOnly] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleExpand = (patient: PatientType) => {
    setIsFormReadOnly(true);

    expandedPatient?._id === patient._id
      ? setExpandedPatient(null)
      : setExpandedPatient(patient);
  };

  return (
    <div className={`${s.wrapper}`}>
      {expandedPatient && (
        <DeleteModal
          title={translate('delete_patient_confirmation')}
          isModalOpen={isModalOpen}
          isLoading={false}
          setIsModalOpen={() => setIsModalOpen(false)}
          handleSelectedEventDelete={() =>
            onDeletePatient(expandedPatient?._id)
          }
        >
          <p>{translate('patients_name')} : </p>
          <p>{`${expandedPatient?.lastName} ${expandedPatient?.firstName}`}</p>
        </DeleteModal>
      )}

      <div className={`${s.table_wrapper}  scrollbar`}>
        {patients && (
          <div className={s.header_details}>
            <span className={s.header_details_item}>{translate('amka')}</span>
            <span className={s.header_details_item}>
              {translate('last_name')}
            </span>
            <span className={s.header_details_item}>
              {translate('first_name')}
            </span>
            <span className={s.header_details_item}>{translate('phone')}</span>
          </div>
        )}

        <div className={s.table_content}>
          {patients &&
            patients.length > 0 &&
            patients
              ?.sort((a, b) => (a.lastName < b.lastName ? -1 : 1))
              .map((patient: PatientType, i: number) => (
                <div key={patient._id}>
                  <div
                    className={`${
                      expandedPatient?._id === patient._id
                        ? s.row
                        : s.row_with_hover
                    } ${i === patients.length - 1 ? s.last_row : ''}`}
                  >
                    <button
                      className={s.content_item}
                      onClick={() => handleExpand(patient)}
                    >
                      {
                        <RightOutlined
                          className={
                            s[
                              expandedPatient?._id === patient._id
                                ? 'arrow_down'
                                : 'arrow'
                            ]
                          }
                        />
                      }

                      <div className={s.info_row}>
                        <p className={s.row_item}>{patient.amka}</p>
                        <p className={s.row_item}>{patient.lastName}</p>
                        <p className={s.row_item}>{patient.firstName}</p>
                        <p className={s.row_item}>
                          {patient.phoneNumber ? patient.phoneNumber : '-'}
                        </p>
                      </div>
                    </button>

                    <span className={s.actions_wrapper}>
                      {expandedPatient?._id === patient._id ? (
                        <HandleEventsButtons
                          onEditClick={() => setIsFormReadOnly(false)}
                          setIsDeleteModalOpen={() => setIsModalOpen(true)}
                        />
                      ) : (
                        <div className={s.actions}></div>
                      )}
                    </span>
                  </div>

                  <div
                    className={`${
                      s[
                        expandedPatient?._id === patient._id
                          ? 'element_content_visible'
                          : 'element_content_hidden'
                      ]
                    } ${
                      i === patients.length - 1
                        ? s.last_element_content_visible
                        : ''
                    }`}
                  >
                    {patient !== null && expandedPatient !== null && (
                      <div className={s.patient_form_wrapper}>
                        {expandedPatient?._id === patient._id ? (
                          <PatientForm
                            formType="updatePatient"
                            isReadOnly={isFormReadOnly}
                            initialFormDetails={{
                              ...patient,
                              dob: `${patient.dob}`,
                            }}
                            onCancel={() => setIsFormReadOnly(true)}
                            onSubmit={async (value) => {
                              await onUpdatePatient(expandedPatient._id, value);
                              setIsFormReadOnly(true);
                            }}
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {patients && patients.length === 0 && (
          <div className={s.no_patient_found_wrapper}>
            <div className={s.no_patient_found}>
              <NoPatientFound />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagementTable;
