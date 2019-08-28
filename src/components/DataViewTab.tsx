import React from 'react';

import { Header, Segment } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import CardView from './CardView';

import './DataViewTab.scss';
import 'github-markdown-css'

import { WorksheetData } from '../interface';

interface DataViewProps {
  worksheet: WorksheetData
  infos: string
};

const DataView: React.FunctionComponent<DataViewProps> = (props) => {
  const { worksheet, infos } = props;

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
        headerContent={Object.keys(worksheet.data[0] || {})}
        rowDatas={worksheet.data}
      />
    </div>
  );
}

export default DataView;
