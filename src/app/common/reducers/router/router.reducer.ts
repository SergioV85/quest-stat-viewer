import { createSelector } from '@ngrx/store';
import { last, path, pipe, split } from 'ramda';

import { State, UnaryOperator } from '@app-common/models';

export const selectRouterStore = (state: State) => state.router;
export const getActiveTab = createSelector(
  selectRouterStore,
  pipe(
    path(['state', 'url']) as UnaryOperator<unknown, string>,
    split('/') as UnaryOperator<string, string[]>,
    last as UnaryOperator<string[], string>,
  ),
);
