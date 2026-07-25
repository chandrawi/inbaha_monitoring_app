import { Title } from "@solidjs/meta";
import { RouteSectionProps } from "@solidjs/router";
import NavbarIndex from "~/components/navigation/NavbarIndex";
import { darkTheme } from "~/lib/store";

export default function Home(props: RouteSectionProps) {
  return (
    <>
      <Title>Home</Title>
      <div classList={{ dark: darkTheme() }} class="h-screen overflow-hidden">
        <NavbarIndex />
        <div class="min-h-[calc(100vh-3.5rem)] mt-14 bg-slate-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 overflow-auto scrollbar-custom">
          {props.children}
        </div>
      </div>
    </>
  );
}
