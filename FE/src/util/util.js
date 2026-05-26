export function createScrollIdleHandler(callback, delay = 500) {
  let timeoutId = null;

  return () => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };
}
