export default function TitleMenuDashboard() {
  return (
    <div class="dropdown h-full static sm:relative">
      <div class="w-full h-full flex flex-row justify-center md:justify-start overflow-hidden break-all">
        <button class="group h-full flex flex-row items-center justify-center md:justify-start hover:text-sky-800 dark:hover:text-sky-300 overflow-hidden break-all">
          <span class="icon-dashboard text-[1.5rem] text-gray-500 group-hover:text-sky-950 dark:group-hover:text-sky-100"></span>
          <h1 class="h-full leading-14 ml-1 mr-0.5 xs:ml-2 xs:mr-1 font-medium text-lg sm:hidden">Dashboard</h1>
          <h1 class="h-full leading-14 ml-1 mr-0.5 xs:ml-2 xs:mr-1 font-medium text-lg hidden sm:inline">Dashboard Monitor</h1>
          <span class="icon-arrow_fill_down text-[1rem] text-sky-700"></span>
        </button>
      </div>
      <div class="w-full sm:w-auto flex flex-row absolute left-0 justify-center sm:justify-start wrap-break-word">
        <div class="dropdown-content w-80 bg-white shadow-md-res shadow-slate-200 rounded-b-sm dark:bg-gray-800 dark:shadow-slate-950">
          <a class="w-full px-2 py-1.5 flex flex-row items-center border-t border-slate-200 hover:text-sky-800 dark:border-slate-700 dark:hover:text-sky-300">
            <span class="icon-monitoring text-[1rem]"></span>
            <span class="ml-1.5">Monitoring System</span>
          </a>
          <a class="w-full px-2 py-1.5 flex flex-row items-center border-t border-slate-200 hover:text-sky-800 dark:border-slate-700 dark:hover:text-sky-300">
            <span class="icon-grid_view text-[1rem]"></span>
            <span class="ml-1.5">Category: </span>
          </a>
          <a class="w-full px-2 py-1.5 flex flex-row items-center border-t border-slate-200 hover:text-sky-800 dark:border-slate-700 dark:hover:text-sky-300">
            <span class="icon-globe text-[1rem]"></span>
            <span class="ml-1.5">Region: </span>
          </a>
        </div>
      </div>
    </div>
  );
}
