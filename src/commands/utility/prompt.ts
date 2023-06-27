import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getGuild } from '../../schemas/guild';

export default new Command({
    interaction: interactions.prompt,
    excute: async ({ client, interaction, options }) => {
        const command = options.getSubcommand();
        if (command == 'set') {
            const guild = await getGuild(interaction.guild.id)
            const modal = new ModalBuilder()
                .setTitle('Set the prompt')
                .setCustomId('setPrompt')
                .setComponents([
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('prompt')
                                .setLabel('Set the prompt')
                                .setPlaceholder('What do you want the prompt to be?')
                                .setMaxLength(256)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        ])
                ]);
            await interaction.showModal(modal);
            await interaction.awaitModalSubmit({ time: 120000, filter: m => m.customId == 'setPrompt' })
                .then(async (m) => {
                    await interaction.reply({ embeds: [client.embeds.success(`Updated the prompt to ${m.fields.getTextInputValue('prompt')}`)], ephemeral: true });
                    guild.prompt = m.fields.getTextInputValue('prompt');
                    return await guild.save();
                })
        } else if (command == 'view') {
            const guild = await getGuild(interaction.guild.id);
            return await interaction.reply({ embeds: [{ color: client.cc.invisible, description: `The current prompt is: ${guild.prompt}.`}]})
        }
    }
})