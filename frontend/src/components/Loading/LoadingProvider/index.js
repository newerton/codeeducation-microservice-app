import React, { useEffect, useMemo, useState } from 'react';

import { omit } from 'lodash';

import LoadingContext from '~/components/Loading/LoadingContext';
import {
  addGlobalRequestInterceptor,
  addGlobalResponseInterceptor,
  removeGlobalRequestInterceptor,
  removeGlobalResponseInterceptor,
} from '~/util/http';

const LoadingProvider = props => {
  const [loading, setLoading] = useState(false);
  const [counterRequest, setCounterRequest] = useState(0);

  function decrementCountRequest() {
    setCounterRequest(prevCountRequest => prevCountRequest - 1);
  }

  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor(config => {
      if (isSubscribed && config.headers.hasOwnProperty('x-ignore-loading')) {
        setLoading(true);
        setCounterRequest(prevCountRequest => prevCountRequest + 1);
      }
      // config.headers = omit(config.headers, 'ignoreLoading');
      return config;
    });
    const responseIds = addGlobalResponseInterceptor(
      response => {
        if (isSubscribed && response.config.headers.hasOwnProperty('x-ignore-loading')) {
          setLoading(false);
          decrementCountRequest();
        }
        return response;
      },
      err => {
        if (isSubscribed && err.config.headers.hasOwnProperty('x-ignore-loading')) {
          setLoading(false);
          decrementCountRequest();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      isSubscribed = false;
      removeGlobalRequestInterceptor(requestIds);
      removeGlobalResponseInterceptor(responseIds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true]);

  useEffect(() => {
    if (!counterRequest) {
      setLoading(false);
    }
  }, [counterRequest]);
  return (
    <LoadingContext.Provider value={loading}>
      {props.children}
    </LoadingContext.Provider>
  );
};
export default LoadingProvider;
