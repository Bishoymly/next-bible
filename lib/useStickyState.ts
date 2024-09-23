import React from "react";

export default function useStickyState(key, defaultValue) {
  const [value, setValue] = React.useState(defaultValue);

  const setStickyValue = (value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    setValue(value);
  };

  React.useEffect(() => {
    const stickyValue = window.localStorage.getItem(key);
    const valueToUpdate = stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    if (valueToUpdate !== value) {
      setValue(valueToUpdate);
    }
  }, []);

  return [value, setStickyValue];
}
