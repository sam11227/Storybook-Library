export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function truncateTitle(title, maxLength) {
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + "...";
  }
  return title;
}

export function convertToCustomDateFormat(isoString) {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const customDate = new Date(year, month, day);

  return customDate;
}
export function resize(node, callback) {
  const updateDimensions = () => {
    callback({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  updateDimensions();
  window.addEventListener('resize', updateDimensions);

  return {
    destroy() {
      window.removeEventListener('resize', updateDimensions);
    },
  };
}
