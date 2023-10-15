import React from 'react';

export const PrimaryButton = ({ disabled = false, name }: { disabled: boolean; name: string }) => {
  return (
    <button className="btn btn-primary" disabled={disabled} type="button">
      {name}
    </button>
  );
};
