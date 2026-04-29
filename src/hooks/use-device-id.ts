import { useState, useEffect } from 'react';

export const getDeviceId = () => {
  let id = localStorage.getItem('vincere_device_id');
  if (!id) {
    // Generate a simple UUID-like string if randomUUID is not available
    id = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('vincere_device_id', id);
  }
  return id;
};

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string>(getDeviceId());

  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
  }, []);

  return deviceId;
};
