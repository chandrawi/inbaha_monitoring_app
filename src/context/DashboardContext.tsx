import { createSignal, createResource, createContext, useContext, JSX, Resource, Accessor, Setter } from "solid-js";
import { OverviewSchema, InformationSchema, DataLogSchema } from "~/lib/definition";

type DashboardSchema = OverviewSchema | InformationSchema | DataLogSchema | null;

interface DashboardContextType {
  schema: Resource<DashboardSchema>;
  menuPath: Accessor<[string, string]>;
  setMenuPath: Setter<[string, string]>;
};

const DashboardContext = createContext<DashboardContextType>();

export function DashboardProvider(props: {children: JSX.Element}) {
  const [menuPath, setMenuPath] = createSignal<[string, string]>(["", ""]);

  // get a dashboard page schema based on the dashboard name and menu
  const [schema] = createResource<DashboardSchema, [string, string]>(menuPath, async ([name, menu]) => {
    if (name === "" || menu === "") return {};
    try {
      const response = await fetch(`/schema/dashboard/${name}/${menu}.json`);
      return await response.json();
    } catch(error) {
      console.error(error);
      return {};
    }
  });

  return (
    <DashboardContext.Provider value={{ schema, menuPath, setMenuPath }}>
      {props.children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
}
