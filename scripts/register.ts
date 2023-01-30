import { REST } from '@discordjs/rest';
import { ApplicationCommandType, Routes } from 'discord-api-types/v10';
import { interactions } from '../src/interactions';
require('dotenv').config();

// @ts-ignore
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN.toString());

(async () => {
	const commands = Object.values(interactions).map((interaction) => {
		if (
			(interaction.type as number) === ApplicationCommandType.User ||
			(interaction.type as number) === ApplicationCommandType.Message
		)
			// @ts-ignore
			delete interaction.description;

		return interaction;
	});
	if (process.env.CLIENT_ID) {
		if (process.env.GUILD_ID === undefined) {
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID?.toString()), {
				body: commands,
			});
			console.log('(/) Registered interactions globally');
		} else {
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
				body: commands,
			});
			console.log('(/) Registered interactions to guild ' + process.env.GUILD_ID);
		}
	} else {
		console.log('Missing Client ID')
	}
})();