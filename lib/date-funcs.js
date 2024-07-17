
export function formatDate(date) {
// Create a new Date object
  let d = new Date(date);

  // Get the year, month, and day from the Date object
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  let day = String(d.getDate()).padStart(2, '0');

  // Construct the formatted date string
  return `${year}-${month}-${day}`;
}

export function humanReadableDate(dateString) {
  const date = new Date(dateString + 'T00:00:00Z');

  const pad = (num) => num.toString().padStart(2, '0');

  const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatTokens = {
      YYYY: date.getUTCFullYear(),
      MMMM: monthNames[date.getUTCMonth()],
      MM: pad(date.getUTCMonth() + 1),
      DD: pad(date.getUTCDate()),
      D: date.getUTCDate(), // non-padded day
      HH: pad(date.getUTCHours()),
      mm: pad(date.getUTCMinutes()),
      ss: pad(date.getUTCSeconds())
  };

  return 'MMMM D, YYYY'.replace(/YYYY|MMMM|MM|DD|D|HH|mm|ss/g, match => formatTokens[match]);
}