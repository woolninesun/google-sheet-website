import React from 'react';

import { Header, Segment } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import CardView from './components/CardView';

import './DataViewTab.scss';
import 'github-markdown-css'

import { getRowDataFromWorksheetEntries } from './utilities/gsx';

import { RowData } from './interface/app';

interface DataViewProps {
  worksheet: {
    title: string,
    link: string
  }
  infos: string
};

const DataView: React.FunctionComponent<DataViewProps> = (props) => {
  const { worksheet, infos } = props;

  // const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [rowDatas, setRowDatas] = React.useState<RowData[]>([]);

  React.useEffect(() => {
    fetch(worksheet.link)
      .then(response => response.json())
      .then((result) => {
        if (result.feed.entry) {
          setRowDatas(getRowDataFromWorksheetEntries(result.feed.entry));
          setIsLoading(false);
        }
      }, (error) => {
        // setIsError(true);
      });
  }, [worksheet]);

  return (
    <div className='data-view-tab'>
      <Header as='h1' textAlign='center' dividing>{worksheet.title}</Header>
      {
        (infos !== '' && infos !== undefined) ? (
          <Segment className="markdown-body">
            <ReactMarkdown source={infos} />
          </Segment>
        ) : null
      }
      <CardView
        isLoading={isLoading}
        headerContent={Object.keys(rowDatas[0] || {})}
        rowDatas={rowDatas}
      />
    </div>
  );
}

export default DataView;
