import { Title } from "@solidjs/meta";
import { RouteSectionProps } from "@solidjs/router";
import NavbarDashboard from "~/components/navigation/NavbarDashboard";
import SidebarDashboard from "~/components/navigation/SidebarDashboard";
import { darkTheme } from "~/lib/store";

export default function Dashboard(props: RouteSectionProps) {
  return (
    <>
      <Title>Dashboard</Title>
      <div classList={{ dark: darkTheme() }} class="drawer md:drawer-open h-screen overflow-hidden">
        <input id="sidebar" type="checkbox" class="drawer-toggle" checked />
        <NavbarDashboard />
        <div class="drawer-content min-h-[calc(100vh-3.5rem)] mt-14 px-1.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 overflow-auto scrollbar-custom">
          {props.children}
        </div>
        <div class="drawer-side overflow-hidden">
          <label for="sidebar" aria-label="close sidebar" class="drawer-overlay bg-gray-500 opacity-30"></label>
          <SidebarDashboard />
        </div>
      </div>
    </>
  );
}
