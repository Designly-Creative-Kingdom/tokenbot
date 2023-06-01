import { ApplicationCommandOptionType } from "discord.js";
import { interactionOptions } from "../../typings";

export const bankCommand = {
	name: 'bank',
	description: 'Manage the Designly Tokens™ bank.',
	directory: 'utility',
	cooldown: 5000,
	permission: ['ManageGuild'],
	options: [
		{
			name: 'give',
			description: 'Give a member tokens.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'The user you want to grant tokens to.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'tokens',
					description: 'The amount of tokens you want to add to the user.',
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
			name: 'remove',
			description: 'Remove tokens from a member.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'The user you want to remove tokens from.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'tokens',
					description: 'The amount of tokens you want to remove from the user.',
					type: ApplicationCommandOptionType.Number,
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
					description: 'The user you want to remove tokens from.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'tokens',
					description: 'The amount of tokens you want to set the user\'s balance to.',
					type: ApplicationCommandOptionType.Number,
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