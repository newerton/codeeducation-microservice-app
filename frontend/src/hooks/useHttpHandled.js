import { useCallback } from 'react';

import axios from 'axios';

import toast from '~/util/toast';

export default function useHttpHandled() {
  return useCallback(async request => {
    try {
      const { data } = await request;
      return data;
    } catch (e) {
      if (!axios.isCancel(e)) {
        toast.error('Não foi possível carregar as informações');
      }
      throw e;
    }
  }, []);
}
