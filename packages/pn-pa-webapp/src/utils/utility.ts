import {format} from "date-fns";
import {monthMap} from "../models/UsageEstimation";

export const localeStringReferenceId = (referenceId: string) => {
  if(referenceId.includes('-')) {
    const [month, year] = referenceId.split(/-/);
    const monthLocale = monthMap[month];
    return `${monthLocale} ${year}`;
  } else {
    return `${referenceId}`;
  }
};

export const getFormattedDateTime = (dataValue: string, pathHour:string="alle") : string=> {
  if(dataValue !== null && dataValue !== "" && dataValue.includes("T")) {
    return getUTCDateAndTime(dataValue, pathHour);
  } else {
    return "---------------------";
  }
};

export const getDateString = (dataValue: string): string  => {
  const date = new Date(dataValue);
  const formatString = "dd/MM/yyyy";
  return format(date, formatString);
};

function getUTCDateAndTime(dateString: string, pathHour:string="ore") {
  // dateString format will be YYYY-MM-DDTHH:mm:ss.000+00:00
  const [date, time] = dateString.split("T");
  const [onlyTime] = time.split(".");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = onlyTime.split(":");

  return day+"/"+month+"/"+year+", "+pathHour+" "+hours+":"+minutes;
}

export const getFormattedDateTimeAbstract = (dataValue: string, pathHour: string) : string => {
  if(dataValue !== null) {
    return getUTCDateTimeAndDate(dataValue, pathHour);
  } else {
    return "---------------------";
  }
};
function getUTCDateTimeAndDate(dateString: string, pathHour:string) {
  // dateString format will be YYYY-MM-DDTHH:mm:ss.000+00:00
  const [date, time] = dateString.split("T");
  const [onlyTime] = time.split(".");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = onlyTime.split(":");

  return hours+":"+minutes+" "+pathHour+" "+day+"/"+month+"/"+year;
}