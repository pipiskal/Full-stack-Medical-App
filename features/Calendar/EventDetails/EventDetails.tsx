import { useState } from 'react';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import HandleEventsButtons from '@/components/HandleEventsButtons/HandleEventsButtons';
import { useLanguageContext } from '@/context/LanguageProvider';
import { formatTimeToDisplay } from '@/modules/helpers';
import { CalendarEventType } from '@/types';

import s from './EventDetails.module.scss';

type EventDetailsPropsType = {
  isLoading: boolean;
  selectedEvent?: CalendarEventType | null;
  onNextEventClick: () => void;
  onPreviousEventClick: () => void;
  onEditClick: () => void;
  handleSelectedEventDelete: () => void;
};

const EventDetails = ({
  isLoading,
  selectedEvent,
  onNextEventClick,
  onPreviousEventClick,
  onEditClick,
  handleSelectedEventDelete,
}: EventDetailsPropsType) => {
  const { translate } = useLanguageContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const displayStartingTime = formatTimeToDisplay(
    selectedEvent ? selectedEvent.startingTime : '',
    translate
  );

  const displayEndingTime = formatTimeToDisplay(
    selectedEvent ? selectedEvent.endingTime : '',
    translate
  );

  return (
    <div className={`${selectedEvent && s.selected_event} ${s.wrapper}`}>
      {selectedEvent ? (
        <div className={s.event_details}>
          <p className={s.module_title}>{`${translate(
            'selected_appointment'
          )} :`}</p>
          <div className={s.header}>
            <p className={s.displayed_time}>
              {displayStartingTime} - {displayEndingTime}
            </p>

            <HandleEventsButtons
              onEditClick={onEditClick}
              setIsDeleteModalOpen={setIsModalOpen}
              onNextEventClick={onNextEventClick}
              onPreviousEventClick={onPreviousEventClick}
            />
          </div>

          <div className={s.title_wrapper}>
            <p className={s.description_title}>{`${translate('title')}`}</p>
            <p className={s.title}>{selectedEvent.title}</p>
          </div>

          {selectedEvent?.description && (
            <div>
              <p className={s.description_title}>
                {`${translate('description')}`}
              </p>

              <div className={`${s.description_Wrapper} scrollbar`}>
                <p className={s.description}>{selectedEvent.description}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className={s.no_event_selected}>{translate('no_event_selected')}</p>
      )}

      <DeleteModal
        title={translate('delete_event_confirmation')}
        isModalOpen={isModalOpen}
        isLoading={isLoading}
        setIsModalOpen={setIsModalOpen}
        handleSelectedEventDelete={handleSelectedEventDelete}
      >
        <>
          <p>{`${selectedEvent?.title}: `}</p>

          <p>
            {displayStartingTime} - {displayEndingTime}
          </p>
        </>
      </DeleteModal>
    </div>
  );
};

export default EventDetails;
