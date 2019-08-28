// app
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

export interface SheetData {
  title: string,
  settings: Settings,
  worksheetDatas: WorksheetData[]
}

// gsx
export interface SheetRawObject {
  $t: string
  type: string
};

export interface WorksheetLink {
  rel: string,
  href: string
  type: string
}

export interface WorksheetEntry {
  updated: SheetRawObject,
  title: SheetRawObject,
  gs$colCount: SheetRawObject,
  gs$rowCount: SheetRawObject,
  link: WorksheetLink[]
}

export interface WorksheetRowEntry {
  title: SheetRawObject,
  content: SheetRawObject,
  updated: SheetRawObject,
  [name: string]: SheetRawObject
};
