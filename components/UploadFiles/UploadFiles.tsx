/* eslint-disable @typescript-eslint/no-explicit-any */

import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';
import { toastMessage } from '@/modules/helpers';
import { UploadFileType } from '@/types';

import FilePreview from '../FilePreview/FilePreview';
import FilesModal from '../FilesModal/FilesModal';
import s from './UploadFiles.module.scss';

type UploadFilesPropsType = {
  filesToUpload: UploadFileType[];
  isActionInProgress?: boolean;
  onRemove: (file: UploadFileType) => void;
  onUpload: (file: any) => void;
  onPreviewFile: (file: UploadFileType) => Promise<string | undefined>;
};

const UploadFiles = ({
  filesToUpload,
  isActionInProgress = false,
  onPreviewFile,
  onRemove,
  onUpload,
}: UploadFilesPropsType) => {
  const { translate } = useLanguageContext();
  const [selectedFile, setSelectedFile] = useState<UploadFileType | null>(null);

  const handleFileUpload = () => {
    const file = document.getElementById('fileToUpload') as HTMLInputElement;
    file?.click();
  };

  const handleAddFile = () => {
    const file = document.getElementById('fileToUpload') as HTMLInputElement;
    const selectedFileToUpload = file?.files?.[0];

    const fileSizeInMB = selectedFileToUpload
      ? selectedFileToUpload?.size / 1024 / 1024
      : 0;

    if (fileSizeInMB > 3) {
      toastMessage(translate('file_too_big'), 'error');
      return;
    }

    if (selectedFileToUpload) {
      const type = selectedFileToUpload?.type;
      const name = selectedFileToUpload?.name.split('.')[0];
      const size = selectedFileToUpload?.size;

      const reader = new FileReader();
      reader?.readAsDataURL(selectedFileToUpload as Blob);

      const timestamp = Date.now();
      const timestampInSeconds = Math.floor(timestamp / 1000);

      reader.onload = () => {
        onUpload({
          uniqueId: `${timestampInSeconds}${reader.result
            ?.toString()
            .slice(reader.result.toString().length - 20)
            .replaceAll('/', '_')}`,
          name,
          uploadFileType: type,
          size,
          data: reader.result,
        });
      };
    }

    if (file) {
      file.value = '';
    }
  };

  useEffect(() => {
    if (selectedFile?.data === undefined && selectedFile !== null) {
      const previewFile = async () => {
        const fileData = await onPreviewFile(selectedFile);
        setSelectedFile({ ...selectedFile, data: fileData });
      };

      previewFile();
    }
  }, [selectedFile]);

  return (
    <section className={s.wrapper}>
      <input
        type="file"
        id="fileToUpload"
        onChange={handleAddFile}
        style={{ display: 'none' }}
        accept="image/*, .pdf"
      />

      <button
        onClick={handleFileUpload}
        className={s.upload_button}
        type="button"
      >
        <UploadOutlined />
        <span className={s.upload_text}>{translate('upload_file')}</span>
      </button>

      <div className={s.files_wrapper}>
        {filesToUpload?.map((file) => (
          <FilePreview
            key={file.uniqueId}
            type={file?.uploadFileType}
            name={file.name}
            onOpenModal={() => {
              setSelectedFile(file);
            }}
          />
        ))}
      </div>

      {selectedFile ? (
        <FilesModal
          selectedFile={selectedFile}
          isLoading={false}
          isImageLoading={isActionInProgress}
          onDelete={() => {
            onRemove(selectedFile);
            setSelectedFile(null);
          }}
          onClose={() => setSelectedFile(null)}
        />
      ) : null}
    </section>
  );
};

export default UploadFiles;
