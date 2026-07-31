import { onMount, Match, Show, Switch } from "solid-js";
import { DataLogSchema } from "~/lib/definition";
import { dashboardPath, breadcrumbDataLog } from "~/lib/utility";
import { useResource } from "~/context/ResourceContext";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";
import DataLogView from "~/components/data_log/DataLogView";
import DataSetLogView from "~/components/data_log/DatasetLogView";

export default function DatasetLogItem() {
  // get resource and dashboard schema context
  const { resource, setName } = useResource();
  const { schema, menuPath, setMenuPath } = useDashboard();
  // update resource and dashboard schema using dashboard path
  const path = dashboardPath();
  onMount(() => {
    setName(path.name);
    const p = menuPath();
    if (p[0] != path.name || p[1] != path.menu) {
      setMenuPath([path.name, path.menu]);
    }
  });

  const mode = () => (schema() as DataLogSchema).mode;
  // take a dashboard schema child matched with submenu path
  const component = () => {
    const s = schema() as DataLogSchema;
    if (Array.isArray(s?.children)) {
      const c = s?.children.find((item) => item.name == path.submenu);
      if (c) {
        if ("devices" in c) return "devices";
        if ("sets" in c) return "sets";
      }
    }
  };
  // transform dashboard schema to breadcrumb schema
  const breadcrumb = () => breadcrumbDataLog(schema() as DataLogSchema);

  return (
    <Show when={schema()}>
      <Show when={breadcrumb()}>
        <Breadcrumb mode={mode()} dashboard={path.name} schema={breadcrumb()!} />
      </Show>
      <Show when={resource() && component()}>
        <Switch>
          <Match when={component() == "devices"}>
            <DataLogView resource={resource()!} data_log={schema()! as DataLogSchema} />
          </Match>
          <Match when={component() == "sets"}>
            <DataSetLogView resource={resource()!} data_log={schema()! as DataLogSchema} />
          </Match>
        </Switch>
      </Show>
    </Show>
  );
}
