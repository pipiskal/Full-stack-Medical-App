import Layout from '@/components/Layout/Layout';
import PatientForm from '@/components/PatientForm/PatientForm';
import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import s from '@/styles/pages/dashboard/add_patient.module.scss';
import { PatientType } from '@/types';

const initialPatientDetails: PatientType = {
  _id: '',
  amka: '',
  firstName: '',
  lastName: '',
  dob: '',
  phoneNumber: '',
  email: '',
  address: '',
  city: '',
  extraDetails: '',
};

const AddPatientPage = () => {
  const { translate } = useLanguageContext();
  const { patients, setPatients } = dataContext();

  const createNewPatient = async (patientDetails: Omit<PatientType, '_id'>) => {
    // TODO - Add typescript api response
    const { success, statusCode, data } = await requestClient(
      'patients',
      patientDetails,
      'POST'
    );

    if (success && statusCode === 201 && patients !== null) {
      setPatients([...patients, data]);
      toastMessage(translate('successful_patient_creation'), 'success');
      (document?.getElementById('patient_form') as HTMLFormElement).reset();
    }

    if (!success && statusCode && statusCode === 409) {
      toastMessage(translate('duplicate_patient'), 'error');
    }

    if (!success && statusCode && statusCode === (400 || 500)) {
      toastMessage(translate('something_went_wrong'), 'error');
    }
  };

  return (
    <div className={s.page_wrapper}>
      <PatientForm
        formType="createNewPatient"
        initialFormDetails={initialPatientDetails}
        onSubmit={(value) => createNewPatient(value)}
      />
    </div>
  );
};

AddPatientPage.getLayout = () => (
  <Layout type="dashboard">
    <AddPatientPage />
  </Layout>
);

export default AddPatientPage;
