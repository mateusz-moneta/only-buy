import React, { ChangeEvent, useState } from 'react';

import { Button } from '../button/Button';

import './FilesUploader.scss';

export const FilesUploader = ({
  accept,
  change,
  chooseImageMessage = 'Choose image for avatar to upload (PNG, JPG)',
  emptyMessage = 'No file currently selected for upload',
  multiple = false,
  name,
  placeholder = 'Select file'
}: {
  accept: string;
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  chooseImageMessage?: string;
  emptyMessage?: string;
  multiple?: boolean;
  name: string;
  placeholder?: string;
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = React.createRef<HTMLInputElement>();

  return (
    <div className="files-uploader">
      <label className="files-uploader__choose-image-message" htmlFor="image">
        {chooseImageMessage}
      </label>

      <Button click={() => inputRef.current?.click()} theme="secondary">
        {placeholder}
      </Button>

      <input
        ref={inputRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          change(event);
          setFiles(event.target.files);
        }}
        accept={accept}
        className="d-none"
        multiple={multiple}
        name={name}
        type="file"
      />

      {files?.length ? (
        <div className="files-uploader__files">
          {Array.from(files).map((file: File) => (
            <img alt="" className="w-100" key={file.name} src={URL.createObjectURL(file)} />
          ))}
        </div>
      ) : (
        <div className="files-uploader__preview">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FilesUploader;
