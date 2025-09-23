type Month = {
  value: string;
  name: string;
  id: number;
};

type Day = {
  value: string;
  id: number;
};

const monthArray: Month[] = [
  { value: 'Jan', name: 'January', id: 0 },
  { value: 'Feb', name: 'February', id: 1 },
  { value: 'Mar', name: 'March', id: 2 },
  { value: 'Apr', name: 'April', id: 3 },
  { value: 'May', name: 'May', id: 4 },
  { value: 'Jun', name: 'Jun', id: 5 },
  { value: 'Jul', name: 'July', id: 6 },
  { value: 'Aug', name: 'August', id: 7 },
  { value: 'Sep', name: 'September', id: 8 },
  { value: 'Oct', name: 'October', id: 9 },
  { value: 'Nov', name: 'November', id: 10 },
  { value: 'Dec', name: 'December', id: 11 },
];

const monthname = (id: number): string => {
  const ext = monthArray.find((itm) => itm.id === id);
  return ext ? ext.name : '--';
};

const monthfind = (id: number): string | number => {
  const ext = monthArray.find((itm) => itm.id === id);
  return ext ? ext.value : 0;
};

const getWeekDate = (date: Date = new Date(), week: number = 1): Date => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1);
  let value = week === 1 ? 1 : 7 * (week - 1);
  if (value > 30) value = 30;

  return new Date(`${d.getFullYear()}-${month}-${value}`);
};

const stringToDate = (p: string | Date): Date | '' => {
  const date = datetostring(p);
  if (date) {
    const parts = date.split('-').map((itm) => Number(itm));
    return p ? new Date(parts[0], parts[1] - 1, parts[2]) : '';
  }
  return '';
};

const date = (p: string | Date, pipe: 'dd/mm/yyyy' | 'mm/yyyy' = 'dd/mm/yyyy'): string => {
  if (!p) return '';
  const d = stringToDate(p);
  if (d instanceof Date && isNaN(d.getTime())) return '';

  if (!(d instanceof Date)) return '';

  let value = `${d.getDate()} ${monthfind(d.getMonth())} ${d.getFullYear()}`;
  if (pipe === 'mm/yyyy') value = `${monthfind(d.getMonth())} ${d.getFullYear()}`;
  return value;
};

const utcToDate = (utcString: string): string => {
  if (!utcString) return '';
  const date = new Date(utcString);
  if (isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
};

const daysArray: Day[] = [
  { value: 'Monday', id: 1 },
  { value: 'Tuesday', id: 2 },
  { value: 'Wednesday', id: 3 },
  { value: 'Thursday', id: 4 },
  { value: 'Friday', id: 5 },
  { value: 'Saturday', id: 6 },
  { value: 'Sunday', id: 0 },
];

const getDayName = (id: number): string => {
  const day = daysArray.find((itm) => itm.id === id);
  return day ? day.value : '';
};

const day = (p: string | Date): string => {
  if (!p) return '';
  const d = new Date(p);
  return getDayName(d.getDay());
};

const time = (p: string): string => {
  if (!p) return '';
  const v = p.split('T');
  if (v.length === 2) {
    return new Date(p).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  } else {
    return new Date(`2020-07-19 ${p}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
};

const datetime = (p: string): string => {
  return `${date(p)}, ${time(p)}`;
};

const timeString = (p: string | Date): string => {
  const d = new Date(p);
  const hr = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hr}:${minutes}:00`;
};

const datetostring = (p: string | Date): string => {
  if (!p) return '';

  if (p instanceof Date) {
    const year = p.getFullYear();
    const month = String(p.getMonth() + 1).padStart(2, '0');
    const day = String(p.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (typeof p === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p)) {
    if (p === 'Invalid Date') return '';
    return p.replace('.000Z', '');
  }

  const d = new Date(typeof p === 'string' ? p.replace('.000Z', '') : p);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const datetoIso = (p: string | Date): string => {
  if (!p) return '';
  const date = datetostring(p);
  return `${date}T00:00:00.000Z`;
};

const datetoIsotime = (p: string | Date): string => {
  const date = datetostring(p);
  const t = timeString(p);
  return `${date}T${t}.000Z`;
};

const isototime = (p: string): string => {
  if (!p) return '';
  return p.split('T')[1].split('.')[0];
};

const isotime = (p: string): string => {
  return time(isototime(p));
};

const isotodate = (p: string): Date => {
  return new Date(`${datetostring(p)} ${isototime(p)}`);
};

const datetodatepicker = (p: string): string => {
  let t = isototime(p);
  if (t) {
    t = t.split(':').join(':');
  }
  return `${datetostring(p)}T${t}`;
};

const DaysNo = (s: string | Date, e: string | Date): number => {
  const date1 = new Date(s);
  const date2 = new Date(e);
  const diff = date2.getTime() - date1.getTime();
  return diff / (1000 * 3600 * 24) + 1;
};

function getHoursAndMinutes(s: string | Date, e: string | Date): string {
  const startDate = new Date(s);
  const endDate = new Date(e);
  const diff = Math.abs(endDate.getTime() - startDate.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.round(hours / 24);
    return `${days} days`;
  } else if (hours) {
    return `${hours} hours${minutes ? ` and ${minutes} minutes` : ''}`;
  } else {
    return `${minutes ? `${minutes} minutes` : ''}`;
  }
}

function getHoursAndMinutesSeconds(s: string | Date, e: string | Date): string {
  const startDate = new Date(s);
  const endDate = new Date(e);
  const diff = Math.abs(endDate.getTime() - startDate.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.round(hours / 24);
    return `${days} days`;
  } else if (hours) {
    return `${hours} hours${minutes ? ` and ${minutes} minutes` : ''}`;
  } else if (minutes) {
    return `${minutes} minutes${seconds ? ` and ${seconds} seconds` : ''}`;
  } else {
    return `${seconds} seconds`;
  }
}

const addDays = (date: string | Date, days: number = 0): string => {
  const current = new Date(date);
  current.setDate(current.getDate() + days);
  current.setHours(0, 0, 0, 0);
  return datetoIsotime(current);
};

const addMinutes = (date: string | Date, time: number = 0): string => {
  const current = new Date(date);
  current.setMinutes(current.getMinutes() + time);
  return datetoIsotime(current);
};

function getYears(d1: string | Date = new Date(), d2: string | Date = new Date()): number {
  if (!d1 || !d2) return 0;
  let date1 = new Date(d1);
  let date2 = new Date(d2);
  if (date1 > date2) [date1, date2] = [date2, date1];

  let years = date2.getFullYear() - date1.getFullYear();
  if (date2.getMonth() < date1.getMonth() || (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())) {
    years--;
  }
  return years;
}

const datepipeModel:any = {
  utcToDate,
  DaysNo,
  addDays,
  getYears,
  addMinutes,
  date,
  getHoursAndMinutes,
  getHoursAndMinutesSeconds,
  stringToDate,
  day,
  datetostring,
  datetoIso,
  isototime,
  isotodate,
  isotime,
  datetoIsotime,
  time,
  timeString,
  datetime,
  monthfind,
  getWeekDate,
  monthname,
  monthArray,
  datetodatepicker,
};

export default datepipeModel;
