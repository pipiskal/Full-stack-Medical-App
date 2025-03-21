import { PrinterOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { dataContext } from '@/context/DataProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { visitCheckoutForm } from '@/modules/componentSelectors';
import { PatientType } from '@/types';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import PatientDataDisplay from '../PatientDataDisplay/PatientDataDisplay';
import s from './VisitFormModal.module.scss';

type VisitFormModalYpe = {
  isLoading: boolean;
  isModalOpen: boolean;
  isPrintMainAction?: boolean;
  modalData: unknown | null;
  selectedPatient: PatientType | null;

  onClearModalData?: () => void;
  onSaveClicked?: () => void;
};

const VisitFormModal = ({
  isLoading,
  isModalOpen,
  isPrintMainAction,
  modalData,
  selectedPatient,
  onClearModalData,
  onSaveClicked,
}: VisitFormModalYpe) => {
  const { translate } = useLanguageContext();
  const { user } = dataContext();

  const [hideButton, setHideButton] = useState<boolean>(false);

  const handlePrint = () => {
    // hide button to not print it
    setHideButton(true);

    // print
    setTimeout(() => {
      if (window) {
        window.print();
      }
    }, 200);

    // show button again
    setTimeout(() => {
      setHideButton(false);
    }, 1000);
  };

  return (
    <Modal
      isVisible={isModalOpen}
      title={translate(
        isPrintMainAction ? 'visit_form' : 'register_form_in_patients_history'
      )}
    >
      {!isPrintMainAction && (
        <div
          className={`${hideButton ? s.hide_buttons : ''} ${s.print_button}`}
        >
          <button onClick={handlePrint}>
            <PrinterOutlined />
          </button>
        </div>
      )}
      <div className={s.modal_wrapper}>
        <div className={`${s.modal_body} scrollbar`}>
          <div className={s.patient_date_wrapper}>
            {selectedPatient && (
              <PatientDataDisplay patientData={selectedPatient} isDisplayMode />
            )}
          </div>
          <div className={s.form_checkout_details}>
            {visitCheckoutForm(user.specialty, modalData)}
          </div>
        </div>

        <div
          className={`${hideButton ? s.hide_buttons : ''} ${s.buttons_wrapper}`}
        >
          {onClearModalData ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onClearModalData}
            >
              {translate('cancel')}
            </Button>
          ) : null}

          <Button
            type="button"
            isLoading={isLoading}
            onClick={isPrintMainAction ? handlePrint : onSaveClicked}
          >
            {translate(isPrintMainAction ? 'print' : 'save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VisitFormModal;
