import Image from 'next/image';

import { useLanguageContext } from '@/context/LanguageProvider';
import { UploadFileType } from '@/types';

import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import s from './FilesModal.module.scss';

type FilesModalPropsType = {
  selectedFile: UploadFileType;
  isLoading: boolean;
  isImageLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const modalDisplay = (selectedFile: UploadFileType) => {
  let result = null;
  const type = selectedFile?.uploadFileType;

  if (type?.includes('image')) {
    result = (
      <div className={s.image_container}>
        <Image
          src={selectedFile?.data || ''}
          fill
          className={s.image}
          alt="file"
        />
      </div>
    );
  } else {
    result = (
      <iframe
        src={selectedFile?.data || ''}
        title="file"
        className={s.document}
      />
    );
  }

  return result;
};

const FilesModal = ({
  selectedFile,
  isLoading,
  isImageLoading,
  onClose,
  onDelete,
}: FilesModalPropsType) => {
  const { translate } = useLanguageContext();

  console.log('isImageLoading', isImageLoading);

  return (
    <Modal isVisible={Boolean(selectedFile)} title={selectedFile?.name}>
      <div className={s.modal_body}>
        {isImageLoading ? (
          <div className={s.loader_wrapper}>
            <Loader type="colorful" />
          </div>
        ) : (
          modalDisplay(selectedFile)
        )}

        <div className={s.buttons_wrapper}>
          <Button type="button" variant="secondary" onClick={onDelete}>
            {translate('delete')}
          </Button>

          <Button type="button" isLoading={isLoading} onClick={onClose}>
            {translate('close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilesModal;
