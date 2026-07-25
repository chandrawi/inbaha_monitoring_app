import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import NavbarIndex from "~/components/navigation/NavbarIndex";
import { darkTheme } from "~/lib/store";

export default function NotFound() {
  return (
    <>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <div classList={{ dark: darkTheme() }} class="h-screen overflow-hidden">
        <NavbarIndex />
        <div class="min-h-[calc(100vh-3.5rem)] mt-14 bg-slate-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <div class="bg-white w-[40%] min-w-72 mb-14 rounded-sm shadow-md shadow-slate-300 dark:bg-gray-900 dark:shadow-slate-950">
            <div class="flex px-3 py-2 bg-gray-100 dark:bg-gray-800 border-x border-t border-slate-200 dark:border-slate-800">
              <span class="icon-cross text-[1.75rem] mr-2"></span>
              <span class="text-xl font-medium">Page Not Found</span>
            </div>
            <div class="flex justify-center py-5 text-xl">
              <a href="/" class="py-1.5 px-3 bg-sky-700 hover:bg-sky-800 rounded-sm">
                <span class="icon-home text-gray-100 hover:text-white mr-2"></span>
                <span class="text-gray-100 hover:text-white">Home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
