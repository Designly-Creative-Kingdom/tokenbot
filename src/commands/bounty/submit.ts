import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { checkIfCompleted, checkIfPurchased, getCurrentBounty, markAsPending } from '../../schemas/bounty';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ForumChannel } from 'discord.js';

export default new Command({
    interaction: interactions.submit,
    excute: async ({ client, interaction, options }) => {
        const attachments = options.getAttachment('files');
        const link = options.getString('link');

        await interaction.deferReply({ ephemeral: true });
        
        const bounty = await getCurrentBounty(interaction.guild.id);

        if (!bounty) {
            return interaction.followUp({ embeds: [client.embeds.attention('There is no bounty currently active for you to submit work to.')] });
        }

        const isPurchased = await checkIfPurchased(interaction.guild.id, bounty._id, interaction.user.id);

        if (!isPurchased) {
            return await interaction.reply({ embeds: [client.embeds.attention('You must purchase this bounty first!')] });
        }

        const completedCheck = await checkIfCompleted(interaction.guild.id, bounty._id, interaction.user.id);

        if (completedCheck) {
            return await interaction.followUp({ embeds: [client.embeds.error(completedCheck?.status == 'pending' ? `You've already submitted this bounty. If you forgot to submit something, ask a member of the staff team to delete your submission.` : `You've already submitted this bounty, and it's been **${completedCheck.status}**! Thanks for participating in this bounty, and keep an eye on the bounty channel for the next one!`)] });
        } else {
            if (!attachments && !link) {
                return await interaction.followUp({ embeds: [client.embeds.error(`You need to submit either an attachment or a link.`)] });
            }
            const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
            if (link && !httpRegex.test(link)) {
                return interaction.followUp({ embeds: [client.embeds.error('Invalid link. Make sure your link starts with **https://**.')] });
            }
            const submissionsLog = await interaction.guild.channels.fetch(client.config.logging.submissions) as ForumChannel;
            if (submissionsLog) {
                const submissionEmbed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle('New Bounty Submission')
                    .setDescription(`${interaction.user.username} has submitted their work for the following prompt: **${bounty.title}**. ${link ? `[Click here](${link}) (${link}) to view the files for this bounty.` : ''}${attachments ? 'Find the attached files below.' : ' '}`)
                    .setFooter({ text: interaction.user.id })
                    .setTimestamp();

                const submissionsRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
                            .setCustomId(`acceptSubmission-${bounty.startDate}-${bounty.endDate}`)
                            .setLabel(`Accept`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`rejectSubmission-${bounty.startDate}-${bounty.endDate}`)
                            .setLabel (`Reject`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`deleteSubmission-${bounty.startDate}-${bounty.endDate}`)
                            .setLabel(`Refund`)
                            .setStyle(ButtonStyle.Secondary)
                    ])
                await submissionsLog.threads.create({ name: `@${interaction.user.username} - ${bounty.title}`, message: { embeds: [submissionEmbed], components: [submissionsRow], files: attachments?.size > 0 ? [attachments]  : null }}).then((e) => e.send({ content: `This bounty closes on <t:${bounty.endDate}:F>`}))
                await interaction.followUp({ embeds: [client.embeds.success('Your bounty has been submitted! Thanks for participating, and you will receive an update shortly.')] });
                return await markAsPending(bounty._id, interaction.user.id);
            } else {
                return interaction.followUp({ embeds: [client.embeds.attention('There is no submissions log set up. Please notify an admin.')] });
            }
        }
    }
})