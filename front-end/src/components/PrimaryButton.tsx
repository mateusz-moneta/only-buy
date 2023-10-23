import React from 'react';

export const PrimaryButton = ({
  click,
  disabled = false,
  name
}: {
  click: () => void;
  disabled?: boolean;
  name: string;
}) => {
  return (
    <button onClick={click} className="btn btn-primary" disabled={disabled} type="button">
      {name}
    </button>
  );
};
