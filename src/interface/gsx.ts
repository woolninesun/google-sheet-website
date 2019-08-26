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

export interface WorksheetCellEntry {
  title: SheetRawObject,
  content: SheetRawObject,
  updated: SheetRawObject,
  [name: string]: SheetRawObject
};
