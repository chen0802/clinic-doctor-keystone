const SET_ACTIVE_OPTIONS = 'app/List/SET_ACTIVE_OPTIONS';
const CLEAR_ALL_OPTIONS = 'app/List/CLEAR_ALL_OPTIONS';


/**
 * Active actions
 */

export function setActiveOptions (options) {
	return {
		type: SET_ACTIVE_OPTIONS,
		options,
	};
}

export function clearOption (param) {
	return {
		type: CLEAR_OPTION,
		param,
	};
}

export function clearAllOptions () {
	return {
		type: CLEAR_ALL_OPTIONS,
	};
}
