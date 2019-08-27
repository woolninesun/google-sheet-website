export interface RowData {
  [col: string]: string
};

export interface WorksheetData {
  title: string,
  link: string,
  data: RowData[]
};

export interface MenuItems {
  name: string,
  href?: string,
  panel?: any
}

export interface Settings {
  title: string,
  links: MenuItems[],
  infos: {
    [tabName: string]: string
  }
}
