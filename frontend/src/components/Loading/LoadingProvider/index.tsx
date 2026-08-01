import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  addGlobalRequestInterceptor,
  addGlobalResponseInterceptor,
  removeGlobalRequestInterceptor,
  removeGlobalResponseInterceptor,
} from '../../../util/http';
import LoadingContext from '../LoadingContext';

const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countRequest, setCountRequest] = useState(0);

  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor((config) => {
      if (isSubscribed && !Object.hasOwn(config.headers, 'x-ignore-loading')) {
        setLoading(true);
        setCountRequest((prevCountRequest) => prevCountRequest + 1);
      }
      return config;
    });

    const responseIds = addGlobalResponseInterceptor(
      (response) => {
        if (
          isSubscribed &&
          !Object.hasOwn(response.config.headers, 'x-ignore-loading')
        ) {
          decrementCountRequest();
        }
        return response;
      },
      (error) => {
        if (
          isSubscribed &&
          !Object.hasOwn(error.config.headers, 'x-ignore-loading')
        ) {
          decrementCountRequest();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      isSubscribed = false;
      removeGlobalRequestInterceptor(requestIds);
      removeGlobalResponseInterceptor(responseIds);
    };
  }, [decrementCountRequest]);

  useEffect(() => {
    if (!countRequest) {
      setLoading(false);
    }
  }, [countRequest]);

  function decrementCountRequest() {
    setCountRequest((prevCountRequest) =>
      prevCountRequest <= 0 ? 0 : prevCountRequest - 1,
    );
  }
  return (
    <LoadingContext.Provider value={loading}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
