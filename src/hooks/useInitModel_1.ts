import { useState, useEffect } from 'react';

export const useInitModel = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [data, setData] = useState<T>(() => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData];
};
