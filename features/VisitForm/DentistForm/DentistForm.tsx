import React, { useState } from 'react';

import CollapsibleTable from '@/components/CollapsibleTable/CollapsibleTable';
import Input from '@/components/Input/Input';
import UploadFiles from '@/components/UploadFiles/UploadFiles';
import { useLanguageContext } from '@/context/LanguageProvider';
import { DENTIST_FORM_DATA } from '@/modules/constants';
import { clearDentistData } from '@/modules/helpersFormatData';
import { requestClient } from '@/modules/request';
import {
  DentistVisitFormDataType,
  TeethSelectorStateType,
  TeethTasksType,
  UploadFileType,
} from '@/types';

import SubmitVisitFormHead from '../SubmitVisitFormHead/SubmitVisitFormHead';
import s from './DentistForm.module.scss';
import { getToothName } from './TeethSelector/Helpers';
import TeethSelector from './TeethSelector/TeethSelector';

type DentistFormPropsType = {
  isEditMode: boolean;
  patientId: string;
  initialValues: DentistVisitFormDataType | null;
  setIsEditMode?: ((value: boolean) => void) | null;
  isLoading?: boolean;
  handleSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    value: DentistVisitFormDataType
  ) => void;
};

const toothInputData = (
  tooth: string,
  initialValues: TeethTasksType,
  translate: (key: string) => string,
  isReadOnly: boolean,
  handleToothDataChange: (toothId: string, data: TeethTasksType) => void
) => {
  const checkBoxesInitialValues = initialValues?.tasks
    ? initialValues.tasks
    : [];

  const descriptionInitialValue = initialValues?.description
    ? initialValues?.description
    : '';

  return (
    <div className={s.tooth_input_data}>
      <div className={s.checkboxes_wrapper}>
        {DENTIST_FORM_DATA.TEETH_DATA.map((item) => (
          <div className={s.checkbox_wrapper} key={item}>
            <input
              type="checkbox"
              id={`${tooth}-${item}`}
              name={`${tooth}-${item}`}
              disabled={isReadOnly}
              checked={checkBoxesInitialValues.includes(item)}
              onChange={() => {
                handleToothDataChange(tooth, {
                  tasks: checkBoxesInitialValues.includes(item)
                    ? checkBoxesInitialValues.filter(
                        (task: string) => task !== item
                      )
                    : [...checkBoxesInitialValues, item],
                });
              }}
            />
            <label htmlFor={`${tooth}-${item}`}>{translate(item)}</label>
          </div>
        ))}
      </div>

      {isReadOnly ? (
        initialValues?.description && (
          <div className={s.fake_description_wrapper}>
            <p className={s.fake_label}>{translate('description')}</p>

            <p className={s.fake_description}>{initialValues?.description}</p>
          </div>
        )
      ) : (
        <Input
          label={translate('description')}
          elementId={`${tooth}-description`}
          value={descriptionInitialValue}
          onHandle={(value: string) => {
            handleToothDataChange(tooth, {
              description: value,
            });
          }}
          type="textarea"
          maxLength={500}
        />
      )}
    </div>
  );
};

const formattedData = (
  selectedTeeth: TeethSelectorStateType,
  initialValues: DentistVisitFormDataType,
  translate: (key: string) => string,
  isReadOnly: boolean,
  handleToothDataChange: (toothId: string, data: TeethTasksType) => void
) => {
  const dataToMap: string[] =
    selectedTeeth ||
    initialValues?.teethTasks?.map((item: TeethTasksType) => item.toothId);

  return dataToMap?.map((item: string) => ({
    title: item,
    description: `${translate(getToothName(item)?.position || '')} ${translate(
      getToothName(item)?.name || ''
    )}`,
    content: toothInputData(
      item,
      initialValues?.teethTasks?.find(
        (tooth: TeethTasksType) => tooth?.toothId === item
      ) || {
        toothId: item,
        tasks: [],
        description: '',
      },
      translate,
      isReadOnly,
      handleToothDataChange
    ),
  }));
};

