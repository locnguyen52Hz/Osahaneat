export function createScrollIdleHandler(callback, delay = 500) {
  let timeoutId = null;

  const handler = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback();
    }, delay);
  };

  handler.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return handler;
}
