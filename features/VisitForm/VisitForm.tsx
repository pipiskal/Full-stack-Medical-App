import React, { useState } from 'react';

import Button from '@/components/Button/Button';
import Error from '@/components/Error/Error';
import Loader from '@/components/Loader/Loader';
import NoPatientSelected from '@/components/NoPatientSelected/NoPatientSelected';
import PatientDataDisplay from '@/components/PatientDataDisplay/PatientDataDisplay';
import SearchBar from '@/components/SearchBar/SearchBar';
import VisitFormModal from '@/components/VisitFormModal/VisitFormModal';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import useDocument from '@/hooks/useDocument';
import { userVisitFormSelector } from '@/modules/componentSelectors';
import { FORMS_IDS } from '@/modules/constants';
import { toastMessage } from '@/modules/helpers';
import { clearPayload } from '@/modules/helpersFormatData';
import { requestClient } from '@/modules/request';
import {
  DentistVisitFormDataType,
  PatientType,
  UploadFileType,
  UserSpecialtyType,
} from '@/types';

import s from './VisitForm.module.scss';

const today = new Date().toISOString().split('T')[0];

const removeId = (formData: DentistVisitFormDataType) => {
  const { _id, ...rest } = formData;
  return rest;
};

const VisitForm = () => {
  const {
    user,
    patients: patientsList,
    isLoading: isAppDataLoading,
  } = dataContext();
  const { translate } = useLanguageContext();
  const { document } = useDocument();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<DentistVisitFormDataType | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(
    null
  );

  const resetForm = () => {
    (
      document?.getElementById(FORMS_IDS[user.specialty]) as HTMLFormElement
    )?.reset();
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    patientFormData?: DentistVisitFormDataType
  ) => {
    event.preventDefault();

    if (patientFormData !== undefined) {
      const payload = clearPayload(user.specialty, patientFormData);
      setModalData(removeId(payload));
    }
  };

  const handleFilesUpload = async (
    filesToUpload: { key: string; uploadUrl: string }[],
    uploadFilesWithData: UploadFileType[],
    historyEventId: string
  ) => {
    try {
      const filesToUploadWithProvidedUrl = filesToUpload.map((file) => ({
        ...file,
        data: uploadFilesWithData.find((fileToUpload) =>
          file.key.includes(fileToUpload.uniqueId)
        )?.data,
      }));

      const failedImagesToUploadPromises = filesToUploadWithProvidedUrl.map(
        async (file) => {
          const uploadResponse = await fetch(file.uploadUrl, {
            method: 'PUT',
            body: file.data,
          });

          if (!uploadResponse.ok) return file.key;
        }
      );

      const failedImagesToUpload = await Promise.all(
        failedImagesToUploadPromises
      ).then((values) => values.filter((value) => value !== undefined));

      if (failedImagesToUpload.length > 0) {
        const imageKeys = failedImagesToUpload.map(
          (item) => item?.split('/')[2]
        );
        toastMessage(translate('failed_images_upload'), 'error');

        await requestClient(
          `patients/${selectedPatient?._id}/history/${historyEventId}/files`,
          {
            filesToDelete: imageKeys,
          },
          'DELETE'
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSave = async () => {
    if (modalData && selectedPatient) {
      setIsLoading(true);

      // We remove the data from the files because we don't need to send it to the BE
      const filesToUpload: Omit<UploadFileType[], 'data'> = modalData?.files
        ? modalData?.files?.map((file) => {
            const { data, ...rest } = file;
            return rest;
          })
        : [];

      // get presigned urls to upload files
      const {
        success,
        statusCode,
        data: responseData,
      } = await requestClient(
        `patients/${selectedPatient._id}/history`,
        {
          ...modalData,
          files: filesToUpload || [],
        },
        'POST'
      );

      if (success && statusCode === 200) {
        if (
          responseData.filesToUpload.length > 0 &&
          modalData.files &&
          modalData.files?.length > 0
        ) {
          await handleFilesUpload(
            responseData.filesToUpload,
            modalData.files,
            responseData?.createdHistoryEvent?._id
          );
        }

        toastMessage(translate('successful_visit_registration'), 'success');
        setModalData(null);
        setSelectedPatient(null);
        resetForm();
      } else if (!success && statusCode === 409) {
        toastMessage(translate('failed_visit_registration'), 'error');
      } else {
        toastMessage(translate('generic_error'), 'error');
      }

      setIsLoading(false);
    }
  };

  return isAppDataLoading ? (
    <div className={s.loader_wrapper}>
      <Loader type="colorful" />
    </div>
  ) : patientsList === null ? (
    <Error />
  ) : (
    <div className={s.wrapper}>
      <div className={s.left_section}>
        <SearchBar
          itemsList={patientsList}
          onSelectedItem={(patient) => {
            setSelectedPatient(patient);
            resetForm();
          }}
        />

        {selectedPatient ? (
          <div className={s.form_wrapper}>
            {userVisitFormSelector(
              // TODO REMOVE THE EMPTY STRING
              '',
              user.specialty,
              true,
              null,
              isLoading,
              handleSubmit,
              {
                _id: '',
                appointmentDate: today,
                fullMouthTasks: [],
                teethTasks: [],
              }
            )}
          </div>
        ) : (
          <NoPatientSelected />
        )}
      </div>
      <div className={s.right_section}>
        <div className={s.button_wrapper}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSelectedPatient(null)}
            isDisabled={!selectedPatient}
          >
            {translate('clear')}
          </Button>
        </div>

        {selectedPatient && (
          <PatientDataDisplay patientData={selectedPatient} />
        )}
      </div>

      <VisitFormModal
        isLoading={isLoading}
        isModalOpen={Boolean(modalData)}
        modalData={modalData}
        selectedPatient={selectedPatient}
        onClearModalData={() => setModalData(null)}
        onSaveClicked={handleSave}
      />
    </div>
  );
};

export default VisitForm;
