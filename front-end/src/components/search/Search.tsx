import React, { ChangeEvent } from 'react';

import './Search.scss';

export const Search = ({
  change,
  disabled = false,
  name,
  placeholder
}: {
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name: string;
  placeholder: string;
}) => (
  <input
    onChange={change}
    className="search"
    disabled={disabled}
    name={name}
    placeholder={placeholder}
    type="search"
  />
);
