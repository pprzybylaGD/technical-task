export const throttle = (fn: Function, ms: number = 100) => {
  let wait = false;

  return function () {
    if (!wait) {
      fn();
      wait = true;
      setTimeout(function () {
        wait = false;
      }, ms);
    }
  };
};
