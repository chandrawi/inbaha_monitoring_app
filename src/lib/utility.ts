import { DEFAULT_DASHBOARD, DEFAULT_MENU } from "./store";
import { DashboardPath } from "./definition";

export function getDashboardPath(pathname: string): DashboardPath {
  const s = pathname.split("/");
  const name = s[2] ? s[2] : DEFAULT_DASHBOARD;
  const menu = s[3] ? s[3] : DEFAULT_MENU;
  const submenu = s[4] ? s[4] : null;
  return { name: name, menu: menu, submenu: submenu };
}

function zeropad(input: string | number, num: number): string {
  let output: string = String(input);
  for (let i: number = output.length; i < num; i++) {
    output = "0" + output;
  }
  return output;
}

export function dateToString(datetime: Date): string {
  return (
    zeropad(datetime.getFullYear(), 4) + "-" +
    zeropad(datetime.getMonth() + 1, 2) + "-" +
    zeropad(datetime.getDate(), 2) + " " +
    zeropad(datetime.getHours(), 2) + ":" +
    zeropad(datetime.getMinutes(), 2) + ":" +
    zeropad(datetime.getSeconds(), 2)
  );
}

export function stringToDate(timestamp: string): Date {
  const splitDate: string[] = timestamp.split("-");
  const year: number = parseInt(splitDate[0], 10);
  const month: number = parseInt(splitDate[1], 10) - 1; // JS months are 0-indexed
  const date: number = parseInt(splitDate[2].substring(0, 2), 10);

  const splitTime: string[] = timestamp.split(":");
  const hour: number = parseInt(splitTime[0].substring(splitTime[0].length - 2), 10);
  const minute: number = parseInt(splitTime[1], 10);
  const second: number = parseInt(splitTime[2].substring(0, 2), 10);

  return new Date(year, month, date, hour, minute, second);
}
