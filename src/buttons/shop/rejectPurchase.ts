import { EmbedBuilder } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
    customId: 'rejectPurchase',
    execute: async ({ client, interaction }) => {
        const user = await interaction.guild.members.fetch(interaction.message.embeds[0]?.fields[0]?.value);
        if (!user) {
            const updateEmb = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor('Grey');
            await interaction.update({ embeds: [updateEmb], components: [] })
            return await interaction.reply({ embeds: [client.embeds.error('This user is no longer in the server.')], ephemeral: true });
        };
        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor('Red')
            .setTitle(`Rejected | ${interaction.message.embeds[0]?.title}`);
        await interaction.update({ embeds: [updatedEmbed], components: [] });
        await interaction.followUp({ embeds: [client.embeds.success(`Rejected ${user.user.username}'s store purchase.`)], ephemeral: true });
        if (interaction.channel.isThread()) {
            await interaction.channel.setArchived(true, `Purchase rejected by ${interaction.user.username}`)
        }
        const rejectionNotice = new EmbedBuilder()
            .setDescription(`Your purchase of ${interaction.message.embeds[0]?.title} has been rejected. Contact ${interaction.user.toString()} for more information.`)
            .setColor('Red');
        try {
            user.send({ embeds: [rejectionNotice] });
        } catch (error) {
            await interaction.followUp({ embeds: [client.embeds.attention(`Unable to notify ${user.user.username} via Direct Messages.`)], ephemeral: true })
        }
    }
});