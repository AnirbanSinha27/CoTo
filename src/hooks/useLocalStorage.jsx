import { useEffect, useState } from 'react';

const PREFIX = 'coto-';

const useLocalStorage = (key, initialValue) => {
  const prefixedKey = PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const jsonValue = localStorage.getItem(prefixedKey);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      if (typeof initialValue === 'function') {
        return initialValue();
      } else {
        return initialValue;
      }
    } catch (error) {
      console.error("Error parsing JSON from localStorage for key:", key, error);
      return initialValue; // Fallback to initialValue on error
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error("Error storing value to localStorage for key:", key, error);
    }
  }, [prefixedKey, value]);

  return [value, setValue];
};

export default useLocalStorage;
