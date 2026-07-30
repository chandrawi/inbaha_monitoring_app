import { Show, For, createSignal } from "solid-js";

// Define shape of individual column configuration
export interface ColumnConfig {
  content: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  float_precission?: number;
  string_limit?: number;
  html?: boolean;
}

// Define the shape of columns mapping
export interface TableColumns {
  [key: string]: ColumnConfig;
}

// Define generic data row structure
export interface TableRowData {
  __link__?: string;
  [key: string]: any;
}

// Component Props interface
export interface DataTableProps {
  columns: TableColumns;
  data: TableRowData[];
}

export function DataTable(props: DataTableProps) {
  const [sortDirection, setSortDirection] = createSignal<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = createSignal<number>(0);
  const [pageCount, setPageCount] = createSignal<number>(1);
  const [rowPerPages, setRowPerPages] = createSignal<number>(20);
  const maxPagination = 10;

  // Create list of columns
  const columnList = () => Object.keys(props.columns);

  // Create list of sortable columns
  const sortableList = () => {
    const dict: Record<string, boolean> = {};
    for (const col in props.columns) {
      dict[col] = !!props.columns[col].sortable;
    }
    return dict;
  };

  // Create list of page numbers to show in pagination
  const pageList = () => {
    if (Array.isArray(props.data)) {
      setPageCount(Math.ceil(props.data.length / rowPerPages()));
      let start = 0;
      let end = pageCount();
      if (pageCount() > maxPagination) {
        if (currentPage() < (maxPagination / 2)) end = maxPagination;
        else if (currentPage() > (pageCount() - (maxPagination / 2))) start = pageCount() - maxPagination;
        else {
          start = currentPage() - (maxPagination / 2);
          end = currentPage() + 1 + (maxPagination / 2);
          end = end > pageCount() ? pageCount() : end;
        }
      }
      return Array.from({ length: end - start }, (_, i) => start + i);
    }
    return [];
  };

  // Sort and filter table data to be shown on the page
  const pageData = () => {
    if (!props.data) return [];
    const start = rowPerPages() * currentPage();
    const end = start + rowPerPages();
    let dataSorted = [...props.data];
    
    for (const col in sortDirection()) {
      dataSorted.sort((a, b) => {
        if (sortDirection()[col]) return a[col] < b[col] ? -1 : 1;
        return a[col] < b[col] ? 1 : -1;
      });
    }
    return dataSorted.slice(start, end);
  };

  // Switch to selected page of pagination
  const switchPage = (page: number) => setCurrentPage(page);

  // Change row per pages option
  const changeRowPerPages = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setRowPerPages(parseInt(formData.get('rowNum') as string, 10));
  };

  // Set sort direction ascending or descending of selected column
  const sortColumn = (column: string, direction: boolean) => {
    if (props.columns[column]?.sortable) {
      setSortDirection((value) => {
        if (value[column] === direction) {
          const { [column]: _, ...newValue } = value;
          return newValue;
        }
        return { ...value, [column]: direction };
      });
    }
  };

  // Format data value based on column configuration
  const dataValue = (value: any, column: string) => {
    const colConfig = props.columns[column];
    if (typeof colConfig.float_precission === "number" && typeof value === "number" && value % 1 !== 0) {
      return value.toFixed(colConfig.float_precission);
    } else if (typeof colConfig.string_limit === "number" && typeof value === "string") {
      return value.substring(0, colConfig.string_limit);
    }
    return value;
  };

  const align = (col: string) => {
    const alignment = props.columns[col].align;
    if (alignment === "left") return "justify-start";
    if (alignment === "right") return "justify-end";
    return "justify-center";
  };

  return (
    <>
      <table class="w-full">
        <thead class="text-xs sm:text-sm wrap-break-word">
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <For each={columnList()}>
              {(col) => (
                <th class="px-3 py-1.5 font-semibold">
                  <div class={`flex flex-row items-center ${align(col)}`}>
                    <span>{props.columns[col].content}</span>
                    <Show when={sortableList()[col]}>
                      <button type="button" class="flex flex-col ml-1 my-auto text-xs leading-none">
                        <span class={`icon-chevron_up ${sortDirection()[col] !== true ? " text-gray-300 dark:text-gray-700" : ""}`}
                          onClick={() => sortColumn(col, true)}
                        />
                        <span class={`icon-chevron_down ${sortDirection()[col] !== false ? " text-gray-300 dark:text-gray-700" : ""}`}
                          onClick={() => sortColumn(col, false)}
                        />
                      </button>
                    </Show>
                  </div>
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody class="text-xs sm:text-sm">
          <For each={pageData()}>
            {(row) => (
              <tr class={`even:bg-gray-50 border-b border-gray-100 dark:border-gray-700 dark:even:bg-gray-800 ${row.__link__ ? " hover:bg-sky-50 dark:hover:bg-sky-950 cursor-pointer" : ""}`}>
                <For each={columnList()}>
                  {(col) => (
                    <td class="px-2 py-1 text-left">
                      <Show when={props.columns[col].html} fallback={
                        <a href={row.__link__} class={`flex ${align(col)}`}>
                          {dataValue(row[col], col)}
                        </a>
                      }>
                        <a href={row.__link__}>
                          {row[col]}
                        </a>
                      </Show>
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <div class="w-full py-2 flex flex-row flex-wrap items-center justify-between">
        <form class="h-full my-1 flex flex-row flex-wrap" onSubmit={changeRowPerPages}>
          <div class="flex flex-row">
            <label for="input-row" class="px-1.5 py-0.5 rounded-l-sm bg-slate-200 dark:bg-slate-700">Rows</label>
            <select name="rowNum" class="px-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="ml-2 flex flex-row">
            <button type="submit" class="px-2 py-0.5 bg-sky-700 text-gray-100 hover:bg-sky-800 rounded-sm hover:text-white">Set</button>
          </div>
        </form>

        <div class="h-5 my-1 flex flex-row flex-wrap text-xs text-gray-50">
          <button type="button" onClick={() => switchPage(0)} class="flex flex-row items-stretch bg-slate-500 hover:bg-sky-800 mr-1">
            <span class="icon-arrow_fill_left text-base leading-none px-0.5 my-auto" />
          </button>
          <For each={pageList()}>
            {(page) => (
              <button type="button" onClick={() => switchPage(page)} class={`min-w-5 mx-px px-1 inline-block align-middle hover:bg-sky-800 ${page === currentPage() ? 'bg-sky-700' : 'bg-slate-500'}`}>
                {page + 1}
              </button>
            )}
          </For>
          <button type="button" onClick={() => switchPage(Math.max(0, pageCount() - 1))} class="flex flex-row bg-slate-500 hover:bg-sky-800 ml-1">
            <span class="icon-arrow_fill_right text-base leading-none px-0.5 my-auto" />
          </button>
        </div>
      </div>
    </>
  );
}
