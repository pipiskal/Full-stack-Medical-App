import React from 'react';

import s from './Tooltip.module.scss';

type TooltipPropsType = {
  type: 'event_details' | 'date_navigator';
  message: string;
  children: React.ReactNode;
};

const Tooltip = ({ message, children, type }: TooltipPropsType) => {
  return (
    <div className={s.tooltip_wrapper}>
      {children}
      <div className={`${s.tooltip} ${s[type]}`}>
        <p className={s.message}>{message}</p>
      </div>
    </div>
  );
};

export default Tooltip;
