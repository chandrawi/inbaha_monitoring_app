import { useLocation } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { DataLogSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import { useResource } from "~/context/ResourceContext";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";
import DataLogList from "~/components/data_log/DataLogList";

export default function DataLog() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get resource and dashboard schema context
  const { setName } = useResource();
  const { schema, path, setPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  onMount(() => {
    setName(dashboardPath.name);
    const p = path();
    if (p[0] != dashboardPath.name || p[1] != dashboardPath.menu) {
      setPath([dashboardPath.name, dashboardPath.menu]);
    }
  });

  const children1 = () => {
    const s = schema() as DataLogSchema;
    if (!s) return[];
    return Array.isArray(s.children) ? s.children.flatMap((item) => { return { name: item.name, text: item.text } }) : [];
  };
  const children2 = () => {
    const s = schema() as DataLogSchema;
    if (!s) return[];
    if (Array.isArray(s.children)) {
      const v = s.children.find((item) => item.name == dashboardPath.submenu);
      if (!v) return [];
      if ("devices" in v) {
        return v ? v.devices?.flatMap((item) => { return { name: item.name, text: item.name, parent: v.name } }): [];
      }
      if ("sets" in v) {
        return v ? v.sets?.flatMap((item) => { return { name: item.name, text: item.name, parent: v.name } }): [];
      }
    }
    return [];
  };

  const dataLogs = () => {
    const s = schema() as DataLogSchema;
    if (!s) return[];
    return s.children;
  };

  return (
    <Show when={schema()}>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "data_log", text: "Data Log" }} children1={children1()} children2={children2()} child1={dashboardPath.submenu} child2={dashboardPath.item} />
      <DataLogList path={dashboardPath} data_logs={dataLogs()} />
    </Show>
  );
}
