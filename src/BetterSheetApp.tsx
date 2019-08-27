import React from 'react';

import './BetterSheetApp.scss';

import DataViewTab from './components/DataViewTab';
import TabSidebar from './components/TabSidebar';
import Loading from './components/Loading';

import {
  getStringFromRawObject,
  getRowWorksheetDataFromEntries,
  getDataFromWorksheetEntries
} from './utilities/gsx';

import {
  defaultSettings,
  getSettingsFromRawData
} from './utilities/app';

import { WorksheetData, Settings } from './interface/app';

const BetterSheetApp: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [title, setTitle] = React.useState<string>('');
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [worksheets, setWorksheets] = React.useState<WorksheetData[]>([]);

  React.useEffect(() => {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    let sheetID: string = urlParams.get('sheetid') || '';

    if (sheetID === '') {
      sheetID = '1LBQajGNLrw5Rjo7pGuxKJM1prlQ9XPE-0aTJsiz5eQQ'; // Demo && Tutorial sheet
    }

    const apidomain: string = 'https://spreadsheets.google.com';
    const apiQuery: string = `feeds/worksheets/${sheetID}/public/values?alt=json`;
    const apiUrl: string = `${apidomain}/${apiQuery}`;

    fetch(apiUrl)
      .then(response => response.json())
      // Set document title and Get RowWorksheetDatas.
      .then(async (result) => {
        if (result && result.feed && result.feed.title && result.feed.entry) {
          setTitle(getStringFromRawObject(result.feed.title));

          let rowWorksheetDatas = getRowWorksheetDataFromEntries(result.feed.entry);
          for (let index = 0; index < rowWorksheetDatas.length; index++) {
            const rowWorksheetData = rowWorksheetDatas[index];

            await fetch(rowWorksheetData.link)
              .then(response => response.json())
              .then((result) => {
                if (result && result.feed && result.feed.entry) {
                  const data = getDataFromWorksheetEntries(result.feed.entry);
                  rowWorksheetDatas[index].data = data;
                }
              });
          }
          return rowWorksheetDatas;
        }
      })
      // Get finalSettings and finalWorksheetData.
      .then((rowWorksheetDatas) => {
        let finalSettings: Settings = defaultSettings;
        let finalWorksheetDatas: WorksheetData[] = [];

        if (rowWorksheetDatas) {
          rowWorksheetDatas.forEach((rowWorksheetData) => {
            if (rowWorksheetData.title === 'Settings') {
              finalSettings = getSettingsFromRawData(rowWorksheetData);
              return;
            }
            finalWorksheetDatas.push(rowWorksheetData);
          });
        }

        return { settings: finalSettings, worksheets: finalWorksheetDatas };
      })
      // Set Settings, Worksheets and isLoading state
      .then((result) => {
        const { settings, worksheets } = result;
        setSettings(settings);
        setWorksheets(worksheets);
        setIsLoading(false);
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
