import { useState } from 'react';

import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';

import s from './SubmitVisitFormHead.module.scss';

type SubmitVisitFormHeadPropsType = {
  isActionButtonDisabled?: boolean;
  isReadOnly: boolean;
  defaultDate?: string | null;
  onCancel?: (() => void) | null;
  isLoading?: boolean;
  handleDateSelection: (value: string) => void;
};

const SubmitVisitFormHead = ({
  isActionButtonDisabled,
  isReadOnly,
  defaultDate,
  onCancel,
  isLoading,
  handleDateSelection,
}: SubmitVisitFormHeadPropsType) => {
  const { translate } = useLanguageContext();
  const [isDateValid, setIsDateValid] = useState(true);

  const handleDOBValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
  };

  const handleValidationOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setIsDateValid(false);
      toastMessage(translate('invalid_date_of_visit'), 'error');
    } else {
      setIsDateValid(true);
    }
  };

  return (
    <div className={s.button_wrapper}>
      <div className={s.date_selection_wrapper}>
        <label htmlFor="appointmentDate">
          {translate('appointments_date')}
        </label>

        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={defaultDate || ''}
          disabled={isReadOnly}
          className={`${isDateValid ? '' : 'invalid_input'}`}
          onChange={(e) => {
            handleDateSelection(e.target.value.trim());
            handleDOBValidation(e);
          }}
          onBlur={(e) => handleValidationOnBlur(e)}
        />
      </div>

      {!isReadOnly && (
        <div className={s.buttons_wrapper}>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {translate('cancel')}
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            isDisabled={isActionButtonDisabled}
            isLoading={isLoading}
          >
            {translate('register')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubmitVisitFormHead;
