import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { getBalance } from '../../schemas/user';
import { ActionRowBuilder, EmbedBuilder, ForumChannel, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getGuild } from '../../schemas/guild';

export default new Command({
    interaction: interactions.checkin,
    excute: async ({ client, interaction }) => {
        function checkIfWeekPassed(lastChecked: number) {
            const now = new Date();
            const lastCheckedTime = new Date(lastChecked * 1000)
            const timeDiff = now.getTime() - lastCheckedTime.getTime();
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays >= 7
        }
        const user = await getBalance(interaction.user.id);
        const check = checkIfWeekPassed(user.lastCheckIn);
        if (!check) {
            return await interaction.reply({ embeds: [client.embeds.attention(`You can only check in once a week! You last checked in on <t:${user.lastCheckIn}:f>`)], ephemeral: true });
        };
        const guild = await getGuild(interaction.guild.id);
        if (!guild.prompt) {
            return await interaction.reply({ embeds: [client.embeds.error('There is no prompt configured! Contact a staff member to have a prompt set.')], ephemeral: true });
        }
        const modal = new ModalBuilder()
            .setTitle('Complete the prompt!')
            .setCustomId('checkinPrompt')
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                            .setCustomId('response')
                            .setLabel(guild.prompt)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(500)
                            .setPlaceholder('Complete the prompt to gain your nibs!')
                            .setRequired(true)
                    ])
            ]);
        await interaction.showModal(modal);
        await interaction.awaitModalSubmit({ time: 60000, filter: m => m.user.id == interaction.user.id && m.customId == 'checkinPrompt' })
            .then(async (m) => {
                await m.reply({ content: `Congrats on completing your prompt! You\'ve earned 1000 ${client.cc.nibs}!` });
                user.balance += 1000;
                user.lastCheckIn = Math.floor(Date.now() / 1000)
                await user.save();

                const thread = await interaction.guild.channels.fetch(client.config.logging.loggingThread) as ForumChannel;
                const checkInChannel = await thread.threads.fetch(client.config.logging.checkInResponses);
                try {
                    const checkInEmbed = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`${interaction.user.toString()} has completed a prompt and received 1000 nibs.`)
                        .addFields({ name: 'Prompt', value: guild.prompt }, { name: 'Response', value: m.fields.getTextInputValue('response')});
                    await checkInChannel.send({ embeds: [checkInEmbed] });
                } catch (e) {

                }
            })
    }
})