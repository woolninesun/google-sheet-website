import { SheetRawObject, WorksheetCellEntry } from '../interface/gsx';
import { RowData } from '../interface/app';

export function getStringFromRawObject(title: SheetRawObject): string {
  return (title && title.$t) ? title.$t : '';
}

export function getRowDataFromWorksheetEntries(entries: WorksheetCellEntry[]): RowData[] {
  return entries.map((entry: WorksheetCellEntry): RowData => {
    let rowData: RowData = {};
    Object.keys(entry)
      .filter(key => (key.indexOf('gsx$') > -1))
      .forEach((key: string): void => {
        const headerName = key.substring(4);
        const content = getStringFromRawObject(entry[key]);
        rowData[headerName] = content;
      });
    return rowData;
  });
}
