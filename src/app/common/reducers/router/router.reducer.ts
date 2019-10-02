import { createSelector } from '@ngrx/store';
import { last, path, pipe, split } from 'ramda';

import { State } from '@app-common/models';

export const selectRouterStore = (state: State) => state.router;
export const getActiveTab = createSelector(
  selectRouterStore,
  pipe(
    path(['state', 'url']) as (data: unknown) => string,
    split('/') as (data: string) => string[],
    last,
  ),
);
