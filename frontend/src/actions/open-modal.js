import { ACTION_TYPE } from './types';

export const openModal = (modalParams) => ({
	type: ACTION_TYPE.OPEN_MODAL,
	payload: modalParams,
});
