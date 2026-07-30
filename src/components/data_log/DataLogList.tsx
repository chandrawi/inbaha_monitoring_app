import { createSignal } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { DashboardPath, DataLogSchema } from "~/lib/definition";
import { DataTable, TableColumns, TableRowData } from "../table/DataTable";

interface DataLogListProps {
  path: DashboardPath;
  data_log: DataLogSchema;
};

interface DataLogList {
  name: string;
  text: string;
  icon: string;
  item: string;
};

export default function DataLogList(props: DataLogListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initViewMode = searchParams.view ? searchParams.view : "table";

  let [viewMode, setViewMode] = createSignal(initViewMode);

  const dataLogList = (): DataLogList[][] => {
    const list = [];
    if (Array.isArray(props.data_log.children)) {
      for (const data_log of props.data_log.children) {
        if ("devices" in data_log && (data_log.name == props.path.submenu || !props.path.submenu)) {
          list.push(data_log.devices.flatMap((item) => { return {
            name: data_log.name,
            text: data_log.text,
            icon: data_log.icon,
            item: item.name
          }}));
        }
        if ("sets" in data_log && (data_log.name == props.path.submenu || !props.path.submenu)) {
          list.push(data_log.sets.flatMap((item) => { return {
            name: data_log.name,
            text: data_log.text,
            icon: data_log.icon,
            item: item.name
          }}));
        }
      }
    }
    return list;
  };

  function columns(): TableColumns {
    return {
      type: { content: "Type", sortable: true, align: "left", html: true },
      name: { content: "Name", sortable: true, align: "left" },
      status: { content: "Status", sortable: true }
    };
  }

  const cell_type = (type: string, icon: string) => 
    <div class="flex items-center">
      <span class={icon + " text-[1.25rem] my-auto mr-1"}></span>
      <span>{type}</span>
    </div>
  ;

  function dataTable(): TableRowData[] {
    const dataTable = [];
    for (const items of dataLogList()) {
      for (const item of items) {
        const dataRow = {
          __link__: "/dashboard/" + [props.path.name, props.path.menu, item.name, item.item].join("/"),
          type: cell_type(item.text, item.icon),
          name: item.item
        };
        dataTable.push(dataRow);
      }
    }
    return dataTable;
  }

  function changeViewMode(mode: string) {
    setViewMode(mode);
    setSearchParams({
      view: mode
    });
  }

  return (
    <div class="w-full xs:px-1 py-1">
      <div class="w-full max-w-3xl xs:rounded-sm border border-slate-200 dark:border-slate-700">
        <div class="w-full flex flex-row items-center justify-between bg-gray-100 dark:bg-gray-800">
          <div class="mx-3 my-1.5 flex flex-row items-center font-semibold">
            <span class={(props.data_log.icon ? props.data_log.icon : "icon-list_square") + " text-[1.5rem] align-middle"}></span>
            <span class="ml-1.5 align-middle">{props.data_log.text}&nbsp;</span>
          </div>
          <div class="mx-3 my-auto flex flex-row text-sm">
            <button class={"px-2 py-0.5 text-gray-100 rounded-l-sm " 
              + (viewMode() == 'map' ? "bg-sky-700 cursor-default" : "bg-slate-500 hover:bg-sky-800 hover:text-white")}
              onclick={() => changeViewMode("map")}
            >
              Map
            </button>
            <button class={"px-2 py-0.5 text-gray-100 rounded-r-sm " 
              + (viewMode() == 'table' ? "bg-sky-700 cursor-default" : "bg-slate-500 hover:bg-sky-800 hover:text-white")}
              onclick={() => changeViewMode("table")}
            >
              Table
            </button>
          </div>
        </div>
        <div id="sensor-table" class="w-full xs:px-4 py-2 bg-white dark:bg-gray-900 text-sm">
          <DataTable columns={columns()} data={dataTable()} />
        </div>
      </div>
    </div>
  );
}
