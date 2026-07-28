import { RouteSectionProps, useLocation } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { getDashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function Information(props: RouteSectionProps) {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get dashboard schema context
  const { schema, setPath } = useDashboard();
  // update dashboard schema using dashboard path
  onMount(() => {
    setPath([dashboardPath.name, dashboardPath.menu]);
  });

  const children1 = () => {
    const s = schema();
    return Array.isArray(s) ? s.flatMap((item) => { return { name: item.name, text: item.text } }) : [];
  };

  return (
    <Show when={schema()}>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "information", text: "Information" }} children1={children1()} children2={[]} child1={dashboardPath.name} child2="" />
      <>
        {props.children}
      </>
    </Show>
  );
}