const DentistForm = ({
  isEditMode,
  patientId,
  initialValues,
  setIsEditMode,
  isLoading,
  handleSubmit,
}: DentistFormPropsType) => {
  const { translate } = useLanguageContext();
  const isReadOnly = !isEditMode;
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [formData, setFormData] = useState<DentistVisitFormDataType | null>(
    initialValues
  );

  const initialSelectedTeeth: TeethSelectorStateType =
    initialValues?.teethTasks?.map(
      (item: TeethTasksType) => item.toothId || ''
    ) || [];

  const [selectedTeeth, setSelectedTeeth] = useState<TeethSelectorStateType>(
    initialSelectedTeeth || null
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataToCheck: any = formData || initialValues;

  const teethSelection: TeethSelectorStateType =
    selectedTeeth.length > 0 ? selectedTeeth : initialSelectedTeeth;

  const submitReadinessCheck = () => {
    const clearedFormData = clearDentistData(dataToCheck);

    const isFormDataIsEmpty =
      clearedFormData.fullMouthTasks?.length === 0 &&
      clearedFormData?.teethTasks?.length === 0;

    const testClearedFormDataTeethTasks = clearedFormData.teethTasks?.map(
      (item: TeethTasksType) => {
        const sortedTasks = item.tasks?.sort((a, b) =>
          a === b ? 0 : a < b ? -1 : 1
        );

        return {
          toothId: item.toothId,
          ...(item.description && { description: item.description }),
          tasks: sortedTasks,
        };
      }
    );

    const testInitialFormDataTeethTasks = initialValues?.teethTasks?.map(
      (item: TeethTasksType) => {
        const sortedTasks = item.tasks?.sort((a, b) =>
          a === b ? 0 : a < b ? -1 : 1
        );

        return {
          toothId: item.toothId,
          ...(item.description && { description: item.description }),
          tasks: sortedTasks,
        };
      }
    );

    const testClearFormData = {
      ...clearedFormData,
      teethTasks: testClearedFormDataTeethTasks,
    };

    const testInitialFormData = {
      ...initialValues,
      teethTasks: testInitialFormDataTeethTasks,
    };

    const isOriginalDataSame =
      JSON.stringify(testClearFormData) === JSON.stringify(testInitialFormData);

    const isDateFilled = dataToCheck?.appointmentDate;

    if (!isOriginalDataSame && isDateFilled && !isFormDataIsEmpty) {
      return false;
    } else {
      return true;
    }
  };

  const isUpdateButtonDisabled = submitReadinessCheck();

  const handleToothSelection = (teeth: TeethSelectorStateType) => {
    const removedTooth = teethSelection?.find((item) => !teeth?.includes(item));

    const removedToothData = dataToCheck?.teethTasks?.find(
      (item: TeethTasksType) => item.toothId === removedTooth
    );

    const isDescriptionOrTeethTasksEmpty =
      !removedToothData?.description && !removedToothData?.tasks?.length;

    if (isDescriptionOrTeethTasksEmpty) {
      setSelectedTeeth(teeth);
    }
  };

  const handleDeleteSelectedTooth = (tooth: string) => {
    // remove tooth from selected teeth
    const newSelectedTeeth = teethSelection?.filter((item) => item !== tooth);

    if (newSelectedTeeth) {
      setSelectedTeeth(newSelectedTeeth);
    }

    // remove all tooth data from form data
    const newFormData = dataToCheck?.teethTasks?.filter(
      (item: TeethTasksType) => item.toothId !== tooth
    );

    const updatedFormData = {
      ...dataToCheck,
      teethTasks: newFormData,
    };

    if (newFormData) {
      setFormData(updatedFormData as DentistVisitFormDataType);
    }
  };

  const handleFullMouthTasksSelection = (item: string) => {
    const newFullMouthTasks = dataToCheck.fullMouthTasks?.includes(item)
      ? dataToCheck.fullMouthTasks?.filter((task: string) => task !== item)
      : [...(dataToCheck.fullMouthTasks || []), item];

    setFormData({
      ...dataToCheck,
      fullMouthTasks: newFullMouthTasks,
    });
  };

  const handleToothDataChange = (toothId: string, data: TeethTasksType) => {
    const toothData = dataToCheck?.teethTasks?.find(
      (item: TeethTasksType) => item.toothId === toothId
    );

    const teethTasksUpdate = toothData
      ? dataToCheck?.teethTasks?.map((item: TeethTasksType) =>
          item.toothId === toothId ? { ...item, ...data } : item
        )
      : [
          ...(dataToCheck?.teethTasks || []),
          {
            ...data,
            toothId,
          },
        ];

    const newFormData = {
      ...dataToCheck,
      teethTasks: teethTasksUpdate,
    };

    setFormData(newFormData as DentistVisitFormDataType);
  };

  const handleDateSelection = (date: string) => {
    setFormData({
      ...dataToCheck,
      appointmentDate: date,
    });
  };

  const dataForCollapsibleTable = formattedData(
    selectedTeeth || teethSelection,
    dataToCheck,
    translate,
    isReadOnly,
    handleToothDataChange
  );

  const handleFilesUpload = (files: FileList) => {
    setFormData({
      ...dataToCheck,
      files: [...(dataToCheck?.files || []), files],
    });
  };

  const handleFilesRemove = (file: UploadFileType) => {
    const newFiles = dataToCheck?.files?.filter((item: UploadFileType) => {
      return item.uniqueId !== file.uniqueId;
    });

    if (newFiles?.length === 0) {
      const { files, ...formDataWithoutFiles } = dataToCheck;
      setFormData(formDataWithoutFiles);
    } else {
      setFormData({
        ...dataToCheck,
        files: newFiles,
      });
    }
  };

  const handleFilePreview = async (selectedFile: UploadFileType) => {
    setIsActionInProgress(true);
    if (selectedFile?.data === undefined && selectedFile !== null) {
      try {
        const s3Response = await requestClient(
          `patients/${patientId}/files/${selectedFile.uniqueId}`
        );

        const response = await fetch(s3Response.data.getPresignedUrl, {
          method: 'GET',
        });

        if (response.status === 200 && response.ok) {
          const file = await response.text();

          setFormData({
            ...dataToCheck,
            files: dataToCheck?.files?.map((item: UploadFileType) =>
              item.uniqueId === selectedFile.uniqueId
                ? { ...item, data: file }
                : item
            ),
          });

          setIsActionInProgress(false);
          return file;
        }
      } catch (error) {
        setIsActionInProgress(false);
      }
    }
  };

  return (
    initialValues && (
      <div className={`${isReadOnly && s.disabled_form} ${s.wrapper}`}>
        <form
          className={s.wrapper}
          onSubmit={(e) => formData && handleSubmit?.(e, formData)}
          id="dentist_form"
        >
          <SubmitVisitFormHead
            isActionButtonDisabled={isUpdateButtonDisabled}
            isReadOnly={isReadOnly}
            defaultDate={dataToCheck.appointmentDate}
            handleDateSelection={handleDateSelection}
            isLoading={isLoading}
            onCancel={
              setIsEditMode
                ? () => {
                    setIsEditMode?.(false);
                    setFormData(initialValues);
                    setSelectedTeeth(initialSelectedTeeth);
                  }
                : null
            }
          />

          <div className={s.checkboxes_wrapper}>
            {DENTIST_FORM_DATA.FULL_MOUTH_DATA.map((item) => (
              <div className={s.checkbox_wrapper} key={item}>
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  disabled={isReadOnly}
                  checked={dataToCheck.fullMouthTasks?.includes(item)}
                  onChange={() => {
                    handleFullMouthTasksSelection(item);
                  }}
                />
                <label htmlFor={item}>{translate(item)}</label>
              </div>
            ))}
          </div>

          <div className={s.teeth_selector_wrapper}>
            <div>
              <TeethSelector
                selectedTeeth={selectedTeeth || teethSelection}
                handleToothSelection={handleToothSelection}
                isReadOnly={isReadOnly}
              />
            </div>

            <div className={s.table_wrapper}>
              {dataForCollapsibleTable && (
                <CollapsibleTable
                  data={dataForCollapsibleTable}
                  isReadOnly={isReadOnly}
                  onDeleteItem={handleDeleteSelectedTooth}
                  triggerExpand={selectedTeeth?.length || 0}
                />
              )}
            </div>
          </div>
        </form>

        <UploadFiles
          onUpload={handleFilesUpload}
          onRemove={handleFilesRemove}
          onPreviewFile={(file: UploadFileType) => handleFilePreview(file)}
          filesToUpload={dataToCheck?.files || []}
          isActionInProgress={isActionInProgress}
        />
      </div>
    )
  );
};

export default DentistForm;
