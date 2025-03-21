import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import React from 'react';

import Tooltip from '@/components/Tooltip/Tooltip';
import { useLanguageContext } from '@/context/LanguageProvider';

import s from './DateNavigator.module.scss';

type DateNavigatorPropsType = {
  onPreviousClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  onDoubleNextClick: () => void;
  onDoublePreviousClick: () => void;
};

const DateNavigator = ({
  onPreviousClick,
  onNextClick,
  onTodayClick,
  onDoubleNextClick,
  onDoublePreviousClick,
}: DateNavigatorPropsType) => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <Tooltip message={translate('previous_month')} type="date_navigator">
        <button
          onClick={onDoublePreviousClick}
          className={s.navigation_buttons}
        >
          <DoubleLeftOutlined />
        </button>
      </Tooltip>

      <Tooltip message={translate('previous_day')} type="date_navigator">
        <button onClick={onPreviousClick} className={s.navigation_buttons}>
          <LeftOutlined />
        </button>
      </Tooltip>

      <button onClick={onTodayClick} className={s.today_button}>
        {translate('today')}
      </button>

      <Tooltip message={translate('next_day')} type="date_navigator">
        <button onClick={onNextClick} className={s.navigation_buttons}>
          <RightOutlined />
        </button>
      </Tooltip>

      <Tooltip message={translate('next_month')} type="date_navigator">
        <button onClick={onDoubleNextClick} className={s.navigation_buttons}>
          <DoubleRightOutlined />
        </button>
      </Tooltip>
    </div>
  );
};

export default DateNavigator;
