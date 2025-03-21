/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  RightOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import HandleEventsButtons from '@/components/HandleEventsButtons/HandleEventsButtons';
import Modal from '@/components/Modal/Modal';
import VisitFormModal from '@/components/VisitFormModal/VisitFormModal';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { userVisitFormSelector } from '@/modules/componentSelectors';
import { formatDateToDisplayFromBE, toastMessage } from '@/modules/helpers';
import { clearPayload } from '@/modules/helpersFormatData';
import { requestClient } from '@/modules/request';
import {
  DentistVisitFormDataType,
  PatientType,
  UserSpecialtyType,
} from '@/types';

import s from './HistoryList.module.scss';

type HistoryListPropsType = {
  data: PatientType;
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientType | null>>;
};

type FormGenericType = {
  _id: string;
  appointmentDate: string;
  history: unknown[];
};

const HistoryList = ({ data, setSelectedPatient }: HistoryListPropsType) => {
  const { translate } = useLanguageContext();
  const { user } = dataContext();
  const [expandedItem, setExpandedItem] =
    useState<DentistVisitFormDataType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedList, setUploadedList] = useState<string[]>([]);
  const [isLeaveEditModalVisible, setIsLeaveEditModalVisible] =
    useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const history =
    (data?.history as unknown as FormGenericType[]).sort(
      (a: FormGenericType, b: FormGenericType) => {
        return (
          new Date(b?.appointmentDate || '').getTime() -
          new Date(a?.appointmentDate || '').getTime()
        );
      }
    ) || [];

  const handleExpand = (item: DentistVisitFormDataType) => {
    if (
      item &&
      (expandedItem?._id !== item._id || expandedItem?._id === item._id) &&
      isEditMode
    ) {
      setIsLeaveEditModalVisible(true);

      return;
    } else if (item && expandedItem?._id === item._id && !isEditMode) {
      setExpandedItem(null);
    } else if (item && expandedItem?._id !== item._id) {
      setIsEditMode(false);
      setExpandedItem(item);
    }
  };

  const handleAppointmentDeletion = async () => {
    setIsDeleteModalOpen(true);
    setIsLoading(true);

    const filesToDelete = expandedItem?.files?.map((item) => item.uniqueId);

    const result = await requestClient(
      `patients/${data?._id}/history/${expandedItem?._id}`,
      { filesToDelete },
      'DELETE'
    );

    if (result.success) {
      setSelectedPatient((prev) => {
        if (prev) {
          return {
            ...prev,
            history: prev?.history?.filter(
              (item) => item?._id !== expandedItem?._id
            ),
          };
        }
        return null;
      });

      setIsEditMode(false);
      toastMessage(translate('delete_appointment_success'), 'success');
    } else {
      toastMessage(translate('generic_error'), 'error');
    }
    setIsLoading(false);
    setIsDeleteModalOpen(false);
  };

  const handleFilesUpload = async (
    filesToUpload: any,
    formattedFiles: any,
    historyEventId: string
  ) => {
    try {
      const filesToUploadWithProvidedUrl = filesToUpload.map((file: any) => ({
        ...file,
        data: formattedFiles.find((fileToUpload: any) =>
          file.key.includes(fileToUpload.uniqueId)
        ).data,
      }));

      const failedImagesToUploadPromises = filesToUploadWithProvidedUrl.map(
        async (file: any) => {
          const uploadResponse = await fetch(file.uploadUrl, {
            method: 'PUT',
            body: file.data,
          });

          if (uploadResponse.status === 200 && uploadResponse.ok) {
            const formattedKey = file.key.split('/')[2];
            setUploadedList((prev) => [...prev, formattedKey]);
          } else {
            return file.key;
          }
        }
      );

      try {
        const failedImagesToUpload = await Promise.all(
          failedImagesToUploadPromises
        ).then((values) => values.filter((value) => value !== undefined));

        if (failedImagesToUpload.length > 0) {
          const imageKeys = failedImagesToUpload.map(
            (item) => item?.split('/')[2]
          );
          toastMessage(translate('failed_images_upload'), 'error');

          await requestClient(
            `patients/${data?._id}/history/${historyEventId}/files`,
            {
              filesToDelete: imageKeys,
            },
            'DELETE'
          );

          return imageKeys;
        }
      } catch (error) {
        console.log('something went wrong', error);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    value?: DentistVisitFormDataType
  ) => {
    event.preventDefault();

    if (value) {
      setIsLoading(true);

      const payload = clearPayload(user.specialty as UserSpecialtyType, value);

      const formattedPayload = {
        ...payload,
        files: payload.files?.map((item) => {
          const { data: removedData, ...rest } = item;
          return {
            ...rest,
            isForUpload:
              Boolean(item?.data) && !uploadedList.includes(item?.uniqueId),
          };
        }),
      };

      const filesToDelete = expandedItem?.files?.filter(
        (item) =>
          !payload.files?.find((file) => file.uniqueId === item.uniqueId)
      );

      // saving form data to db and getting back the upload url for files
      const { data: responseData, success } = await requestClient(
        `patients/${data?._id}/history/${expandedItem?._id}`,
        { formattedPayload, filesToDelete },
        'PATCH'
      );

      if (success) {
        if (responseData?.filesToUpload?.length > 0) {
          const failedFilesToUpload = await handleFilesUpload(
            responseData.filesToUpload,
            payload.files,
            expandedItem?._id || ''
          );

          toastMessage(
            translate('appointment_updated_successfully'),
            'success'
          );

          const updatedPatientHistory = data?.history?.map(
            (item: DentistVisitFormDataType) => {
              if (item?._id === expandedItem?._id) {
                return {
                  ...payload,
                  files: payload.files?.filter(
                    (file) => !failedFilesToUpload?.includes(file?.uniqueId)
                  ),
                };
              }
              return item;
            }
          );

          setSelectedPatient((prev) => {
            if (prev) {
              return {
                ...prev,
                history: updatedPatientHistory,
              };
            }
            return null;
          });

          if (failedFilesToUpload?.length ?? 0 > 0) {
            setExpandedItem(null);
            setIsEditMode(false);
            setIsLoading(false);
            return;
          }
        }

        setIsEditMode(false);
        setExpandedItem(payload);
      } else {
        toastMessage(translate('generic_error'), 'error');
      }

      setIsLoading(false);
    }
  };

  return history && history.length > 0 ? (
    <div className={s.wrapper}>
      {/*eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {history.map((item: any, index: number) => (
        <div key={item?._id}>
          <div
            className={`
            ${item?._id === expandedItem?._id && s.header_active}
            ${
              index === history.length - 1 &&
              item?._id !== expandedItem?._id &&
              s.remove_border
            }
            ${index === 0 && s.top_header}
            ${index === history.length - 1 && s.bottom_header}
            ${s.header}`}
          >
            <button
              className={s.content_item}
              onClick={() => handleExpand(item)}
            >
              {
                <RightOutlined
                  className={
                    s[expandedItem?._id === item?._id ? 'arrow_down' : 'arrow']
                  }
                />
              }

              <p className={s.appointment_date}>
                {formatDateToDisplayFromBE(
                  item?.appointmentDate || '',
                  'full',
                  translate
                )}
              </p>
            </button>

            {expandedItem?._id === item?._id ? (
              <HandleEventsButtons
                onEditClick={() => setIsEditMode(true)}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setIsPrintModalOpen={setIsPrintModalOpen}
              />
            ) : null}
          </div>

          <div
            className={`${
              s[
                expandedItem?._id === item?._id
                  ? 'element_content_visible'
                  : 'element_content_hidden'
              ]
            }
            ${index === history.length - 1 && s.rounded_bottom_element}
             ${
               index === history.length - 1 &&
               item?._id === expandedItem?._id &&
               s.remove_border
             }
             ${!isEditMode ? s.visit_form_wrapper : ''}
            `}
          >
            <div className={s.message_wrapper}>
              <p className={s.message}>
                {translate('use_edit_button_instructions')}

                <span>
                  <EditOutlined />
                </span>
              </p>
            </div>

            {item?._id === expandedItem?._id
              ? userVisitFormSelector(
                  data?._id || '',
                  user.specialty,
                  isEditMode,
                  setIsEditMode,
                  isLoading,
                  handleSubmit,
                  expandedItem
                )
              : null}
          </div>
        </div>
      ))}

      <DeleteModal
        title={translate('delete_appointment_history_confirmation')}
        isModalOpen={isDeleteModalOpen}
        isLoading={isLoading}
        setIsModalOpen={setIsDeleteModalOpen}
        handleSelectedEventDelete={handleAppointmentDeletion}
      >
        <>
          <p>{translate('selected_date')} :</p>
          <p>
            {formatDateToDisplayFromBE(
              expandedItem?.appointmentDate || '',
              'full',
              translate
            )}
          </p>
        </>
      </DeleteModal>

      <Modal
        isVisible={isLeaveEditModalVisible}
        title={translate('edit_in_progress')}
        onClose={() => setIsLeaveEditModalVisible(false)}
      >
        <div className={s.leave_edit_wrapper}>
          <WarningOutlined />
          <p className={s.leave_edit_text}>
            {translate('leave_edit_explanation')}
          </p>
        </div>
      </Modal>

      <VisitFormModal
        isLoading={isLoading}
        isModalOpen={isPrintModalOpen}
        isPrintMainAction
        modalData={expandedItem}
        selectedPatient={data}
        onClearModalData={() => setIsPrintModalOpen(false)}
      />
    </div>
  ) : (
    <div className={s.no_history}>
      <p>{translate('no_history')}</p>
    </div>
  );
};

export default HistoryList;
