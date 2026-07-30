import { useLocation } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { InformationSchema, InformationSpecificationSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import { useDashboard } from "~/context/DashboardContext";
import SpecificationTable from "~/components/information/SpecificationTable";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function Information() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get dashboard schema context
  const { schema, path, setPath } = useDashboard();
  // update dashboard schema using dashboard path
  onMount(() => {
    const p = path();
    if (p[0] != dashboardPath.name || p[1] != dashboardPath.menu) {
      setPath([dashboardPath.name, dashboardPath.menu]);
    }
  });

  const children1 = () => {
    const s = schema() as InformationSchema;
    if (!s) return [];
    return Array.isArray(s.children) ? s.children.flatMap((item) => { return { name: item.name, text: item.text } }) : [];
  };
  const table = () => {
    const s = schema() as InformationSchema;
    if (!s) return [];
    const children = s.children as InformationSpecificationSchema[];
    return Array.isArray(children) ? children.find((item) => item.name == "specification")?.table : [];
  };

  return(
    <Show when={table()}>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "information", text: "Information" }} children1={children1()} children2={[]} child1={dashboardPath.submenu} child2="" />
      <SpecificationTable table={table()!} />
    </Show>
  );
}
