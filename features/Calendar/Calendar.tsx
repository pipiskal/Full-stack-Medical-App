import { CalendarProvider } from '@/context/CalendarProvider';

import DayCalendar from './DayCalendar/DayCalendar';

const Calendar = () => {
  return (
    <CalendarProvider>
      <DayCalendar />
    </CalendarProvider>
  );
};

export default Calendar;
