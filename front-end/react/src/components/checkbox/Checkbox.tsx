import React, { ChangeEvent } from 'react';

import './Checkbox.scss';

export const Checkbox = ({
  change,
  checked = false,
  disabled = false,
  label,
  name
}: {
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
}) => (
  <label className="checkbox">
    <input
      onChange={(event: ChangeEvent<HTMLInputElement>) => change(event)}
      checked={checked}
      disabled={disabled}
      name={name}
      type="checkbox"
    />

    {label}
  </label>
);
