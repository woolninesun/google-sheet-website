import React from 'react';

import './CardView.scss';

import { Card, Table } from 'semantic-ui-react';

import { RowData } from '../interface';

interface CardViewProps {
  headerContent: string[],
  rowDatas: RowData[]
};

const CardView: React.FunctionComponent<CardViewProps> = (props) => {
  const { headerContent, rowDatas } = props;
  return (
    <div className='card-view'>
      <Card.Group centered doubling>
        {rowDatas.map((rowData, index) => (
          <Card key={index} fluid>
            <Card.Content>
              <Table definition>
                <Table.Body>
                  {headerContent.map((name, index) => {
                    return (
                      <Table.Row key={index} >
                        <Table.Cell width={4}>{name}</Table.Cell>
                        <Table.Cell>{rowData[name]}</Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
}

CardView.defaultProps = {
  headerContent: [],
  rowDatas: []
}

export default CardView;
