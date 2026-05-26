export function getDaysInMonthUTC(month, year) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}

export function getDaysFromStartOfMonthToTodayUTC() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const today = now.getUTCDate();

  const days = [];

  for (let day = 1; day <= today; day++) {
    days.push(new Date(Date.UTC(year, month, day)));
  }

  return days;
}

export function getMonthsFromStartOfYearToNowUTC() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth(); // 0 → 11

  const months = [];

  for (let m = 0; m <= currentMonth; m++) {
    months.push(new Date(Date.UTC(year, m, 1)));
  }

  return months;
}

export function getStartOfMonthUTC() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0 → 11

  const firstDay = new Date(Date.UTC(year, month, 1));

  const yyyy = firstDay.getUTCFullYear();
  const mm = String(firstDay.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(firstDay.getUTCDate()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd}`;
}

export function getStartOfYearUTC() {
  const now = new Date();

  const year = now.getUTCFullYear();

  const firstDay = new Date(Date.UTC(year, 0, 1)); // tháng 0 = Jan

  const yyyy = firstDay.getUTCFullYear();
  const mm = String(firstDay.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(firstDay.getUTCDate()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd}`;
}
