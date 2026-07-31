import { useLocation } from "@solidjs/router";
import { DEFAULT_DASHBOARD, DEFAULT_MENU } from "./store";
import { DashboardPath, DataLogSchema, InformationSchema } from "./definition";

export function dashboardPath(): DashboardPath {
  const location = useLocation();
  const s = location.pathname.split("/");
  const name = s[2] ? s[2] : DEFAULT_DASHBOARD;
  const menu = s[3] ? s[3] : DEFAULT_MENU;
  const submenu = s[4] ? s[4] : "";
  const item = s[5] ? s[5] : "";
  return { name: name, menu: menu, submenu: submenu, item: item };
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

export function rangeName(range: number) {
  if (range < 60000) return String(range / 1000) + " seconds";
  else if(range == 60000) return "1 minute";
  else if(range < 3600000) return String(range / 60000) + " minutes";
  else if(range == 3600000) return "1 hour";
  else if(range < 86400000) return String(range / 3600000) + " hours";
  else if(range == 86400000) return "1 day";
  else return String(range / 86400000) + " day(s)";
}

export function breadcrumbInformation(s?: InformationSchema) {
  if (!s) return undefined;
  const children1 = [];
  if (Array.isArray(s.children)) {
    for (const item1 of s.children) {
      children1.push({
        name: item1.name,
        text: item1.text
      });
    }
  }
  return {
    name: s.name,
    text: s.text,
    children: children1
  };
}

export function breadcrumbDataLog(s?: DataLogSchema) {
  if (!s) return undefined;
  const children1 = [];
  if (Array.isArray(s.children)) {
    for (const item1 of s.children) {
      let subItems: { name: string; }[] = [];
      if ("devices" in item1 && Array.isArray(item1.devices)) {
        subItems = item1.devices;
      } else if ("sets" in item1 && Array.isArray(item1.sets)) {
        subItems = item1.sets;
      }
      const children2 = [];
      for (const childItem of subItems) {
        children2.push({
          name: childItem.name,
          text: childItem.name
        });
      }
      children1.push({
        name: item1.name,
        text: item1.text,
        children: children2
      });
    }
  }
  return {
    name: s.name,
    text: s.text,
    children: children1
  };
}
