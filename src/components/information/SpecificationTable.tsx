import { For } from "solid-js";

interface SpecificationTableProps {
  table: {
    title: string;
    rows: string[][];
  }[]
}

export default function SpecificationTable(props: SpecificationTableProps) {
  return (
    <div class="w-full flex flex-row flex-wrap">

      <For each={props.table}>{(item, i) =>
        <div class="w-full xs:px-1 py-1">
          <div class="w-full max-w-3xl xs:rounded-sm border border-slate-200 dark:border-slate-700">
            <div class="flex flex-row items-center bg-gray-100 dark:bg-gray-800">
              <div class="mx-3 my-1.5 flex flex-row items-center font-semibold">
                <span class="icon-list_square text-[1.5rem] align-middle"></span>
                <span class="ml-1.5 align-middle">{item.title}&nbsp;</span>
              </div>
            </div>
            <div class="w-full xs:px-4 pt-2 pb-3 bg-white dark:bg-gray-900 text-sm">
              <table class="w-full">
                <thead class="text-xs sm:text-sm wrap-break-word">
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="w-[34%] px-2 py-1.5 font-semibold">
                      <div class="flex flex-row items-center justify-left">&nbsp;</div>
                    </th>
                    <th class="w-[66%] px-2 py-1.5 font-semibold">
                      <div class="flex flex-row items-center justify-left">
                        <span>Spesifikasi</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="text-xs sm:text-sm">
                  <For each={item.rows}>{(row, i) =>
                    <tr class="even:bg-gray-50 border-b border-gray-100 dark:border-gray-700 dark:even:bg-gray-800">
                      <td class="flex items-center px-2 py-1 text-left">
                        <div class="icon-list_circle mr-1 text-[0.75rem] align-middle h-full"></div>
                        <div>{row[0]}&nbsp;</div>
                      </td>
                      <td class="px-2 py-1 text-left">{row[1]}&nbsp;</td>
                    </tr>
                  }</For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }</For>

    </div>
  );
}
