import { buttonType } from '../typings';

export class Button {
	constructor(button: buttonType) {
		Object.assign(this, button);
	}
}