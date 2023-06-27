import { Collection, CommandInteractionOptionResolver, EmbedBuilder, GuildMember } from 'discord.js';
import { client } from '../..';
import { Event } from '../../structures/Event';

const cooldown = new Collection<string, number>();
const buttonCooldown = new Collection<String, number>();

export default new Event('interactionCreate', async (interaction) => {
	if (!interaction.inGuild()) return;
	if (!interaction.inCachedGuild()) return;
	const member = interaction.member as GuildMember;

	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command)
			return interaction.reply({
				embeds: [client.embeds.error(`There was no command found for **${interaction.commandName}**.`)],
				ephemeral: true,
			});

		// Permission Check
		if (command.interaction.permission?.some((perm) => !member.permissions.has(perm)))
			return interaction.reply({
				embeds: [
					{
						description: "You don't have permissions to use this command.",
						color: 0xCC0000,
					}], ephemeral: true,
			});

		// Cooldowns
		if (cooldown.has(`${command.interaction.name}${interaction.user.id}`)) {
			const remainingCooldown = cooldown.get(`${command.interaction.name}${interaction.user.id}`)
			const cooldownEmbed = new EmbedBuilder()
				.setColor(0xCC0000)
				.setDescription(`You can use this command again <t:${Math.floor(remainingCooldown / 1000)}:R>`);

			return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		}

		await command.excute({
			client: client,
			interaction: interaction,
			options: interaction.options as CommandInteractionOptionResolver,
		});

		if (command.interaction.cooldown) {
			cooldown.set(
				`${command.interaction.name}${interaction.user.id}`,
				Date.now() + command.interaction.cooldown
			);
			setTimeout(() => {
				cooldown.delete(`${command.interaction.name}${interaction.user.id}`);
			}, command.interaction.cooldown);
		}
	}
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) {
			return await interaction.respond([])
		} else { 
			return await command.autocomplete({
				client: client,
				interaction: interaction
			});
		}
	}
	if (interaction.isButton()) {
		if (interaction.customId.startsWith('cltr')) return;
		const buttonName = interaction.customId.split('-')[0];
		const button = client.buttons.get(buttonName);

		if (!button) return;

		if (button.permission?.some((perm) => !member.permissions.has(perm))) {
			return interaction.reply({
				embeds: [
					{
						description: "You don't have permissions to use this command.",
						color: 0xCC0000,
					}], ephemeral: true,
			});
		};
		
		if (buttonCooldown.has(`${button.customId}${interaction.user.id}`)) {
			const remainingCooldown = buttonCooldown.get(`${button.customId}${interaction.user.id}`)
			const cooldownEmbed = new EmbedBuilder()
				.setColor(0xCC0000)
				.setDescription(`You can use this button again <t:${Math.floor(remainingCooldown / 1000)}:R>`);

			return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		};
		if (button.cooldown) {
			buttonCooldown.set(
				`${button.customId}${interaction.user.id}`,
				Date.now() + button.cooldown
			);
			setTimeout(() => {
				buttonCooldown.delete(`${button.customId}${interaction.user.id}`);
			}, button.cooldown);
		};
		await button.execute({
			client: client,
			interaction: interaction,
			options: interaction.customId.split('-')
		});
	};
	if (interaction.isAnySelectMenu()) {
		const selectMenuName = interaction.customId.split('-')[0];
		const values = interaction.values;
		
		const selectMenu = client.menus.get(selectMenuName);

		if (!selectMenu) return;

		if (selectMenu.permission?.some((perm) => !member.permissions.has(perm))) {
			return interaction.reply({
				embeds: [
					{
						description: "You don't have the proper permissions to use this modal.",
						color: 0xCC0000,
					}], ephemeral: true,
			});
		};
		await selectMenu.execute({
			client: client,
			interaction: interaction,
			values: values,
			options: interaction.customId.split('-')
		});
	};
	if (interaction.isModalSubmit()) {
		if (interaction.customId.startsWith('cltr')) return;
		const modalName = interaction.customId.split('-')[0];
		const fields = interaction.fields;
		
		const modal = client.modals.get(modalName);

		if (!modal) return;

		if (modal.permission?.some((perm) => !member.permissions.has(perm))) {
			return interaction.reply({
				embeds: [
					{
						description: "You don't have the proper permissions to use this modal.",
						color: 0xCC0000,
					}], ephemeral: true,
			});
		};

		await modal.execute({
			client: client,
			interaction: interaction,
			fields: fields,
			options: interaction.customId.split('-')
		})
	}
});
