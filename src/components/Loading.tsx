import React from 'react';

import './Loading.scss';

import { Header } from 'semantic-ui-react';
import { ClipLoader } from 'react-spinners';

interface LoadingProps {
  isLoading: boolean
};

const Loading: React.FunctionComponent<LoadingProps> = (props) => {
  const { isLoading, children } = props;
  const color = '#4A90E2';

  return <React.Fragment>
    {isLoading ? (
      <div className='loading-container'>
        <ClipLoader
          loading={isLoading} color={color}
          sizeUnit={'px'} size={100}
        />
        <Header className='loading-text' textAlign='center'>Loading Data...</Header>
      </div>
    ) : children}
  </React.Fragment>;
}

Loading.defaultProps = {
  isLoading: true
}

export default Loading;
