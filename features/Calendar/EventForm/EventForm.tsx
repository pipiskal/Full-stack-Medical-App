import React, { useState } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { useLanguageContext } from '@/context/LanguageProvider';
import { CALENDAR_EVENT_COLORS } from '@/modules/constants';
import {
  compareDates,
  destructureTimeToObj,
  toastMessage,
} from '@/modules/helpers';
import { CalendarEventType, EventColorType, EventModalType } from '@/types';

import ColorSelector from '../ColorSelector/ColorSelector';
import TimePicker from '../TimePicker/TimePicker';
import s from './EventForm.module.scss';

type EventFormPropsType = {
  dataToUpdate?: CalendarEventType | null;
  modalType: EventModalType;
  isLoading?: boolean;
  selectedDate: Date;
  eventsList?: CalendarEventType[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

const EventForm = ({
  dataToUpdate,
  modalType,
  selectedDate,
  eventsList,
  isLoading,
  onClose,
  onSubmit,
}: EventFormPropsType) => {
  const { translate } = useLanguageContext();

  const [title, setTitle] = useState<string>(
    dataToUpdate ? dataToUpdate.title : ''
  );
  const [startingTime, setStartingTime] = useState<string>(
    dataToUpdate ? dataToUpdate.startingTime : ''
  );
  const [endingTime, setEndingTime] = useState<string>(
    dataToUpdate ? dataToUpdate.endingTime : ''
  );

  const [color, setColor] = useState<EventColorType>(
    dataToUpdate
      ? dataToUpdate.color
      : (CALENDAR_EVENT_COLORS[0] as EventColorType)
  );

  const [description, setDescription] = useState<string>(
    dataToUpdate ? dataToUpdate.description : ''
  );

  const [resetInput, setResetInput] = useState<boolean>(false);

  const areDataChanged =
    dataToUpdate?.startingTime !== startingTime ||
    dataToUpdate?.endingTime !== endingTime ||
    dataToUpdate?.title !== title ||
    dataToUpdate?.description !== description ||
    dataToUpdate?.color !== color;

  const areDataNotFilled =
    title.length < 3 ||
    title.length > 50 ||
    destructureTimeToObj(startingTime).hours === '' ||
    destructureTimeToObj(startingTime).minutes === '' ||
    destructureTimeToObj(startingTime).dayZone === '' ||
    destructureTimeToObj(endingTime).hours === '' ||
    destructureTimeToObj(endingTime).minutes === '' ||
    destructureTimeToObj(endingTime).dayZone === '';

  const isUpdatable =
    dataToUpdate &&
    (modalType === 'update_event' || modalType === 'new_with_initial_data');

  const isSubmitDisabled =
    modalType === 'new_event'
      ? areDataNotFilled
      : !areDataChanged || areDataNotFilled;

  const handleStartingTimeChange = (e: string) => {
    const currentDateList = eventsList?.filter((event) =>
      compareDates(selectedDate, event.date)
    );
    const eventExists = currentDateList?.find(
      (event) => event.startingTime === e
    );

    if (eventExists && dataToUpdate?.startingTime !== e) {
      toastMessage(translate('event_exists'), 'warning');
      setResetInput(true);
    } else {
      setStartingTime(e);
      setResetInput(false);
    }

    if (endingTime !== '') {
      setResetInput(true);
      setEndingTime('');
    }
  };

  const handleEndingTimeChange = (e: string) => {
    setResetInput(false);
    setEndingTime(e);
  };

  return (
    <form onSubmit={onSubmit} className={s.form}>
      <div className={s.event_hours}>
        <TimePicker
          label={translate('starts')}
          defaultValue={
            isUpdatable ? destructureTimeToObj(dataToUpdate.startingTime) : null
          }
          resetTimeInput={resetInput}
          elementId="startingTime"
          onHandle={handleStartingTimeChange}
        />

        <TimePicker
          label={translate('ends')}
          defaultValue={
            isUpdatable ? destructureTimeToObj(dataToUpdate.endingTime) : null
          }
          elementId="endingTime"
          startingTime={startingTime}
          resetTimeInput={resetInput}
          onHandle={handleEndingTimeChange}
        />

        <ColorSelector
          onColorChange={(selectedColor) => setColor(selectedColor)}
          initialColor={isUpdatable ? dataToUpdate.color : color}
        />
      </div>

      <Input
        onHandle={setTitle}
        label={translate('title')}
        defaultValue={isUpdatable ? dataToUpdate.title : undefined}
        elementId="title"
        placeholder={translate('patients_name')}
        validationType="title"
        maxLength={50}
        isFieldMandatory
      />

      <Input
        label={translate('description')}
        defaultValue={isUpdatable ? dataToUpdate.description : undefined}
        elementId="description"
        type="textarea"
        placeholder={translate('appointment_description')}
        onHandle={setDescription}
      />

      <div className={s.buttons_wrapper}>
        <Button type="button" variant="secondary" onClick={onClose}>
          {translate('cancel')}
        </Button>

        <Button
          type="submit"
          isDisabled={isSubmitDisabled || isLoading}
          isLoading={isLoading}
        >
          {modalType === 'new_event' ? translate('add') : translate('save')}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
