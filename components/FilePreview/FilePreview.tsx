import React from 'react';

import s from './FilePreview.module.scss';

type FilePreviewPropsType = {
  type: string;
  name: string;
  onOpenModal: () => void;
};

const FilePreview = ({ type, name, onOpenModal }: FilePreviewPropsType) => {
  const clearType = type?.includes('image') ? 'Img' : 'Doc';

  return (
    <div>
      <button className={s.wrapper} onClick={onOpenModal}>
        <p className={s.title}>{clearType}</p>
      </button>

      <p className={s.name}>{name}</p>
    </div>
  );
};

export default FilePreview;
