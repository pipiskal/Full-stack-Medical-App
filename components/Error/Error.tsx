import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import Button from '../Button/Button';
import s from './Error.module.scss';

const Error = () => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <ExclamationCircleOutlined className={s.icon} />

      <p className={s.title}>{translate('something_went_wrong')}</p>

      <p className={s.description}>{translate('please_try_again')}</p>

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          if (window) {
            window.location.reload();
          }
        }}
      >
        {translate('refresh')}
      </Button>
    </div>
  );
};

export default Error;
