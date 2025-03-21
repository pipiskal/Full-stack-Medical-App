import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';

import s from './Modal.module.scss';

type ModalPropsType = {
  title?: string;
  children: React.ReactNode;
  isVisible: boolean;
  onClose?: () => void;
};

const Modal = ({ title, children, isVisible, onClose }: ModalPropsType) => {
  return isVisible ? (
    <div className={s.layout}>
      <div className={s.modal}>
        {(onClose || title) && (
          <div className={s.header}>
            {onClose && <span className={s.empty_space} />}

            {title && <h3>{title}</h3>}

            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className={s.close_button}
              >
                <CloseCircleOutlined />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
