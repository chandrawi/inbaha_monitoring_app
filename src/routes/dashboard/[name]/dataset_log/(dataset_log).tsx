import { useLocation } from "@solidjs/router";
import { Match, onMount, Show, Switch } from "solid-js";
import { DataLogSchema, DataLogViewSchema, DatasetLogViewSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import { useResource } from "~/context/ResourceContext";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";
import DataLogList from "~/components/data_log/DataLogList";
import DataLogView from "~/components/data_log/DataLogView";
import DataSetLogView from "~/components/data_log/DatasetLogView";

export default function DatasetLog() {
  // get dashboard path based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);
  // get resource and dashboard schema context
  const { resource, setName } = useResource();
  const { schema, path, setPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  onMount(() => {
    setName(dashboardPath.name);
    const p = path();
    if (p[0] != dashboardPath.name || p[1] != dashboardPath.menu) {
      setPath([dashboardPath.name, dashboardPath.menu]);
    }
  });

  const mode = () => {
    const s = schema() as DataLogSchema;
    return s?.mode;
  };

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

  const data_log = () => {
    const s = schema() as DataLogSchema;
    if (!s) return;
    const c = s.children as (DataLogViewSchema | DatasetLogViewSchema)[];
    if (Array.isArray(c)) return c[0];
  };

  return (
    <Show when={schema()}>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "dataset_log", text: "Data Set" }} children1={children1()} children2={children2()} child1={dashboardPath.submenu} child2={dashboardPath.item} />
      <Show when={mode() == "single"} fallback={
        <DataLogList path={dashboardPath} data_log={schema()! as DataLogSchema} />
      }>
        <Show when={resource() && data_log()}>
          <Switch>
            <Match when={data_log()!.component == "data_log_view"}>
              <DataLogView path={dashboardPath} resource={resource()!} data_log={data_log()! as DataLogViewSchema} />
            </Match>
            <Match when={data_log()!.component == "dataset_log_view"}>
              <DataSetLogView path={dashboardPath} resource={resource()!} data_log={data_log()! as DatasetLogViewSchema} />
            </Match>
          </Switch>
        </Show>
      </Show>
    </Show>
  );
}
