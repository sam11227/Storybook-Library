export function getCurrentDateTimeLocalFormat() {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
export function formatDayOfWeek(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function formatLocalDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getAppliesToMessage(code) {
  const isHidden = code.revealHiddenTickets;
  const isAll = code.revealTicketIds === null;

  if (isHidden) {
    return isAll
      ? 'Applies to all hidden tickets'
      : 'Applies to only selected hidden tickets';
  } else {
    return isAll
      ? 'Applies to all visible tickets'
      : 'Applies to only selected visible tickets';
  }
}

/**
 * Format a date as 'Month Day, Year, HH:MM AM/PM' (e.g., 'April 22, 2025, 10:00 AM')
 * @param {string|Date} date
 * @returns {string}
 */
export function formatEventButtonLabel(date) {
  if (!date) return '';
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}