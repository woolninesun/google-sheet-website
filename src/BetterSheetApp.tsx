import React from 'react';

import './BetterSheetApp.scss';

import DataViewTab from './DataViewTab';
import TabSidebar from './components/TabSidebar';
import Loading from './components/Loading';

import { getStringFromRawObject, getRowDataFromWorksheetEntries } from './utilities/gsx';

import { WorksheetLink, WorksheetEntry } from './interface/gsx';
import { RowData, WorksheetData, Settings } from './interface/app';

const defaultSettings: Settings = { title: '', links: [], infos: {} };
const defaultSettingData: RowData = { attribute: '', arguments1: '', arguments2: '' };

const BetterSheetApp: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [title, setTitle] = React.useState<string>('');
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [worksheets, setWorksheets] = React.useState<WorksheetData[]>([]);

  React.useEffect(() => {
    const getSettingsFromWorksheet = (WorksheetUrl: string) => {
      fetch(WorksheetUrl)
        .then(response => response.json())
        .then((result) => {
          if (result && result.feed && result.feed.title && result.feed.entry) {
            let rawSettings: Settings = defaultSettings;
            getRowDataFromWorksheetEntries(result.feed.entry).forEach(
              (rowData: RowData) => {
                const rawSetting = Object.assign(defaultSettingData, rowData);

                if (rawSetting.attribute === 'title') {
                  rawSettings.title = rawSetting.arguments1;
                }

                if (rawSetting.attribute === 'links' && rawSetting.arguments1 !== '') {
                  rawSettings.links.push({
                    name: rawSetting.arguments1,
                    href: rawSetting.arguments2
                  });
                }

                if (rawSetting.attribute === 'infos' && rawSetting.arguments1 !== '') {
                  rawSettings.infos[rawSetting.arguments1] = rawSetting.arguments2;
                }
              }
            );
            setSettings({ ...rawSettings });
          }
        }, (error) => {
          // setIsError(true);
        });
    }

    const getWorksheetLink = (links: WorksheetLink[], target: RegExp): string => {
      const link: WorksheetLink | undefined = links.find(link => target.test(link.rel));
      return link ? `${link.href}?alt=json` : '';
    }

    const getWorksheetDataFromEntries = (entries: WorksheetEntry[]): WorksheetData[] => {
      let worksheets: WorksheetData[] = [];
      entries.forEach((entry: WorksheetEntry) => {
        const sheetTitle = getStringFromRawObject(entry.title);
        const sheetLink = getWorksheetLink(entry.link, /#listfeed/);

        if (sheetTitle === '' || sheetLink === '') { return; }
        if (sheetTitle === 'Settings') { getSettingsFromWorksheet(sheetLink); return; }

        worksheets.push({ title: sheetTitle, link: sheetLink });
      });
      return worksheets;
    }

    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    let sheetID: string = urlParams.get('sheetid') || '';

    if (sheetID === '') {
      sheetID = '1LBQajGNLrw5Rjo7pGuxKJM1prlQ9XPE-0aTJsiz5eQQ'; // Demo && Tutorial
    }

    const apidomain: string = 'https://spreadsheets.google.com';
    const apiQuery: string = `feeds/worksheets/${sheetID}/public/values?alt=json`;
    const apiUrl: string = `${apidomain}/${apiQuery}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then((result) => {
        if (result && result.feed && result.feed.title && result.feed.entry) {
          setTitle(getStringFromRawObject(result.feed.title));
          setWorksheets(getWorksheetDataFromEntries(result.feed.entry));
          setIsLoading(false);
        }
      }, (error) => {
        // setIsError(true);
      });
  }, []);

  const displayTitle = settings.title || title;
  document.title = (displayTitle) ? `${displayTitle} - BetterSheet` : 'BetterSheet';

  return (
    <Loading isLoading={isLoading} >
      <TabSidebar
        title={displayTitle}
        tabMenuItems={worksheets.map((worksheet) => ({
          name: worksheet.title,
          panel: (
            <DataViewTab
              worksheet={worksheet}
              infos={settings.infos[worksheet.title]}
            />
          )
        }))}
        linkMenuItems={settings.links} />
    </Loading>
  );
}

export default BetterSheetApp;
