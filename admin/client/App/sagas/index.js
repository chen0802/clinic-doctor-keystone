import { takeLatest, delay } from 'redux-saga';
import { fork, select, put, take, call } from 'redux-saga/effects';

import * as actions from '../screens/List/constants';
import { updateParams, evalQueryParams } from './queryParamsSagas';
import { columnsParser, sortParser, filterParser } from '../parsers';

/**
 * Debounce the search loading new items by 500ms
 */

function * debouncedSearch () {
	const searchString = yield select((state) => state.active.search);
	if (searchString) {
		yield delay(500);
	}
	yield call(updateParams);
}

export function * setActiveColumnsSaga () {
	while (true) {
		const { columns } = yield take(actions.SELECT_ACTIVE_COLUMNS);
		const { currentList } = yield select(state => state.lists);
		const newColumns = yield call(columnsParser, columns, currentList);
		yield put({ type: actions.SET_ACTIVE_COLUMNS, columns: newColumns });
	}
}

export function * setActiveSortSaga () {
	while (true) {
		const { path } = yield take(actions.SELECT_ACTIVE_SORT);
		const { currentList } = yield select(state => state.lists);
		const sort = yield call(sortParser, path, currentList);

		yield put({ type: actions.SET_ACTIVE_SORT, sort });
	}
}

export function * setActiveFilterSaga () {
	while (true) {
		const { filter } = yield take(actions.SELECT_FILTER);
		const { currentList } = yield select(state => state.lists);
		const activeFilters = yield select(state => state.active.filters);
		const updatedFilter = yield call(filterParser, filter, activeFilters, currentList);

		yield put({ type: actions.ADD_FILTER, filter: updatedFilter });
	}
}
////ADDON:OPTIONS
export function * setActiveOptionsSaga () {
	while (true) {
		const { options } = yield take(actions.SELECT_ACTIVE_OPTIONS);
		const { currentList } = yield select(state => state.lists);
		const newOptions = yield call(optionsParser, options, currentList);
		yield put({ type: actions.SET_ACTIVE_OPTIONS, options: newOptions });
	}
}

function * rootSaga () {
	yield fork(takeLatest, actions.SET_ACTIVE_SEARCH, debouncedSearch);
	yield fork(takeLatest, actions.SET_ACTIVE_LIST, evalQueryParams);
	// If one of the other active properties changes, update the query params and load the new items
	yield fork(setActiveSortSaga);
	yield fork(setActiveColumnsSaga);
	yield fork(setActiveFilterSaga);
	////Addon:OPTIONS
	yield fork(setActiveOptionsSaga);

	yield fork(takeLatest, [
		actions.QUERY_HAS_CHANGED,
		actions.ADD_FILTER,
		actions.SET_ACTIVE_COLUMNS,
		actions.SET_ACTIVE_SORT,
		actions.SET_CURRENT_PAGE,
		actions.CLEAR_FILTER,
		actions.CLEAR_ALL_FILTERS,
		////ADDON:OPTIONS
		actions.CLEAR_OPTION,
		actions.SET_ACTIVE_OPTIONS
	], updateParams);
}

export default rootSaga;
