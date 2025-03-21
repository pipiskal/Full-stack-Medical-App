// SETTINGS
// Objects for mapping ex.routes blacklist

export const SUPPORTED_LANGUAGES = ['en', 'el'];

export const SPECIALTIES = ['dentist'];

export const JWT_ACCESS_TOKEN_NAME = 'jwtAccessToken';
export const JWT_REFRESH_TOKEN_NAME = 'jwtRefreshToken';
export const ACCESS_TOKEN_EXPIRATION_TIME_TEXT = '15min';
export const REFRESH_TOKEN_EXPIRATION_TIME_TEXT = '7d';

export const PAYMENT_PLANS = ['free', 'monthly', 'yearly'];

export const CALENDAR_EVENT_COLORS = ['blue', 'red', 'green'];

export const FORMS_IDS: { [key: string]: string } = {
  dentist: 'dentist_form',
};

export const HOURS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

export const MINUTES = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
];

export const DAY_ZONE = ['am', 'pm'];

export const SIDE_MENU_TABS = [
  {
    sectionName: '',
    menuItems: [
      {
        displayedName: 'register_appointment',
        iconName: 'registerAppointment',
      },
      {
        displayedName: 'history_registration',
        iconName: 'visitForm',
      },
      {
        displayedName: 'patient_history',
        iconName: 'history',
      },
      {
        displayedName: 'add_patient',
        iconName: 'addPatient',
      },
      {
        displayedName: 'patients_management',
        iconName: 'patientsManagement',
      },
    ],
  },
];

export const USER_MENU = [
  {
    displayedName: 'account',
    iconName: 'account',
    isDisabled: false,
  },
  {
    displayedName: 'settings',
    iconName: 'settings',
    isDisabled: true,
  },
  {
    displayedName: 'billing',
    iconName: 'billing',
    isDisabled: true,
  },
  {
    displayedName: 'learn_the_app',
    iconName: 'learnTheApp',
    isDisabled: true,
  },
  {
    displayedName: 'support',
    iconName: 'support',
    isDisabled: true,
  },
];

export const DENTIST_FORM_DATA = {
  FULL_MOUTH_DATA: ['cleaning', 'whitening'],
  TEETH_DATA: [
    'filling',
    'crown',
    'bridge',
    'implant',
    'root_canal',
    'extraction',
  ],
};
