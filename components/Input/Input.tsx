import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { handleInputValidation } from '@/modules/helpers';
import { InputValidationType } from '@/types';

import s from './Input.module.scss';

type InputPropsType = {
  elementId?: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'textarea' | 'date';
  maxLength?: number;
  validationType?: InputValidationType;
  value?: string;
  isFieldMandatory?: boolean;
  onHandle?: ((e: string) => void) | null;
};

const Input = ({
  elementId,
  label,
  defaultValue,
  placeholder,
  type = 'text',
  maxLength,
  validationType,
  value,
  isFieldMandatory,
  onHandle,
}: InputPropsType) => {
  const { translate } = useLanguageContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isValidInput, setIsValidInput] = useState(true);

  const isPasswordInputVisible =
    type === 'text' || (type === 'password' && isPasswordVisible);

  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationType && e.target.value.length > 0) {
      const res = handleInputValidation(e, translate, validationType);

      if (res !== 'passed') {
        setIsValidInput(false);
      } else {
        setIsValidInput(true);
      }
    }
    if (validationType && e.target.value.length === 0) {
      setIsValidInput(true);
    }
  };

  return (
    <div className={s.form_element}>
      <label htmlFor={elementId}>
        {label}
        {isFieldMandatory && <span className={s.required_field}> *</span>}
      </label>

      <div className={s.input_wrapper}>
        {type !== 'textarea' ? (
          <input
            id={elementId}
            value={value}
            name={elementId}
            className={isValidInput ? '' : 'invalid_input'}
            onChange={(e) => onHandle?.(e.target.value.trim())}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              validationType ? handleValidation(e) : null
            }
            defaultValue={defaultValue}
            readOnly={!onHandle}
            type={isPasswordInputVisible ? 'text' : 'password'}
            placeholder={placeholder}
            maxLength={maxLength || undefined}
            onBlur={(e) =>
              validationType && e.target.value.length > 0
                ? handleInputValidation(e, translate, validationType)
                : null
            }
          />
        ) : (
          <textarea
            name={elementId}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => onHandle?.(e.target.value)}
            placeholder={placeholder}
            className="scrollbar"
            maxLength={maxLength || undefined}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            className={s.show_hide_password}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
