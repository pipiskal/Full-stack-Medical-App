import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import useDropDownMenuBlur from '@/hooks/useDropDownMenuBlur';
import { SUPPORTED_LANGUAGES } from '@/modules/constants';
import {
  capitalizeFirstLetter,
  getFlag,
  getLanguageFullName,
} from '@/modules/helpers';
import { LanguageType } from '@/types';

import s from './LanguageSelector.module.scss';

const LanguageSelector = () => {
  const { language, switchLanguage } = useLanguageContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const { elementRef: dropdownMenuRef } = useDropDownMenuBlur({
    handleMenuClose: () => setIsDropdownVisible(false),
  });

  const handleChange = async (e: LanguageType) => {
    switchLanguage(e);
    setIsDropdownVisible(false);
  };

  return (
    <div className={s.selector_wrapper} ref={dropdownMenuRef}>
      <button
        className={s.main_display}
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <div className={s.main_title}>
          {getFlag(language)}
          <span>{capitalizeFirstLetter(language)}</span>
        </div>
        {isDropdownVisible ? (
          <div className={s.arrow_up} />
        ) : (
          <div className={s.arrow_down} />
        )}
      </button>

      {isDropdownVisible && (
        <div className={s.dropdown_wrapper}>
          {SUPPORTED_LANGUAGES.map((lang, i) => (
            <div key={lang}>
              <button
                className={s.dropdown_item}
                onClick={() => handleChange(lang as LanguageType)}
              >
                {getLanguageFullName(lang)}
              </button>
              {i !== SUPPORTED_LANGUAGES.length - 1 && (
                <div className={s.divider_line} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
