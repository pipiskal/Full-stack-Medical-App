import React from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import s from './DeleteModal.module.scss';

type DeleteModalPropsType = {
  title: string;
  isModalOpen: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  setIsModalOpen: (value: boolean) => void;
  handleSelectedEventDelete?: () => void;
};

const DeleteModal = ({
  title,
  isModalOpen,
  isLoading,
  children,
  setIsModalOpen,
  handleSelectedEventDelete,
}: DeleteModalPropsType) => {
  const { translate } = useLanguageContext();
  return (
    <Modal isVisible={isModalOpen}>
      <div className={s.modal}>
        <div className={s.modal_description}>
          <p className={s.modal_title}>{title}</p>

          <div className={s.event_to_delete}>{children}</div>
        </div>
        <div className={s.modal_buttons}>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            {translate('cancel')}
          </Button>

          <Button
            onClick={() => {
              setIsModalOpen(false);
              handleSelectedEventDelete && handleSelectedEventDelete();
            }}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            {translate('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
