import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import {
  dateIsDefined,
  formatDate,
  formatDateTime,
  formatDay,
  formatFromString,
  formatMonthString,
  formatTime,
  formatTimeWithLegend,
  formatToSlicedISOString,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  isToday,
  minutesBeforeNow,
} from '../date.utility';

const dateString = '2022-02-22T14:20:20.566Z';
const date = new Date(dateString);

describe('Date utility', () => {
  it('format date in the format DD/MM/YYYY', () => {
    const date = '2022-02-16T16:03:37.123Z';
    const dateFormatted = formatDate(date);
    expect(dateFormatted).toBe('16/02/2022');
  });

  it('format today date', () => {
    const date = new Date().toISOString();
    const dateFormatted = formatDate(date);
    expect(dateFormatted).toBe('Oggi');
  });

  it('format today date - no labelization', () => {
    const date = new Date();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const dateFormatted = formatDate(date.toISOString(), false);
    expect(dateFormatted).toBe(`${day}/${month}/${date.getFullYear()}`);
  });

  it('format date to sliced ISO string ', () => {
    const date = new Date('2022-02-16T16:03:37.123Z');
    const dateFormatted = formatToSlicedISOString(date);
    expect(dateFormatted).toBe('2022-02-16');
  });

  it('format dateTime as { date: DD/MM/YYYY, time: ore HH:MM }', () => {
    const date = '2022-02-16T16:03:37.123Z';
    const timeFormatted = formatDateTime(date);
    // the time will be localized to the locale of wherever the test is to be run,
    // therefore I must compare with the localized hour
    const label = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');

    const localizedHour = String(new Date(date).getHours()).padStart(2, '0');
    expect(timeFormatted).toEqual(`16/02/2022, ${label} ${localizedHour}:03`);
  });

  it('return month string, uppercase and truncated to the first three letters', () => {
    const month = formatMonthString(dateString);
    const expectedMonth = date
      .toLocaleString('default', { month: 'long' })
      .toUpperCase()
      .substring(0, 3);
    expect(month).toBe(expectedMonth);
  });

  it('return day', () => {
    const day = formatDay(dateString);
    const expectedDay = `0${date.getDate()}`.slice(-2);
    expect(day).toBe(expectedDay);
  });

  it('return time', () => {
    const time = formatTime(dateString);
    const expectedTime = `${date.getHours()}:${date.getMinutes()}`;
    expect(time).toBe(expectedTime);
  });

  it('return time with ore label', () => {
    const time = formatTimeWithLegend(dateString);
    const label = getLocalizedOrDefaultLabel('common', 'date-time.hour-of-day', 'ore');
    const expectedTime = `${label} ${date.getHours()}:${date.getMinutes()}`;
    expect(time).toBe(expectedTime);
  });

  it('date is defined - sound date', () => {
    expect(dateIsDefined(date)).toBeTruthy();
  });

  it('date is defined - wrong date', () => {
    const wrongDate = new Date('2022-99-99T14:20:20.566Z');
    expect(dateIsDefined(wrongDate)).toBeFalsy();
  });

  it('date is defined - no date', () => {
    expect(dateIsDefined(null)).toBeFalsy();
    expect(dateIsDefined(undefined)).toBeFalsy();
  });

  it('return end of the day', () => {
    const endOfDay = getEndOfDay(date);
    const expectedEndOfDay = new Date(date);
    expectedEndOfDay.setHours(23, 59, 59, 999);
    expect(endOfDay).toStrictEqual(expectedEndOfDay);
  });

  it('return start of the day', () => {
    const startOfDay = getStartOfDay(date);
    const expectedStartOfDay = new Date(date);
    expectedStartOfDay.setHours(0, 0, 0, 0);
    expect(startOfDay).toStrictEqual(expectedStartOfDay);
  });

  it('return date string with timezone', () => {
    const dateAtMidnight = new Date('2022-02-22T00:00:00.000');
    const dateFormatted = formatToTimezoneString(dateAtMidnight);
    const expectedDate = '2022-02-22T00:00:00.000Z';
    expect(dateFormatted).toBe(expectedDate);
  });

  it('return date minus the minutes before now', () => {
    const date = minutesBeforeNow(10);
    const now = new Date();
    // minutes
    const isPreviousDateMinutes = now.getMinutes() < 10;
    // hours
    const isPreviousDateHours = isPreviousDateMinutes && now.getHours() === 0;
    // day
    const isPreviousDateDay = isPreviousDateHours && now.getDate() === 1;
    // month
    const isPreviousDateMonth = isPreviousDateDay && now.getMonth() === 1;
    // year
    expect(date.getFullYear()).toBe(
      isPreviousDateMonth ? now.getFullYear() - 1 : now.getFullYear()
    );
    // month
    expect(date.getMonth()).toBe(
      isPreviousDateMonth ? 11 : isPreviousDateDay ? now.getMonth() - 1 : now.getMonth()
    );
    // day
    expect(date.getDate()).toBe(
      isPreviousDateDay ? 31 : isPreviousDateHours ? now.getDate() - 1 : now.getDate()
    );
    // hours
    expect(date.getHours()).toBe(
      isPreviousDateHours ? 23 : isPreviousDateMinutes ? now.getHours() - 1 : now.getHours()
    );
    // minutes
    expect(date.getMinutes()).toBe(
      isPreviousDateMinutes ? 60 + now.getMinutes() - 10 : now.getMinutes() - 10
    );
  });

  it('return a boolean value if the date is today', () => {
    const isTodayVerify = isToday(date);
    const isTodayVerifySecond = isToday(date);
    expect(isTodayVerify).toBe(isTodayVerifySecond);
  });

  it('return a Date istance from string', () => {
    const invalidDateString = 'abc';
    const invalidDate = formatFromString(invalidDateString);
    expect(invalidDate).toBeNull();
    const dateString = '23/07/2023';
    const date = formatFromString(dateString);
    expect(date).toBeInstanceOf(Date);
  });
});
