import {
  DentistVisitFormDataType,
  UserFEType,
  UserSpecialtyType,
} from '@/types';

type FormatFunctionSelectorType = {
  [key in UserSpecialtyType | string]: (data: unknown) => void;
};

type FormatDentistDataForBEType = {
  appointmentDate: string;
  fullMouthTasks: string[];
  teethTasks: {
    toothId: string;
    tasks: string[];
    description: string;
  }[];
};

const formatDentistDataForBE: (
  data: Record<string, string>
) => FormatDentistDataForBEType = (data: Record<string, string>) => {
  const formattedData = Object.entries(data).reduce(
    (result, [key, value]) => {
      if (key === 'appointmentDate') {
        result.appointmentDate = value;
      } else if (key.includes('-')) {
        const [toothId, taskName] = key.split('-');
        const taskDescription = data[`${toothId}-description`];

        const toothIndex = result.teethTasks.findIndex(
          (tooth) => tooth.toothId === toothId
        );

        if (toothIndex !== -1) {
          taskName !== 'description' &&
            result.teethTasks[toothIndex].tasks.push(taskName);
        } else {
          result.teethTasks.push({
            toothId: toothId,
            tasks: [taskName].filter((item) => item !== 'description'),
            description: taskDescription,
          });
        }
      } else if (value === 'on') {
        result.fullMouthTasks.push(key);
      }

      return result;
    },
    {
      appointmentDate: data.appointmentDate,
      fullMouthTasks: [] as FormatDentistDataForBEType['fullMouthTasks'],
      teethTasks: [] as FormatDentistDataForBEType['teethTasks'],
    }
  );

  formattedData.teethTasks = formattedData.teethTasks.filter(
    (tooth) => tooth.description || tooth.tasks.length
  );

  return formattedData;
};

export const clearDentistData = (data: DentistVisitFormDataType) => {
  return {
    ...data,
    teethTasks: data?.teethTasks?.reduce(
      (
        acc: DentistVisitFormDataType['teethTasks'],
        item: DentistVisitFormDataType['teethTasks'][0]
      ) =>
        item?.tasks?.length || item?.description ? [...acc, item] : [...acc],
      []
    ),
  };
};

export const clearPayload = (
  specialty: UserFEType['specialty'],
  payload: DentistVisitFormDataType
) => {
  const specialtiesClearFunctions: {
    [key: UserFEType['specialty']]: DentistVisitFormDataType;
  } = {
    dentist: clearDentistData(payload),
  };

  return specialtiesClearFunctions[specialty];
};
