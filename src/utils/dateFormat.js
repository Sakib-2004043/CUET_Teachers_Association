export function formatDate(dateInput) {
  const date = new Date(dateInput); // Convert input to Date object if it's not already

  // List of month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get day, month, and year
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Return formatted date: day month year
  return `${day} ${month} ${year}`;
}
