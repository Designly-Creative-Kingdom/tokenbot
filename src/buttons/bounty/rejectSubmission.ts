import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Button } from "../../structures/Button";
import { checkIfCompleted, checkIfPurchased, getBountyByTimestamps, markAsDenied } from "../../schemas/bounty";

export default new Button({
    customId: 'rejectSubmission',
    cooldown: 4000,
    execute: async ({ client, interaction, options }) => {
        const bountyUser = interaction.guild.members.cache.get(interaction.message.embeds[0]?.footer?.text) || await interaction.guild.members.fetch(interaction.message.embeds[0]?.footer?.text);
        if (!bountyUser) {
            await interaction.reply({ embeds: [client.embeds.error('This user is no longer in the server.')] });
            await interaction.update({ components: [] })
            return await interaction.message.reply({ embeds: [client.embeds.attention('This user has left the server.')]});
        };

        const startDate = Number(options[1]);
        const endDate = Number(options[2]);

        await interaction.deferReply()

        const bounty = await getBountyByTimestamps(interaction.guild.id, startDate, endDate);
        if (!bounty) {
            return await interaction.followUp({ embeds: [client.embeds.error('This bounty does not exist.')] });
        }
        const isPurchased = await checkIfPurchased(interaction.guild.id, bounty._id, bountyUser.user.id);
        if (!isPurchased) {
            return await interaction.followUp({ embeds: [client.embeds.error('This user has not purchased the bounty.')] });
        }
        const isCompleted = await checkIfCompleted(interaction.guild.id, bounty._id, bountyUser.user.id);
        if (isCompleted?.status !== 'pending' && isCompleted.status !== undefined) {
            await interaction.followUp({ embeds: [client.embeds.attention(`This bounty has already been looked over and marked as ${isCompleted?.status}.`)] });
            return await interaction.update({ components: [] });
        }

        const leaveFeedbackEmb = new EmbedBuilder()
            .setColor(client.cc.designly)
            .setDescription(`Do you want to provide feedback or additional comments to this user?`);
        const leaveFeedback = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('cltr-yes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cltr-no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
            ]);

        const response = await interaction.followUp({ embeds: [leaveFeedbackEmb], components: [leaveFeedback], ephemeral: true })
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 });
        const userNotice = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`We have an update! Your bounty has been reviewed by ${interaction.user.toString()} and was unfortunately rejected. Thanks for participating in this bounty and better luck next time.`)
            .setColor(client.cc.designly)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
    
        const modNotice = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`This bounty has been reviewed by ${interaction.user.username} and marked as rejected. `);
        let DMerror: boolean;
        
        collector.on('collect', async (collected) => {
            if (collected.customId == 'cltr-yes') {
                const modal = new ModalBuilder()
                    .setTitle('Provide some feedback!')
                    .setCustomId('cltr-feedbackModal')
                    .addComponents([
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents([
                                new TextInputBuilder()
                                    .setCustomId('feedback')
                                    .setLabel('Input feedback')
                                    .setPlaceholder('What do you want to say?')
                                    .setRequired(true)
                                    .setMaxLength(1024)
                                    .setStyle(TextInputStyle.Paragraph)
                            ]),
                    ]);



                await collected.showModal(modal);
                await collected.awaitModalSubmit({ filter: m => m.customId == 'cltr-feedbackModal', time: 60000 })
                    .then(async (m) => {
                        userNotice.addFields({ name: 'Additional Feedback', value: m.fields.getTextInputValue('feedback') });
                        modNotice.addFields({ name: 'Additional Feedback', value: m.fields.getTextInputValue('feedback') });

                        await bountyUser.user.send({ embeds: [userNotice] })
                            .catch(() => {
                                DMerror = true
                            });
                        m.reply({ embeds: [client.embeds.success(DMerror ? `${interaction.user.username} was unable to receive the bounty notification.` : 'Your feedback has been provided to the user.')], ephemeral: true });
                        await markAsDenied(bounty._id, bountyUser.id);
                        await interaction.update({ components: [] });
                        await interaction.message.reply({ embeds: [modNotice], failIfNotExists: false });
                        return collector.stop('complete');
                        
                    }).catch(() => {
                        collected.editReply({ embeds: [client.embeds.attention('You took too long to complete the modal.')] });
                        return collector.stop();
                    });
            } else if (collected.customId == 'cltr-no') {
                await bountyUser.send({ embeds: [userNotice] })
                    .catch(() => {
                        DMerror = true
                    });
                collected.reply({ embeds: [client.embeds.success(DMerror ? `${interaction.user.username} was unable to receive the bounty notification. This bounty has been rejected.` : 'The user has been notified.')], ephemeral: true });
                await interaction.message.edit({ components: [] });
                await interaction.message.reply({ embeds: [modNotice], failIfNotExists: false });
                return collector.stop('complete');
            };
        })
    }
})