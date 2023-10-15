import React from 'react';

export const FilesUploader = ({ accept }: { accept: string }) => {
  return (
    <>
      <label htmlFor="image">Choose image for avatar to upload (PNG, JPG)</label>

      <button className="btn btn-secondary" type="button">
        Select file
      </button>

      <input accept={accept} className="d-none" id="image" name="image" type="file" />

      <div className="preview">
        <p>No file currently selected for upload</p>
      </div>
    </>
  );
};
