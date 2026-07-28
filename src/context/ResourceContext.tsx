import { createSignal, createResource, createContext, useContext, JSX, Resource, Accessor, Setter, createEffect } from "solid-js";
import { ResourceSchema } from "~/lib/definition";
import { resourceServer } from "~/lib/store";

interface ResourceContextType {
  resource: Resource<ResourceSchema>;
  name: Accessor<string>;
  setName: Setter<string>
};

const ResourceContext = createContext<ResourceContextType>();

export function ResourceProvider(props: {children: JSX.Element}) {
  const [name, setName] = createSignal<string>("");

  // get a resource schema based on the dashboard name
  const [resource] = createResource<ResourceSchema, string>(name, async (name) => {
    if (name === "") return {};
    try {
      const response = await fetch(`/schema/dashboard/${name}/resource.json`);
      return await response.json();
    } catch(error) {
      console.error(error);
      return {};
    }
  });

  // set resource server address to the address of matched dashboard api_id
  createEffect(() => {
    const r = resource();
    if (r) resourceServer.setAddress(r.api_id, r.address);
  });

  return (
    <ResourceContext.Provider value={{ resource, name, setName }}>
      {props.children}
    </ResourceContext.Provider>
  );
}

export function useResource() {
  const context = useContext(ResourceContext);
  if (!context) throw new Error("useResource must be used within a ResourceProvider");
  return context;
}
