import React from 'react';

import './Button.scss';

export const Button = ({
  children,
  click,
  disabled = false,
  theme = 'primary'
}: {
  children: React.ReactNode;
  click: () => void;
  disabled?: boolean;
  theme: 'primary' | 'secondary';
}) => (
  <button onClick={click} className={theme} disabled={disabled} type="button">
    {children}
  </button>
);

export default Button;
