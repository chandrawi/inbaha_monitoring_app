export type AuthSchema = {
  address: string;
};

export type ResourceSchema = {
  address: string;
  api_id: string
};

export type DashboardPath = {
  name: string;
  menu: string;
  submenu: string | null;
};

export type DashboardMenu = {
  id: number;
  parent_id: number;
  name: string;
  text: string;
  icon: string;
  link: string;
};

export type OverviewSchema = {
  name: string;
  text: string;
  icon: string;
};

export type OverviewCardsSchema = OverviewSchema & {
  sets: {
    id: string;
    name: string;
  }[];
  config: {
    live_range: number;
    live_ranges: number[];
    float_precission: { [key:string]: number }
  };
};

export type InformationSchema = {
  name: string;
  text: string;
  icon: string;
  component: string;
};
