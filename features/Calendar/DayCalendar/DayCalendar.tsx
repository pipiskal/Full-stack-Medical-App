import { addDays, addMonths, subDays, subMonths } from 'date-fns';
import React, { useState } from 'react';

import Loader from '@/components/Loader/Loader';
import Modal from '@/components/Modal/Modal';
import { useCalendarContext } from '@/context/CalendarProvider';
import { useLanguageContext } from '@/context/LanguageProvider';
import { CALENDAR_EVENT_COLORS } from '@/modules/constants';
import {
  checkTitleValidity,
  compareDates,
  toastMessage,
} from '@/modules/helpers';
import { requestClient } from '@/modules/request';
import { CalendarEventType, EventColorType, EventModalType } from '@/types';
import { CalendarResponseEventType } from '@/typesApiResponses';

import MiniCalendar from '../../../components/MiniCalendar/MiniCalendar';
import DailyPlanner from '../DailyPlanner/DailyPlanner';
import DateNavigator from '../DateNavigator/DateNavigator';
import EventDetails from '../EventDetails/EventDetails';
import EventForm from '../EventForm/EventForm';
import s from './DayCalendar.module.scss';

const CURRENT_DATE = new Date();

const initialEvent: CalendarEventType = {
  startingTime: '',
  endingTime: '',
  title: '',
  description: '',
  color: CALENDAR_EVENT_COLORS[0] as EventColorType,
  date: new Date(),
  userId: '',
  _id: '',
  _v: 0,
};

const convertTimeToMinutes = (timeString: string) => {
  const [time, period] = timeString.split('-');
  const [hour, minute] = time.split(':').map(Number);
  let totalMinutes = hour * 60 + minute;
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    totalMinutes += 12 * 60;
  }
  return totalMinutes;
};

const sortDaysAppointments = (
  eventsList: CalendarEventType[],
  selectedDate: Date
) => {
  const selectedDayEventsList =
    eventsList &&
    eventsList?.filter((event) => compareDates(event.date, selectedDate));

  return (
    selectedDayEventsList &&
    selectedDayEventsList.sort((a, b) => {
      const aStartMinutes = convertTimeToMinutes(a.startingTime);
      const bStartMinutes = convertTimeToMinutes(b.startingTime);
      return aStartMinutes - bStartMinutes;
    })
  );
};

