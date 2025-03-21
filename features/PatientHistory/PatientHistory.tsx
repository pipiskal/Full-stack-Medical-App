import { useState } from 'react';

import Button from '@/components/Button/Button';
import Error from '@/components/Error/Error';
import Loader from '@/components/Loader/Loader';
import NoPatientSelected from '@/components/NoPatientSelected/NoPatientSelected';
import PatientDataDisplay from '@/components/PatientDataDisplay/PatientDataDisplay';
import SearchBar from '@/components/SearchBar/SearchBar';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import { PatientType } from '@/types';
import { PatientDetailsResponseEventType } from '@/typesApiResponses';

import HistoryList from './HistoryList/HistoryList';
import s from './PatientHistory.module.scss';

const getMainDisplayContent = (
  selectedPatient: PatientType | null,
  isLoading: boolean,
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientType | null>>
) => {
  let content = null;

  if (!selectedPatient && !isLoading) {
    content = <NoPatientSelected hasRegisterPatientButton={false} />;
  }

  if (isLoading)
    content = (
      <div className={s.loader_wrapper}>
        <Loader type="colorful" />
      </div>
    );

  if (selectedPatient && !isLoading) {
    content = (
      <div className={`${s.history_wrapper} scrollbar`}>
        <HistoryList
          data={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
      </div>
    );
  }

  return content;
};

const PatientHistory = () => {
  const { translate } = useLanguageContext();
  const { patients: patientsList, isLoading: isAppDataLoading } = dataContext();
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePatientSelect = async (patient: PatientType) => {
    setIsLoading(true);

    const response: PatientDetailsResponseEventType = await requestClient(
      `patients/${patient?._id}?history=true`,
      false,
      'GET'
    );

    if (response.success && response.data !== null) {
      setSelectedPatient(response.data);
    } else {
      toastMessage(translate('generic_error'), 'error');
    }

    setIsLoading(false);
  };

  return isAppDataLoading ? (
    <div className={s.loader_wrapper}>
      <Loader type="colorful" />
    </div>
  ) : patientsList === null ? (
    <Error />
  ) : (
    <div className={s.wrapper}>
      <div className={s.left_column}>
        <SearchBar
          itemsList={patientsList}
          onSelectedItem={handlePatientSelect}
        />

        {getMainDisplayContent(selectedPatient, isLoading, setSelectedPatient)}
      </div>

      <div className={s.right_column}>
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
    </div>
  );
};

export default PatientHistory;
