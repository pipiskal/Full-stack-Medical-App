/* eslint-disable @typescript-eslint/no-explicit-any */

import DentistForm from '@/features/VisitForm/DentistForm/DentistForm';

import s from './DentistVisitCheckoutForm.module.scss';

type DentistCheckoutFormPropsType = {
  data: any;
};

const DentistVisitCheckoutForm = ({ data }: DentistCheckoutFormPropsType) => {
  return (
    <div className={s.wrapper}>
      <DentistForm isEditMode={false} initialValues={data} patientId="" />
    </div>
  );
};

export default DentistVisitCheckoutForm;
