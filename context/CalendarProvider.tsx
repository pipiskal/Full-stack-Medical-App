/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'react';
import useSWR, { mutate, preload } from 'swr';

import Error from '@/components/Error/Error';
import { requestClient } from '@/modules/request';
import { CalendarEventType } from '@/types';

type DataProviderPropsType = {
  children: React.ReactNode;
};

type UpdateEventTypes = 'add' | 'remove' | 'update';

type CalendarContextType = {
  eventsList: CalendarEventType[];
  isLoading: boolean;
  updateEventsList: (event: CalendarEventType, type: UpdateEventTypes) => void;
};

const defaultContextValues: CalendarContextType = {
  eventsList: [
    {
      _id: '',
      _v: 0,
      userId: '',
      date: new Date(),
      startingTime: '',
      endingTime: '',
      title: '',
      description: '',
      color: 'blue',
    },
  ],
  isLoading: false,
  updateEventsList: () => {}, // You can set an initial dummy function here
};

const AppContext = createContext(defaultContextValues);

preload('calendar', () => requestClient('calendar'));

const CalendarProvider = ({ children }: DataProviderPropsType) => {
  const { data: fetchedList, isLoading } = useSWR(
    'calendar',
    () => requestClient('calendar'),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const eventsList = fetchedList?.data || [];

  const updateEventsList = async (
    event: CalendarEventType,
    type: UpdateEventTypes
  ) => {
    if (type === 'add') {
      // Add the event to the local eventsList
      const updatedList = [...eventsList, event];
      // Update the eventsList in the local state
      mutate('calendar', { data: updatedList }, false);
      // Revalidate the SWR data
      // mutate('calendar');
    }

    if (type === 'remove') {
      // Remove the event from the local eventsList
      const updatedList = eventsList.filter(
        (item: CalendarEventType) => item._id !== event._id
      );
      // Update the eventsList in the local state
      mutate('calendar', { data: updatedList }, false);

      // Revalidate the SWR data
      // mutate('calendar');
    }

    if (type === 'update') {
      // Update the event in the local eventsList
      const updatedList = eventsList.map((item: CalendarEventType) =>
        item._id === event._id ? event : item
      );
      // Update the eventsList in the local state
      mutate('calendar', { data: updatedList }, false);

      // Revalidate the SWR data
      // mutate('calendar');
    }
  };

  return eventsList === null ? (
    <Error />
  ) : (
    <AppContext.Provider value={{ eventsList, updateEventsList, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

const useCalendarContext = () => {
  return useContext(AppContext);
};

export { CalendarProvider, useCalendarContext };
