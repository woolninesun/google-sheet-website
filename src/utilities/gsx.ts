import {
  SheetRawObject, WorksheetLink, WorksheetEntry, WorksheetCellEntry
} from '../interface/gsx';
import { RowData, WorksheetData } from '../interface/app';

export function getStringFromRawObject(title: SheetRawObject): string {
  return (title && title.$t) ? title.$t : '';
}

export function getWorksheetLink(links: WorksheetLink[], target: RegExp): string {
  const link: WorksheetLink | undefined = links.find(link => target.test(link.rel));
  return link ? `${link.href}?alt=json` : '';
}

export function getRowWorksheetDataFromEntries(
  entries: WorksheetEntry[]): WorksheetData[] {
  let worksheets: WorksheetData[] = [];
  entries.forEach((entry: WorksheetEntry) => {
    const sheetTitle = getStringFromRawObject(entry.title);
    const sheetLink = getWorksheetLink(entry.link, /#listfeed/);

    if (sheetTitle === '' || sheetLink === '') { return; }

    worksheets.push({ title: sheetTitle, link: sheetLink, data: [] });
  });
  return worksheets;
}

export function getDataFromWorksheetEntries(entries: WorksheetCellEntry[]): RowData[] {
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
