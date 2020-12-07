import { AnyAction } from 'redux';

export interface Pagination {
  page: number;
  per_page: number;
}

export interface Order {
  sort: string | null;
  dir: string | null;
}

export interface State {
  search: any; //string | { value; [key: string]: any } | null;
  pagination: any; //Pagination;
  order: any; //Order;
  extraFilter?: { [key: string]: any };
}

export interface SetSearchAction extends AnyAction {
  payload: {
    search: string | { value; [key: string]: any } | null;
  };
}

export interface SetPageAction extends AnyAction {
  payload: {
    page: number;
  };
}

export interface SetPerPageAction extends AnyAction {
  payload: {
    per_page: number;
  };
}

export interface SetOrderAction extends AnyAction {
  payload: {
    sort: string | null;
    dir: string | null;
  };
}

export interface SetResetAction extends AnyAction {
  payload: {
    state: State;
  };
}

export interface UpdateExtraFilterAction extends AnyAction {
  payload: {
    [key: string]: any;
  };
}
export interface ClearExtraFilter extends AnyAction {
  payload: {};
}

export type Actions =
  | SetSearchAction
  | SetPageAction
  | SetPerPageAction
  | SetOrderAction
  | SetResetAction
  | UpdateExtraFilterAction
  | ClearExtraFilter;
