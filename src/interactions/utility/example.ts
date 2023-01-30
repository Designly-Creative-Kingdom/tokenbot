import { interactionOptions } from "../../typings";

export const exampleCommand = {
	name: 'example',
	description: 'This is an example command',
	directory: 'utility',
	type: 1,
	cooldown: 5000,
	permission: ['ManageGuild'],

} as interactionOptions;