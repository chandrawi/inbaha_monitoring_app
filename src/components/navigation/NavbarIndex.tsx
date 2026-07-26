import { Show, createSignal } from "solid-js";
import TitleMenuIndex from "./TitleMenuIndex";
import SearchMenu from "./SearchMenu";
import SettingMenu from "./SettingMenu";
import ProfileMenu from "./ProfileMenu";

export default function NavbarIndex() {

  const [searchExpand, setSearchExpand] = createSignal(false);

  return (
    <div class="fixed z-30 top-0 w-full h-14 flex flex-row bg-white dark:bg-slate-900 shadow-md-res shadow-slate-200 dark:shadow-slate-950 text-gray-800 dark:text-gray-200">
      <div class="lg:min-w-50 lg:w-[16%] xl:min-w-55 w-auto h-full flex flex-row justify-start lg:justify-center px-2 xs:px-3 md:px-4">
        <div class="h-full flex flex-row items-center">
          <img src="/image/logo_inbaha_min.png" alt="" class="h-9 ml-1 inline md:hidden" />
          <img src="/image/logo_inbaha.png" alt="" class="h-10 ml-1 hidden md:inline" />
        </div>
      </div>
      <div class="grow h-full flex flex-row justify-between">
        <div class="grow h-full flex flex-row justify-center md:justify-start">
          <Show when={!searchExpand()}>
            <TitleMenuIndex />
          </Show>
        </div>
        <div class="h-full flex flex-row">
          <SearchMenu searchExpand={searchExpand} setSearchExpand={setSearchExpand} />
          <SettingMenu />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
