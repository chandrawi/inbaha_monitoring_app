import { RouteSectionProps, useLocation } from "@solidjs/router";
import { createResource } from "solid-js";
import { InformationSchema } from "~/lib/definition";
import { getDashboardPath } from "~/lib/utility";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function Information(props: RouteSectionProps) {
  // get dashboard path and resource schema based on URL
  const location = useLocation();
  const dashboardPath = getDashboardPath(location.pathname);

  // get information schema
  const [information] = createResource<InformationSchema[], string>(dashboardPath.name, async (name) => {
    const information = await fetch(`/schema/dashboard/${name}/information.json`);
    return await information.json();
  });
  const children1 = () => information() ? information()!.flatMap((item) => { return { name: item.name, text: item.text } }) : [];

  return (
    <>
      <Breadcrumb dashboard={dashboardPath.name} parent={{ name: "information", text: "Information" }} children1={children1()} children2={[]} child1={dashboardPath.name} child2="" />
      <>
        {props.children}
      </>
    </>
  );
}
