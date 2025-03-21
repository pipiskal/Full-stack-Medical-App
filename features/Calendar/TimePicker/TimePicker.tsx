import { useEffect, useRef, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { DAY_ZONE, HOURS, MINUTES } from '@/modules/constants';
import { toastMessage } from '@/modules/helpers';

import s from './TimePicker.module.scss';

type TimeType = {
  hours: string;
  minutes: string;
  dayZone: string;
};

const initialValues: TimeType = {
  hours: '',
  minutes: '',
  dayZone: '',
};

type TimePickerPropsType = {
  elementId: string;
  label: string;
  defaultValue?: TimeType | null;
  startingTime?: string;
  resetTimeInput?: boolean;
  onHandle?: (e: string) => void;
};

const initialValuesReset = () => {
  initialValues.hours = '';
  initialValues.minutes = '';
  initialValues.dayZone = '';
};

const isEndingTimeFalse = (startingTime: string, endingTime: string) => {
  let result = false;

  const startingTimeArray = startingTime.split(':');
  const startingHours = Number(startingTimeArray[0]);
  const startingMinutes = Number(startingTimeArray[1].split('-')[0]);
  const startingDayZone = startingTimeArray[1].split('-')[1];

  const endingTimeArray = endingTime.split(':');
  const endingHours = Number(endingTimeArray[0]);
  const endingMinutes = Number(endingTimeArray[1].split('-')[0]);
  const endingDayZone = endingTimeArray[1].split('-')[1];

  if (startingDayZone === 'pm' && endingDayZone === 'am') {
    result = true;
  }

  if (startingDayZone === endingDayZone) {
    if (startingHours > endingHours) {
      result = true;
    }

    if (startingHours === endingHours && startingMinutes > endingMinutes) {
      result = true;
    }

    if (startingHours === endingHours && startingMinutes === endingMinutes) {
      result = true;
    }
  }

  return result;
};

const TimePicker = ({
  elementId,
  defaultValue,
  label,
  startingTime,
  resetTimeInput,
  onHandle,
}: TimePickerPropsType) => {
  const { translate } = useLanguageContext();

  const [selectedTime, setSelectedTime] = useState<TimeType>(
    defaultValue || initialValues
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const timePickerRef = useRef<HTMLDivElement>(null);

  const formattedTime = `${selectedTime.hours}:${selectedTime.minutes}-${selectedTime.dayZone}`;
  const displayedTime = `${selectedTime.hours || '--'}:${
    selectedTime.minutes || '--'
  } ${translate(selectedTime.dayZone) || '--'}`;

  const isTimeSelected =
    selectedTime.hours !== '' &&
    selectedTime.minutes !== '' &&
    selectedTime.dayZone !== '';

  useEffect(() => {
    if (resetTimeInput) {
      initialValuesReset();
      setSelectedTime(initialValues);
    }
  }, [resetTimeInput]);

  const closeDropdownOnOutsideClick = (event: MouseEvent) => {
    if (
      timePickerRef.current &&
      !timePickerRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    };
  }, []);

  const handleDropDownPressed = () => {
    setSelectedTime(initialValues);
    onHandle?.('');

    setIsDropdownVisible(!isDropdownVisible);

    if (!isDropdownVisible && !isTimeSelected) {
      initialValuesReset();
    }
  };

  const resetInput = () => {
    initialValuesReset();
    setIsDropdownVisible(false);
    setSelectedTime(initialValues);
  };

  const handleTimeChange = (
    time: string,
    type: 'hours' | 'minutes' | 'dayZone'
  ) => {
    setSelectedTime((prevState) => ({
      ...prevState,
      [type]: time,
    }));

    initialValues[type] = time;

    if (startingTime) {
      const constructedTimeForCheck = `${initialValues.hours}:${initialValues.minutes}-${initialValues.dayZone}`;

      const endingTimeCheckResult = isEndingTimeFalse(
        startingTime,
        constructedTimeForCheck
      );

      if (endingTimeCheckResult) {
        resetInput();

        toastMessage(translate('time_selection_error'), 'error');
      }
    }

    if (startingTime?.length === 0 && selectedTime) {
      resetInput();

      toastMessage(translate('please_fill_starting_time'), 'error');
    }
    const isFullSelected = Object.values(initialValues).every(
      (value) => value !== ''
    );

    if (isFullSelected) {
      setIsDropdownVisible(false);

      onHandle?.(
        `${initialValues.hours}:${initialValues.minutes}-${initialValues.dayZone}`
      );

      initialValues.hours = '';
      initialValues.minutes = '';
      initialValues.dayZone = '';
    }
  };

  return (
    <div className={s.wrapper} ref={timePickerRef}>
      <label htmlFor={elementId}>
        {label}
        <span className={s.required_field}> *</span>
      </label>

      <select
        name={elementId}
        value={formattedTime}
        onChange={(e) => onHandle?.(e.target.value)}
        style={{
          display: 'none',
        }}
      >
        <option value={formattedTime} />
      </select>

      <div className={`${isDropdownVisible && s.active} ${s.selector_wrapper}`}>
        <button
          type="button"
          className={s.main_display}
          onClick={handleDropDownPressed}
        >
          <div className={s.main_title}>
            <span
              className={`${!isTimeSelected && s.inactive} ${s.selected_time}`}
            >
              {displayedTime}
            </span>
          </div>

          {isDropdownVisible ? (
            <div className={s.arrow_up} />
          ) : (
            <div className={s.arrow_down} />
          )}
        </button>

        {isDropdownVisible && (
          <div className={s.dropdown_wrapper}>
            <div className={s.dropdown_section}>
              {HOURS.map((hour) => (
                <button
                  type="button"
                  key={hour}
                  onClick={() => handleTimeChange(hour, 'hours')}
                  className={s.dropdown_button}
                >
                  {hour}
                </button>
              ))}
            </div>

            <div className={s.dropdown_section}>
              {MINUTES.map((minute) => (
                <button
                  type="button"
                  key={minute}
                  onClick={() => handleTimeChange(minute, 'minutes')}
                  className={s.dropdown_button}
                >
                  {minute}
                </button>
              ))}
            </div>

            <div className={s.dropdown_section}>
              {DAY_ZONE.map((zone) => (
                <button
                  type="button"
                  key={zone}
                  onClick={() => handleTimeChange(zone, 'dayZone')}
                  className={s.dropdown_button}
                >
                  {translate(zone)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
