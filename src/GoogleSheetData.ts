import {
  SheetData, WorksheetData, RowData, Settings,
  SheetRawObject, WorksheetLink, WorksheetEntry, WorksheetRowEntry
} from './interface';

export const defaultSettings: Settings = { title: '', links: [], infos: {} };
export default async function getSheetDatas(url: string): Promise<SheetData> {
  return fetchJson(url)
    // Get title, rawWorksheetDatas.
    .then(async (result) => {
      let title: string = '';
      let rawWorksheetDatas: WorksheetData[] = [];

      if (result && result.feed && result.feed.title && result.feed.entry) {
        title = getStringFromRawObject(result.feed.title);
        await getWorksheetDatasFromEntries(result.feed.entry).then((worksheetDatas) => {
          rawWorksheetDatas = worksheetDatas;
        });
      }

      return { title, rawWorksheetDatas };
    })
    // Get settings and worksheetData.
    .then((result) => {
      let settings: Settings = defaultSettings;
      let worksheetDatas: WorksheetData[] = [];

      result.rawWorksheetDatas.forEach((rawWorksheetData) => {
        if (rawWorksheetData.title === 'Settings') {
          settings = getSettingsFromWorksheetData(rawWorksheetData);
          return;
        }
        worksheetDatas.push(rawWorksheetData);
      });

      return { title: result.title, settings, worksheetDatas };
    });
}

function fetchJson(url: string) {
  return fetch(url).then(response => response.json());
}

function getStringFromRawObject(title: SheetRawObject): string {
  return (title && title.$t) ? title.$t : '';
}

function getSettingsFromWorksheetData(worksheetData: WorksheetData): Settings {
  const defaultSettingData: RowData = { attribute: '', arguments1: '', arguments2: '' };
  let settings: Settings = defaultSettings;

  worksheetData.data.forEach((rowData: RowData) => {
    const setting = Object.assign(defaultSettingData, rowData);

    if (setting.attribute === 'title') {
      settings.title = setting.arguments1;
    }

    if (setting.attribute === 'links' && setting.arguments1 !== '') {
      settings.links.push({
        name: setting.arguments1,
        href: setting.arguments2
      });
    }

    if (setting.attribute === 'infos' && setting.arguments1 !== '') {
      settings.infos[setting.arguments1] = setting.arguments2;
    }
  });
  return settings;
}

export async function getWorksheetDatasFromEntries(entries: WorksheetEntry[]):
  Promise<WorksheetData[]> {
  let worksheetDatas: WorksheetData[] = [];

  // Get title and link.
  entries.forEach((entry: WorksheetEntry) => {
    const sheetTitle = getStringFromRawObject(entry.title);
    const sheetLink = getWorksheetLink(entry.link, /#listfeed/);

    if (sheetTitle === '' || sheetLink === '') { return; }

    worksheetDatas.push({ title: sheetTitle, link: sheetLink, data: [] });
  });

  // Get datas
  for (let index = 0; index < worksheetDatas.length; index++) {
    const worksheetData = worksheetDatas[index];

    await fetchJson(worksheetData.link).then((result) => {
      if (result && result.feed && result.feed.entry) {
        const data = getRowDataFromEntries(result.feed.entry);
        worksheetDatas[index].data = data;
      }
    });
  }
  return worksheetDatas;
}

function getWorksheetLink(links: WorksheetLink[], target: RegExp): string {
  const link: WorksheetLink | undefined = links.find(link => target.test(link.rel));
  return link ? `${link.href}?alt=json` : '';
}

function getRowDataFromEntries(entries: WorksheetRowEntry[]): RowData[] {
  return entries.map((entry: WorksheetRowEntry): RowData => {
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
