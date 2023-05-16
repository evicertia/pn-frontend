import {format} from "date-fns";
import {monthMap} from "../models/UsageEstimation";

export const localeStringReferenceMonth = (referenceMonth: string) => {
  const [month, year] = referenceMonth.split(/-/);
  const monthLocale = monthMap[month];

  return `${monthLocale} ${year}`;
};

export const getFormattedDateTime = (dataValue: string, pathHour:string="ore") : string=> {
  if(dataValue !== null) {
    return getUTCDate(dataValue, pathHour);
  } else {
    return "---------------------";
  }
};

export const getDateString = (dataValue: string): string  => {
  const date = new Date(dataValue);
  const formatString = "dd/MM/yyyy";
  return format(date, formatString);
};

function getUTCDate(dateString: string, pathHour:string="ore") {
  // dateString format will be YYYY-MM-DDTHH:mm:ss.000+00:00
  const [date, time] = dateString.split("T");
  const [onlyTime] = time.split(".");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = onlyTime.split(":");

  return day+"/"+month+"/"+year+", "+pathHour+" "+hours+":"+minutes;
}