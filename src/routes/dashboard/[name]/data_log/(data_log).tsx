import { Match, onMount, Show, Switch } from "solid-js";
import { DataLogSchema, DataLogViewSchema, DatasetLogViewSchema } from "~/lib/definition";
import { dashboardPath, breadcrumbDataLog } from "~/lib/utility";
import { useResource } from "~/context/ResourceContext";
import { useDashboard } from "~/context/DashboardContext";
import Breadcrumb from "~/components/navigation/Breadcrumb";
import DataLogList from "~/components/data_log/DataLogList";
import DataLogView from "~/components/data_log/DataLogView";
import DataSetLogView from "~/components/data_log/DatasetLogView";

export default function DataLog() {
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
  // take first of dashboard schema child for single mode view
  const data_log = () => {
    const s = schema() as DataLogSchema;
    if (!s) return;
    const c = s.children as (DataLogViewSchema | DatasetLogViewSchema)[];
    if (Array.isArray(c)) return c[0];
  };
  // transform dashboard schema to breadcrumb schema
  const breadcrumb = () => breadcrumbDataLog(schema() as DataLogSchema);

  return (
    <Show when={schema()}>
      <Show when={breadcrumb()}>
        <Breadcrumb mode={mode()} dashboard={path.name} schema={breadcrumb()!} />
      </Show>
      <Show when={mode() == "single"} fallback={
        <DataLogList data_log={schema()! as DataLogSchema} />
      }>
        <Show when={resource() && data_log()}>
          <Switch>
            <Match when={data_log()!.component == "data_log_view"}>
              <DataLogView path={path} resource={resource()!} data_log={data_log()! as DataLogViewSchema} />
            </Match>
            <Match when={data_log()!.component == "dataset_log_view"}>
              <DataSetLogView path={path} resource={resource()!} data_log={data_log()! as DatasetLogViewSchema} />
            </Match>
          </Switch>
        </Show>
      </Show>
    </Show>
  );
}
