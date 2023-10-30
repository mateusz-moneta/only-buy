import React, { ChangeEvent } from 'react';

import './LabeledSelect.scss';

export const LabeledSelect = ({
  change,
  label,
  name
}: {
  change: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  name: string;
}) => (
  <label className="labeled-select" htmlFor={name}>
    {label}
    <select
      onChange={(event: ChangeEvent<HTMLSelectElement>) => change(event)}
      name={name}
    ></select>
  </label>
);

export default LabeledSelect;
