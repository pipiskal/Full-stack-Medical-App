import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import s from './DropdownSelector.module.scss';

type DropdownSelectorPropsType = {
  options: string[];
  defaultSelection?: string;
  label?: string;
  defaultTitle?: string;
  isFieldMandatory?: boolean;
  onSelect: (option: string) => void;
};

const DropdownSelector = ({
  label,
  options,
  defaultSelection,
  defaultTitle,
  isFieldMandatory,
  onSelect,
}: DropdownSelectorPropsType) => {
  const { translate } = useLanguageContext();
  const [selectedOption, setSelectedOption] = useState(defaultSelection || '');

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div className={s.form_element}>
      <label htmlFor="dropdown-selector">
        {label}
        {isFieldMandatory && <span className={s.required_field}> *</span>}
      </label>

      <select
        value={selectedOption || defaultTitle}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="" className={s.default_title}>
          {defaultTitle}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {translate(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelector;
