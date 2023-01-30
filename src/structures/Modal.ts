import { modalType } from '../typings';

export class Modal {
	constructor(modal: modalType) {
		Object.assign(this, modal);
	}
}