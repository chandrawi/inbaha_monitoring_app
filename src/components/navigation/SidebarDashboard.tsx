import { createResource, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { DashboardMenu } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import PageMenu from "./PageMenu";
import PortalMenu from "./PortalMenu";

export default function SidebarDashboard() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);

  // get menu schema of the dashboard
  const [dashboardMenu] = createResource<DashboardMenu[], string>(dashboardPath.name, async (name) => {
    const response = await fetch(`/schema/dashboard/${name}/menu.json`);
    return await response.json();
  });
  const menuSchema = () => dashboardMenu() === undefined ? [] : dashboardMenu();

  const menus = () => menuSchema()?.filter((menu) => menu.id == menu.parent_id);
  const submenus = () => menuSchema()?.filter((menu) => menu.id != menu.parent_id);
  const filterSubmenu = (parent_id: number) => {
    const subs = submenus();
    return subs ? subs.filter((submenu) => submenu.parent_id == parent_id) : [];
  };
  const isPortal = (menu: DashboardMenu) => {
    const split = String(menu.link).split("/");
    return split.length > 1 && split[1] !== "dashboard";
  };

  return (
    <div class="min-w-[max(250px,20vw)] h-[calc(100vh-3.5rem)] mt-14 pl-4 pr-2 py-3 bg-white dark:bg-slate-900 
      text-gray-800 dark:text-gray-200 border-r border-slate-100 dark:border-slate-800 overflow-auto scrollbar-custom"
    >
      <For each={menus()}>
      {(item) => (
        <Show when={isPortal(item)} fallback={
          <PageMenu menu={item} submenus={filterSubmenu(item.id)} />
        }>
          <PortalMenu menu={item} />
        </Show>
      )}
      </For>
    </div>
  );
}
