const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumerals(num) {
  return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
}

export function formatDuration(minutes) {
  return `${toArabicNumerals(minutes)} دقيقة`;
}

export function formatWeekSession(week, session) {
  return `الأسبوع ${toArabicNumerals(week)} - الفقرة ${toArabicNumerals(session)}`;
}
