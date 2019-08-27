import { RowData, WorksheetData, Settings } from '../interface/app';

export const defaultSettings: Settings = { title: '', links: [], infos: {} };
const defaultSettingData: RowData = { attribute: '', arguments1: '', arguments2: '' };

export function getSettingsFromRawData(worksheetData: WorksheetData): Settings {
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