const DayCalendar = () => {
  const { translate } = useLanguageContext();

  const [selectedDate, setSelectedDate] = useState<Date>(CURRENT_DATE);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventType | null>(
    null
  );
  const [modalState, setModalState] = useState<EventModalType>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    eventsList,
    updateEventsList,
    isLoading: isListLoading,
  } = useCalendarContext();
  const [tempEvent, setTempEvent] = useState<CalendarEventType | null>(null);

  const sortedEventsList = sortDaysAppointments(eventsList, selectedDate);

  const isEventDetailsDisplayed =
    selectedEvent?.title !== '' ||
    selectedEvent?.description !== '' ||
    selectedEvent?.startingTime !== '';

  const handleEventSelectionClick = (event: CalendarEventType) => {
    if (event.startingTime !== '') {
      setSelectedEvent(event);
    }

    if (event.startingTime === selectedEvent?.startingTime) {
      setSelectedEvent(null);
    }
  };

  const handleSelectedEventDelete = async () => {
    setIsLoading(true);

    const response: CalendarResponseEventType = await requestClient(
      `calendar/${selectedEvent?._id}`,
      false,
      'DELETE'
    );

    if (response.success && response.data !== null) {
      updateEventsList(response.data, 'remove');

      setModalState('idle');

      setSelectedEvent(null);
    } else {
      toastMessage(translate('generic_error'), 'error');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any =
      modalState === 'update_event'
        ? {
            ...data,
            date: selectedDate,
          }
        : {
            ...data,
            date: selectedDate,
          };

    const payloadCheck =
      checkTitleValidity(payload.title) === 'passed' &&
      payload.startingTime !== '' &&
      payload.endingTime !== '';

    if (payloadCheck) {
      const response: CalendarResponseEventType = await requestClient(
        modalState === 'update_event'
          ? `calendar/${selectedEvent?._id}`
          : 'calendar',
        payload,
        modalState === 'update_event' ? 'PATCH' : 'POST'
      );

      if (response.success && response.data !== null) {
        updateEventsList(
          response.data,
          modalState === 'update_event' ? 'update' : 'add'
        );
      } else {
        toastMessage(translate('generic_error'), 'error');
      }

      if (response.data) {
        setSelectedEvent(response.data);
      }

      setModalState('idle');

      setTempEvent(null);
    }
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    if (tempEvent) {
      setSelectedEvent(null);
    }

    setModalState('idle');
    setTempEvent(null);
  };

  const handleEventNextAndPreviousClick = (direction: 'next' | 'previous') => {
    const selectedEventIndex = sortedEventsList.findIndex(
      (event) => event._id === selectedEvent?._id
    );

    if (
      selectedEventIndex >= 0 &&
      selectedEventIndex < sortedEventsList.length
    ) {
      const ascendIndex =
        selectedEventIndex === sortedEventsList.length - 1
          ? sortedEventsList.length - 1
          : selectedEventIndex + 1;

      const descendIndex =
        selectedEventIndex === 0 ? 0 : selectedEventIndex - 1;

      setSelectedEvent(
        sortedEventsList[direction === 'next' ? ascendIndex : descendIndex]
      );
    }
  };

  return isListLoading ? (
    <div className={s.loader_wrapper}>
      <Loader type="colorful" />
    </div>
  ) : (
    <div className={s.wrapper}>
      <div className={s.left_section}>
        <DailyPlanner
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          events={sortedEventsList}
          tempEvent={tempEvent}
          setTempEvent={setTempEvent}
          setSelectedEvent={setSelectedEvent}
          onEditEvent={() => setModalState('new_with_initial_data')}
          handleEventSelectionClick={handleEventSelectionClick}
          onButtonClick={(eventType: EventModalType) => {
            setSelectedEvent(null);
            setModalState(eventType);
          }}
        />
      </div>

      <div className={s.right_section}>
        <div className={s.calendar_wrapper}>
          <DateNavigator
            onTodayClick={() => setSelectedDate(CURRENT_DATE)}
            onPreviousClick={() => {
              setSelectedEvent(initialEvent);
              setSelectedDate((prev) => subDays(prev, 1));
            }}
            onNextClick={() => {
              setSelectedEvent(initialEvent);
              setSelectedDate((prev) => addDays(prev, 1));
            }}
            onDoublePreviousClick={() => {
              setSelectedEvent(initialEvent);
              setSelectedDate((prev) => subMonths(prev, 1));
            }}
            onDoubleNextClick={() => {
              setSelectedEvent(initialEvent);
              setSelectedDate((prev) => addMonths(prev, 1));
            }}
          />

          <MiniCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            clearSelectedEvent={() => setSelectedEvent(initialEvent)}
          />
        </div>

        <EventDetails
          isLoading={isLoading}
          onEditClick={() => setModalState('update_event')}
          onNextEventClick={() => handleEventNextAndPreviousClick('next')}
          onPreviousEventClick={() =>
            handleEventNextAndPreviousClick('previous')
          }
          handleSelectedEventDelete={handleSelectedEventDelete}
          selectedEvent={isEventDetailsDisplayed ? selectedEvent : null}
        />
      </div>

      <Modal
        isVisible={modalState !== 'idle'}
        title={translate(
          modalState === 'new_event' ? 'add_appointment' : 'edit_appointment'
        )}
      >
        <EventForm
          modalType={modalState}
          selectedDate={selectedDate}
          eventsList={eventsList}
          dataToUpdate={selectedEvent}
          isLoading={isLoading}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default DayCalendar;
