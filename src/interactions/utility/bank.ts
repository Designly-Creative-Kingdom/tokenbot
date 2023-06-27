import { ApplicationCommandOptionType } from "discord.js";
import { interactionOptions } from "../../typings";

export const bankCommand = {
	name: 'bank',
	description: 'Manage the Designly Nibs™ bank.',
	directory: 'utility',
	cooldown: 5000,
	permission: ['ManageGuild'],
	options: [
		{
			name: 'give',
			description: 'Give a member Nibs.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'The user you want to grant Nibs to.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'nibs',
					description: 'The amount of Nibs you want to add to the user.',
					type: ApplicationCommandOptionType.Integer,
					required: true
				},
				{
					name: 'silent',
					description: 'Whether or not you want to silently give the user nibs.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			]
		},
		{
			name: 'remove',
			description: 'Remove nibs from a member.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'The user you want to remove nibs from.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'nibs',
					description: 'The amount of nibs you want to remove from the user.',
					type: ApplicationCommandOptionType.Integer,
					required: true
				},
				{
					name: 'silent',
					description: 'Whether or not you want to silently give the user coins.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			]
		},
		{
			name: 'set',
			description: 'Set a user\'s balance to a specified amount.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'The user you want to remove nibs from.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'nibs',
					description: 'The amount of nibs you want to set the user\'s balance to.',
					type: ApplicationCommandOptionType.Integer,
					required: true
				},
				{
					name: 'silent',
					description: 'Whether or not you want to silently give the user coins.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			]
		}
	]

} as interactionOptions;