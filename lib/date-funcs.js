
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