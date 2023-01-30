import { selectMenuType } from '../typings';

export class SelectMenu {
	constructor(selectMenu: selectMenuType) {
		Object.assign(this, selectMenu);
	}
}