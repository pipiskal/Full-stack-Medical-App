import React, { useEffect } from 'react';

import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import useDocument from '@/hooks/useDocument';
import { DAY_ZONE, HOURS, MINUTES } from '@/modules/constants';
import { CalendarEventType, EventModalType } from '@/types';

import s from './DailyPlanner.module.scss';

type DailyPlannerPropsType = {
  selectedDate: Date;
  events: CalendarEventType[];
  selectedEvent: CalendarEventType | null;
  tempEvent: CalendarEventType | null;
  setTempEvent: (event: CalendarEventType) => void;
  onEditEvent: () => void;
  setSelectedEvent: (event: CalendarEventType) => void;
  handleEventSelectionClick: (event: CalendarEventType) => void;
  onButtonClick: (eventType: EventModalType) => void;
};

const addPlusOneHour = (time: string) => {
  const timeArray = time.split(':');
  const hour = timeArray[0];
  const minute = timeArray[1];
  const newHour = Number(hour) + 1;
  return `${newHour}:${minute}`;
};

const getEventHeight = (event: CalendarEventType) => {
  const startingTime = event.startingTime.split(':');
  const endingTime = event.endingTime.split(':');
  const startingHour = Number(startingTime[0]);
  const endingHour = Number(endingTime[0]);
  const startingMinutes = Number(startingTime[1].split('-')[0]);
  const endingMinutes = Number(endingTime[1].split('-')[0]);
  const startingDayZone = startingTime[1].split('-')[1];
  const endingDayZone = endingTime[1].split('-')[1];

  const hourDifference =
    startingDayZone !== endingDayZone
      ? (12 + endingHour - startingHour) * 64
      : (endingHour - startingHour) * 64;

  const minuteDifference = ((endingMinutes - startingMinutes) / 5) * (64 / 12);

  return hourDifference + minuteDifference;
};

