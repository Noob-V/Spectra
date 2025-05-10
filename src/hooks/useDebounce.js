import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}; 

// This custom hook, `useDebounce`, delays the update of a value by a specified amount of time (delay).
// It is useful for optimizing performance in scenarios like search inputs, where frequent updates can be expensive.
// The hook sets a timeout to update the `debouncedValue` after the delay, and clears the timeout if the value or delay changes.
// Returns the debounced value, which only updates after the specified delay.