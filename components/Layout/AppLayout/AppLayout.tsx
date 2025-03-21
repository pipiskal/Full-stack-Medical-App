import React, { useState } from 'react';

import Modal from '@/components/Modal/Modal';
import { DataProvider } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import AddPatientPage from '@/features/AddPatient.tsx/AddPatientPage';
import Calendar from '@/features/Calendar/Calendar';
import PatientHistory from '@/features/PatientHistory/PatientHistory';
import PatientsManagement from '@/features/PatientsManagement/PatientsManagement';
import VisitForm from '@/features/VisitForm/VisitForm';
import { userMenuContentSelector } from '@/modules/componentSelectors';
import { SelectedModalContentType } from '@/types';

import s from './AppLayout.module.scss';
import LayoutHeader from './Header/Header';
import LayoutSideMenu from './SideMenu/SideMenu';

const tabs: {
  [key: string]: React.ReactElement;
} = {
  add_patient: <AddPatientPage />,
  register_appointment: <Calendar />,
  patient_history: <PatientHistory />,
  patients_management: <PatientsManagement />,
  history_registration: <VisitForm />,
};

const AppLayout = () => {
  const [isLayoutVisible, setIsLayoutVisible] = useState<boolean>(true);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedModalContent, setSelectedModalContent] =
    useState<SelectedModalContentType>('account');
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>(
    'register_appointment'
  );
  const { translate } = useLanguageContext();

  const handleUserMenuClick = (content: SelectedModalContentType) => {
    setSelectedModalContent(content);
    setIsModalVisible(true);
    setIsUserMenuVisible(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <DataProvider>
      <div className={s.layout}>
        <LayoutSideMenu
          isOpen={isLayoutVisible}
          handleTabSelection={(tabName: string) => {
            setSelectedTab(tabName);
          }}
          activeTab={selectedTab as string}
        />

        <div
          className={`
        ${isLayoutVisible && s.layout_body_full}
        ${s.layout_body}`}
        >
          <LayoutHeader
            setIsUserMenuVisible={setIsUserMenuVisible}
            isUserMenuVisible={isUserMenuVisible}
            isLayoutVisible={isLayoutVisible}
            onChangeLayoutVisibility={() =>
              setIsLayoutVisible(!isLayoutVisible)
            }
            onChangeUserMenuVisibility={() =>
              setIsUserMenuVisible(!isUserMenuVisible)
            }
            onUserMenuClick={handleUserMenuClick}
          />

          <div
            className={`${!isLayoutVisible && s.layout_page_full} ${
              s.layout_page
            }`}
          >
            {tabs[selectedTab]}
          </div>
        </div>
      </div>

      <Modal
        title={translate(selectedModalContent)}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        {userMenuContentSelector(selectedModalContent, handleModalClose)}
      </Modal>
    </DataProvider>
  );
};

export default AppLayout;