const DailyPlanner = ({
  selectedDate,
  events,
  selectedEvent,
  tempEvent,
  setTempEvent,
  setSelectedEvent,
  onEditEvent,
  handleEventSelectionClick,
  onButtonClick,
}: DailyPlannerPropsType) => {
  const { translate } = useLanguageContext();

  const { document } = useDocument();

  const day = selectedDate.getDate();

  const month = selectedDate
    .toLocaleString('default', { month: 'long' })
    .toLowerCase();

  const year = selectedDate.getFullYear();

  const dayName = selectedDate
    .toLocaleString('default', { weekday: 'long' })
    .toLowerCase();

  useEffect(() => {
    if (document && selectedEvent) {
      const top =
        document.getElementById(selectedEvent.startingTime)?.offsetTop || 0;

      document.getElementById('daily_planner')?.scrollTo({
        top: top - 100,
        behavior: 'smooth',
      });
    }

    if (document && !selectedEvent) {
      document.getElementById('daily_planner')?.scrollTo({
        top: 380,
        behavior: 'smooth',
      });
    }
  }, [selectedEvent, document]);

  useEffect(() => {
    if (document && selectedDate) {
      const dailyPlanner = document.getElementById('daily_planner');

      if (dailyPlanner) {
        dailyPlanner.scrollTo({
          top: 380,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedDate]);

  const calculateEventStyles = (event: CalendarEventType) => {
    if (document) {
      const top = document.getElementById(event.startingTime)?.offsetTop || 0;

      return {
        top: `${top}px`,
        height: `${getEventHeight(event)}px`,
      };
    }
  };

  const handleSubdivisionDoubleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const time = (e.currentTarget as HTMLDivElement).id || '';

    setSelectedEvent({
      startingTime: time,
      endingTime: addPlusOneHour(time),
      title: '',
      description: '',
      color: 'blue',
      date: selectedDate,
      _id: '',
      userId: '',
      _v: 0,
    });

    setTempEvent({
      startingTime: time,
      endingTime: addPlusOneHour(time),
      title: '',
      description: '',
      color: 'blue',
      date: selectedDate,
      _id: '',
      userId: '',
      _v: 0,
    });

    onEditEvent();
  };

  // const onDrop = (sourceId: string, targetId: string) => {
  //   const sourceEventIndex = events.findIndex(
  //     (event) => event.id.toString() === sourceId
  //   );

  //   const targetEventIndex = events.findIndex(
  //     (event) => event.id.toString() === targetId
  //   );

  //   if (sourceEventIndex === -1 || targetEventIndex === -1) {
  //     return;
  //   }

  //   const updatedEvents = [...events];
  //   const sourceEvent = updatedEvents[sourceEventIndex];
  //   updatedEvents[sourceEventIndex] = updatedEvents[targetEventIndex];
  //   updatedEvents[targetEventIndex] = sourceEvent;

  //   setEvents(updatedEvents);
  // };

  // const handleDragStart = (event, id: string) => {
  //   event.dataTransfer.setData('text/plain', id);
  //   // Set a custom image (optional - to show a preview while dragging)
  //   event.dataTransfer.setDragImage(event.target, 0, 0);
  // };

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  // const handleDrop = (event, targetId: string) => {
  //   event.preventDefault();
  //   const sourceId = event.dataTransfer.getData('text/plain');
  //   // Call the onDrop callback function to perform any specific actions with the dropped data
  //   onDrop(sourceId, targetId);
  // }

  return (
    <div className={s.wrapper}>
      <div className={s.date_details}>
        <div className={s.header}>
          <p className={s.full_date}>
            {day} <span className={s.month}>{translate(month)}</span>{' '}
            <span className={s.year}>{year}</span>
          </p>

          <Button
            variant="secondary"
            onClick={() => onButtonClick('new_event')}
          >
            {translate('new_event')}
          </Button>
        </div>
        <p className={s.day_name}>{translate(dayName)}</p>
      </div>

      <div className={`${s.events_wrapper} scrollbar`} id="daily_planner">
        {DAY_ZONE.map((timePoint) => (
          <div key={timePoint} className={s.events}>
            {HOURS.map((timeTable) => (
              <div
                key={`${timeTable}-${timePoint}`}
                className={s.time_point_wrapper}
              >
                <p className={s.time_display}>
                  {timeTable} {translate(timePoint)}
                </p>

                <div className={s.time_subdivisions}>
                  {MINUTES.map((minutesTable) => (
                    <div
                      key={`${timeTable}:${minutesTable}-${timePoint}`}
                      id={`${timeTable}:${minutesTable}-${timePoint}`}
                      className={s.subdivision}
                      onDoubleClick={(e) => handleSubdivisionDoubleClick(e)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div>
          {events &&
            events?.map((event) => {
              const styles = calculateEventStyles(event) || {};

              return (
                <button
                  key={event._id}
                  className={`${s[event.color]} ${
                    event._id === selectedEvent?._id && s.active_event
                  } ${s.event} }`}
                  style={styles && styles}
                  onClick={() => handleEventSelectionClick(event)}
                  // id={event.id.toString()}
                  // draggable="true"
                  // onDragStart={(e) => handleDragStart(e, event.id)}
                  // onDragOver={handleDragOver}
                  // onDrop={(e) => handleDrop(e, event.id)}
                >
                  <p className={s.timestamp}>
                    {event.startingTime.split('-')[0]}
                  </p>
                  <p className={s.event_title}>{event.title || ''}</p>
                </button>
              );
            })}

          {selectedEvent?.title === '' && tempEvent && (
            <div
              className={`${s[selectedEvent?.color]} ${s.event} ${
                s.active_event
              }`}
              style={{
                ...calculateEventStyles(tempEvent),
              }}
            >
              <p className={s.timestamp}>
                {selectedEvent.startingTime.split('-')[0]}
              </p>

              <p className={s.event_title}>{translate('new_event')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
