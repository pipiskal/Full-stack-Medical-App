import {
  CalendarOutlined,
  EditOutlined,
  FileAddOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import Account from '@/components/UserMenu/Account/Account';
import DayCalendar from '@/features/Calendar/DayCalendar/DayCalendar';
import WeekCalendar from '@/features/Calendar/WeekCalendar/WeekCalendar';
import DentistForm from '@/features/VisitForm/DentistForm/DentistForm';
import DentistVisitCheckoutForm from '@/Templates/VisitCheckoutForms/DentistVisitCheckoutForm/DentistVisitCheckoutForm';
import {
  DentistVisitFormDataType,
  IconSelector,
  SelectedModalContentType,
  UserMenuContent,
  UserSpecialtyContent,
  UserSpecialtyType,
} from '@/types';

export const userMenuContentSelector = (
  key: SelectedModalContentType,
  handleCloseModal?: () => void
) => {
  const userMenuContent: UserMenuContent = {
    account: <Account handleCloseModal={handleCloseModal} />,
    settings: null,
    billing: null,
    support: null,
  };

  return userMenuContent[key];
};

export const userVisitFormSelector = (
  patientId: string,
  key: UserSpecialtyType | string,
  isEditMode: boolean,
  setIsEditMode: ((value: boolean) => void) | null,
  isLoading: boolean,
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data?: DentistVisitFormDataType
  ) => void,
  initialValues: DentistVisitFormDataType | null
) => {
  const userVisitFormContent: UserSpecialtyContent = {
    dentist: (
      <DentistForm
        patientId={patientId}
        isEditMode={isEditMode}
        initialValues={initialValues}
        setIsEditMode={setIsEditMode || null}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    ),
  };

  return userVisitFormContent[key];
};

export const iconSelector: IconSelector = {
  registerAppointment: <CalendarOutlined />,
  patientsManagement: <UserSwitchOutlined />,
  history: <HistoryOutlined />,
  logout: <LogoutOutlined />,
  account: <UserOutlined />,
  settings: <SettingOutlined />,
  billing: <WalletOutlined />,
  support: <QuestionCircleOutlined />,
  addPatient: <UserAddOutlined />,
  visitForm: <FileAddOutlined />,
  learnTheApp: <ReadOutlined />,
  delete: <MinusCircleOutlined />,
  edit: <EditOutlined />,
};

export const calendarSelector: Record<string, React.ReactNode> = {
  day: <DayCalendar />,
  week: <WeekCalendar />,
};

export const visitCheckoutForm = (
  key: UserSpecialtyType | string,
  data: unknown
) => {
  const visitCheckoutForms: UserSpecialtyContent = {
    dentist: <DentistVisitCheckoutForm data={data} />,
  };

  return visitCheckoutForms[key];
};
