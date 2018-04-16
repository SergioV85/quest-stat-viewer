import { createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { last, path, pipe, prop, split } from 'ramda';

import { RouterStateUrl } from '@app-common/serializers/router-state/custom-router-state-serializer';

export const selectRouterStore = (state: QuestStat.Store.State) => state.router;
export const getActiveTab = createSelector(selectRouterStore, (state: RouterReducerState<RouterStateUrl>) =>
  pipe(
    path(['state', 'url']),
    split('/'),
    last
  )(state)
);
