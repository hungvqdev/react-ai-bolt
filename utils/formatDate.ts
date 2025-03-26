export function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const timePart = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
    const datePart = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  
    return `${timePart}, ${datePart}`;
  }