import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';

import { useLanguageContext } from '@/context/LanguageProvider';

import s from './MiniCalendar.module.scss';

type MiniCalendarPropsType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  clearSelectedEvent: () => void;
};

const DAY_LABELS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isSaturdayOrSunday = (date: Date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

const MiniCalendar = ({
  selectedDate,
  setSelectedDate,
  clearSelectedEvent,
}: MiniCalendarPropsType) => {
  const { translate } = useLanguageContext();

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  const renderDays = () => {
    const firstDayOfMonth =
      daysInMonth[0].getDay() === 0 ? 1 : daysInMonth[0].getDay();

    const previousMonthDays = new Array(firstDayOfMonth - 1);

    const daysWithContent = [...previousMonthDays, ...daysInMonth];

    return (
      <>
        {DAY_LABELS.map((label, index) => (
          <div key={index} className={`${s.day} ${s.day_label}`}>
            <p>{translate(`${label}_acro`)}</p>
          </div>
        ))}

        {daysWithContent.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, selectedDate);

          if (!day) {
            return (
              <p key={index} className={`${s.day} ${s.prev_next_month}`} />
            );
          }

          return (
            <button
              key={index}
              className={`
                ${s.day} 
                ${!isCurrentMonth && s.inactive}
                ${isSaturdayOrSunday(day) && s.weekend}
                ${isSameDay(day, selectedDate) && s.active}
                ${isToday(day) && s.current_date}
                  `}
              onClick={() => {
                clearSelectedEvent();

                setSelectedDate(
                  isCurrentMonth
                    ? day
                    : day > selectedDate
                    ? addMonths(selectedDate, 1)
                    : subMonths(selectedDate, 1)
                );
              }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </>
    );
  };

  return (
    <div className={s.calendar}>
      <div className={s.days}>{renderDays()}</div>
    </div>
  );
};

export default MiniCalendar;
