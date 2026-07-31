import { createSignal, Show, For } from "solid-js";
import { dashboardPath, clickOutside } from "~/lib/utility";

interface BreadcrumbSchema {
  name: string;
  text: string;
  children: {
    name: string;
    text: string;
    children?: {
      name: string;
      text: string;
    }[]
  }[];
};

interface BreadcrumbProps {
  mode?: "single" | "flat" | "nested";
  dashboard: string;
  schema: BreadcrumbSchema;
};

declare module "solid-js" {
  interface Directives {
    clickOutside: () => void;
  }
}

export default function Breadcrumb(props: BreadcrumbProps) {
  const mode = () => props.mode ? props.mode : "nested";
  const child1 = () => dashboardPath().submenu;
  const child2 = () => dashboardPath().item;

  const parent = () => ({
    name: props.schema.name,
    text: props.schema.text
  });

  const children1 = () => {
    if (!Array.isArray(props.schema?.children)) return [];
    return props.schema.children.map((item) => ({
      name: item.name,
      text: item.text
    }));
  };

  const children2 = () => {
    if (!Array.isArray(props.schema?.children)) return [];
    return props.schema.children.flatMap((item1) => {
      if (!Array.isArray(item1?.children)) return [];
      const children = item1.children.map((item2) => ({
        name: item2.name,
        text: item2.text,
        parent: item1.name
      }));
      if (mode() == "nested") {
        return children.filter((item) => item.parent === child1());
      }
      return children;
    });
  };

  const child1Text = () => {
    if (children1()) {
      return children1().find((value) => value.name === child1())?.text;
    }
  };
  const child2Text = () => {
    if (children2()) {
      return children2().find((value) => value.name === child2())?.text;
    }
  };

  const setLink = (segments: (string | undefined)[]) => {
    const activeSegments = segments.filter(Boolean);
    return "/dashboard/" + [props.dashboard, ...activeSegments].join("/");
  };

  // signals for controlling dropdown
  const [dropdown1, setDropdown1] = createSignal(true);
  const [dropdown2, setDropdown2] = createSignal(true);
  const clickOutsideDirective = clickOutside;

  return (
    <div class="w-full px-2 pt-1.5 pb-2 flex flex-row items-center font-medium text-gray-800 dark:text-gray-200">
      <a href={setLink([parent().name])} class="hover:text-sky-800 dark:hover:text-sky-300">
        {parent().text}
      </a>
      <span class="icon-arrow_fill_right text-[0.75rem] text-sky-800 dark:text-sky-300 px-1"></span>

      <Show when={mode() == "nested"}>
        <Show when={children2().length} fallback={
          <div class="min-w-24 h-full relative bg-sky-100 dark:bg-sky-950 text-sm rounded-sm">
            <button class="group w-full h-full px-2 py-0.5 flex flex-row items-center justify-between text-gray-800 hover:text-sky-800 dark:text-gray-50 dark:hover:text-sky-300"
              onclick={() => setDropdown1(!dropdown1())}
              use:clickOutsideDirective={() => setDropdown1(true)}
            >
              <span class="w-full text-center">{child1Text() ? child1Text() : "————"}</span>
              <span class="icon-arrow_fill_down text-[0.75rem] ml-1"></span>
            </button>
            <div classList={{ hidden: dropdown1() }} class="min-w-full absolute flex flex-col justify-center bg-white shadow-md shadow-slate-200 dark:shadow-slate-950 dark:bg-slate-800">
              <For each={children1()}>
              {(item) => (
                <a href={setLink([parent().name, item.name])} class="w-full px-2 py-1 wrap-break-word hover:text-sky-800 border-t border-slate-200 border-dotted dark:hover:text-sky-300 dark:border-slate-700">
                  {item.text}
                </a>
              )}
              </For>
            </div>
          </div>
        }>
          <a href={setLink([parent().name, child1()])} class="hover:text-sky-800 dark:hover:text-sky-300">
            {child1Text()}
          </a>
          <Show when={children2().length}>
            <span class="icon-arrow_fill_right text-[0.75rem] text-sky-800 dark:text-sky-300 px-1"></span>
          </Show>
        </Show>
      </Show>

      <Show when={(child1Text() || mode() != "nested") && children2().length}>
        <div class="min-w-24 h-full relative bg-sky-100 dark:bg-sky-950 text-sm rounded-sm">
          <button 
            class="group w-full h-full px-2 py-0.5 flex flex-row items-center justify-between text-gray-800 hover:text-sky-800 dark:text-gray-50 dark:hover:text-sky-300"
            onclick={() => setDropdown2(!dropdown2())}
            use:clickOutsideDirective={() => setDropdown2(true)}
          >
            <span class="w-full text-center">{child2Text() ? child2Text() : "————"}</span>
            <span class="icon-arrow_fill_down text-[0.75rem] ml-1"></span>
          </button>
          <div classList={{ hidden: dropdown2() }} class="min-w-full absolute flex flex-col justify-center bg-white shadow-md shadow-slate-200 dark:shadow-slate-950 dark:bg-slate-800">
            <For each={children2()}>
            {(item) => (
              <a href={setLink([parent().name, item?.parent, item?.name])} class="w-full px-2 py-1 wrap-break-word hover:text-sky-800 border-t border-slate-200 border-dotted dark:hover:text-sky-300 dark:border-slate-700">
                {item?.name}
              </a>
            )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
