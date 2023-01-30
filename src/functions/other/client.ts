import { EmbedBuilder, resolveColor } from 'discord.js';
import { client } from '../..';
import { type emojisConfigTypes, type EmojisConfigTypes, emojisConfigDefaults } from '../../typings';
import { load } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';

export const cc = {
	invisible: resolveColor('#2F3136'),
	moderation: resolveColor('#dbca95'),
	success: checkEmojis('success'),
	error: checkEmojis('error'),
	attention: checkEmojis('attention'),
};

export const clientEmbeds = {
	success: function (message: string) {
		const embed = new EmbedBuilder()
			.setDescription(client.cc.success + ' ' + message)
			.setColor(resolveColor('#9eea9a'));
		return embed;
	},
	attention: function (message: string) {
		const embed = new EmbedBuilder()
			.setDescription(client.cc.attention + ' ' + message)
			.setColor(resolveColor('#f0e17c'));
		return embed;
	},
	error: function name(error: string) {
		const embed = new EmbedBuilder().setDescription(client.cc.error + ' ' + error).setColor(0xCC0000);
		return embed;
	},
};

function checkEmojis(type: EmojisConfigTypes) {
	const emojisExist: boolean = existsSync(`${process.cwd()}/emojis.yml`);

	const output = emojisExist
		? !readFileSync(`${process.cwd()}/emojis.yml`, 'utf8').trim().length
			? emojisConfigDefaults[type]
			: (load(readFileSync(`${process.cwd()}/emojis.yml`, 'utf8')) as emojisConfigTypes)[type] === undefined
			? emojisConfigDefaults[type]
			: (load(readFileSync(`${process.cwd()}/emojis.yml`, 'utf8')) as emojisConfigTypes)[type]
		: emojisConfigDefaults[type];

	return output;
}
