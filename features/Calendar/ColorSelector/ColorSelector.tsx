import React, { useEffect, useRef, useState } from 'react';

import useDropDownMenuBlur from '@/hooks/useDropDownMenuBlur';
import { CALENDAR_EVENT_COLORS } from '@/modules/constants';
import { EventColorType } from '@/types';

import s from './ColorSelector.module.scss';

type ColorSelectorPropsType = {
  initialColor: EventColorType;
  onColorChange: (color: EventColorType) => void;
};

const ColorSelector = ({
  initialColor,
  onColorChange,
}: ColorSelectorPropsType) => {
  const [selectedColor, setSelectedColor] =
    useState<EventColorType>(initialColor);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const { elementRef: colorMenuRef } = useDropDownMenuBlur({
    handleMenuClose: () => setIsDropdownVisible(false),
  });

  const handleColorChange = (color: EventColorType) => {
    setSelectedColor(color);
    setIsDropdownVisible(false);
    onColorChange(color);
  };

  return (
    <div className={s.wrapper} ref={colorMenuRef}>
      <select
        name="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value as EventColorType)}
        style={{
          display: 'none',
        }}
      >
        <option value={selectedColor} />
      </select>

      <div className={s.selector_wrapper}>
        <button
          type="button"
          className={s.main_display}
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <div className={s.main_title}>
            <span className={`${s[selectedColor]} ${s.selected_color}`} />
          </div>
          {isDropdownVisible ? (
            <div className={s.arrow_up} />
          ) : (
            <div className={s.arrow_down} />
          )}
        </button>

        {isDropdownVisible && (
          <div className={s.dropdown_wrapper}>
            {CALENDAR_EVENT_COLORS.map((color, i) => (
              <button
                type="button"
                key={color}
                className={s[color]}
                onClick={() => handleColorChange(color as EventColorType)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSelector;
