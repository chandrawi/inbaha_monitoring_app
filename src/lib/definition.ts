export type AuthSchema = {
  address: string;
};

export type ResourceSchema = {
  address: string;
  api_id: string
};

export type DashboardPath = {
  name: string;
  menu: string | null;
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
