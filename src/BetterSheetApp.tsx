import React from 'react';

import './BetterSheetApp.scss';

import DataViewTab from './components/DataViewTab';
import TabSidebar from './components/TabSidebar';
import Loading from './components/Loading';

import getSheetData, { defaultSettings } from './GoogleSheetData';

import { WorksheetData, Settings } from './interface';

const BetterSheetApp: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [title, setTitle] = React.useState<string>('');
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [worksheetDatas, setWorksheetDatas] = React.useState<WorksheetData[]>([]);

  React.useEffect(() => {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    let sheetID: string = urlParams.get('sheetid') || '';

    if (sheetID === '') {
      sheetID = '1LBQajGNLrw5Rjo7pGuxKJM1prlQ9XPE-0aTJsiz5eQQ'; // Demo && Tutorial sheet
    }

    const apidomain: string = 'https://spreadsheets.google.com';
    const apiQuery: string = `feeds/worksheets/${sheetID}/public/values?alt=json`;
    const apiUrl: string = `${apidomain}/${apiQuery}`;

    // Set Settings, Worksheets and isLoading state
    getSheetData(apiUrl).then((result) => {
      setTitle(result.title);
      setSettings(result.settings);
      setWorksheetDatas(result.worksheetDatas);
      setIsLoading(false);
    });
  }, []);

  const displayTitle = settings.title || title;
  document.title = (displayTitle) ? `${displayTitle} - BetterSheet` : 'BetterSheet';

  return (
    <Loading isLoading={isLoading} >
      <TabSidebar
        title={displayTitle}
        tabMenuItems={worksheetDatas.map((worksheetData) => ({
          name: worksheetData.title,
          panel: (
            <DataViewTab
              worksheet={worksheetData}
              infos={settings.infos[worksheetData.title]}
            />
          )
        }))}
        linkMenuItems={settings.links} />
    </Loading>
  );
}

export default BetterSheetApp;
