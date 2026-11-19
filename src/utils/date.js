// Calendar dates from the API arrive as 'YYYY-MM-DD'. `new Date('YYYY-MM-DD')`
// parses them as UTC midnight, which shows the previous day in timezones west
// of UTC; parse them as local dates instead. Timestamps are left unchanged.
export const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
};

export const formatDate = (value, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  const d = toDate(value);
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('en-IN', options) : '—';
};

// Today's date as 'YYYY-MM-DD' in the user's time zone.
export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
