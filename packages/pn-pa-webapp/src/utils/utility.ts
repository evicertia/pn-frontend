import {format} from "date-fns";
import {monthMap} from "../models/UsageEstimation";


export const localeStringReferenceMonth = (referenceMonth: string) => {
  const [month, year] = referenceMonth.split(/-/);
  const monthLocale = monthMap[month];

  return `${monthLocale} ${year}`;
};

export const getFormattedDateTime = (dataValue: string, pathHour:string="ore") : string=> {
  const date = new Date(dataValue);
  const formatString = "dd/MM/yyyy, '"+pathHour+"' HH:mm";
  return format(date, formatString);
};