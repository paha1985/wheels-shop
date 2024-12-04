import { ACTION_TYPE } from './types';

export const setUser = (user) => ({
	type: ACTION_TYPE.SET_USER,
	payload: user,
});
