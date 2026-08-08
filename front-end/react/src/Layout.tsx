import React, { useCallback, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AlertBox } from './components';
import { AlertContext } from './contexts';

const Layout = () => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const cleanMessage = useCallback(() => setAlertMessage(''), []);
  const close = useCallback(() => setShowAlert(false), []);
  const open = useCallback(() => setShowAlert(true), []);
  const writeMessage = useCallback((value: string) => setAlertMessage(value), []);

  const alertContextValue = useMemo(
    () => ({
      alertMessage,
      showAlert,
      cleanMessage,
      close,
      open,
      writeMessage
    }),
    [alertMessage, showAlert, cleanMessage, close, open, writeMessage]
  );

  return (
    <AlertContext.Provider value={alertContextValue}>
      <Outlet />

      {showAlert && <AlertBox />}
    </AlertContext.Provider>
  );
};

export default Layout;
