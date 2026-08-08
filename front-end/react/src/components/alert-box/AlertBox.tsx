import { useContext } from 'react';

import React from 'react';

import { AlertContext } from '../../contexts';

import './AlertBox.scss';

export const AlertBox = () => {
  const { alertMessage } = useContext(AlertContext);

  return <div className="alert-box slide-in">{alertMessage}</div>;
};

export default AlertBox;
