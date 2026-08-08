import React, { ChangeEvent } from 'react';

import './LabeledTextArea.scss';

export const LabeledTextArea = ({
  change,
  label,
  minLength,
  name,
  placeholder,
  required = false
}: {
  change: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  minLength?: number;
  name: string;
  placeholder: string;
  required: boolean;
}) => (
  <label className="labeled-text-area" htmlFor={name}>
    {label}
    <textarea
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => change(event)}
      minLength={minLength}
      name={name}
      placeholder={placeholder}
      required={required}
    ></textarea>
  </label>
);

export default LabeledTextArea;
