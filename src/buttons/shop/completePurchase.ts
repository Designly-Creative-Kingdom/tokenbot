import { EmbedBuilder } from "discord.js";
import { Button } from "../../structures/Button";

export default new Button({
    customId: 'completePurchase',
    execute: async ({ client, interaction }) => {
        const user = await interaction.guild.members.fetch(interaction.message.embeds[0]?.fields[0]?.value);
        if (!user) {
            const updateEmb = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor('Grey');
            await interaction.update({ embeds: [updateEmb], components: [] })
            return await interaction.reply({ embeds: [client.embeds.error('This user is no longer in the server.')], ephemeral: true });
        };
        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor('Green')
            .setTitle(`Completed | ${interaction.message.embeds[0]?.title}`);
        await interaction.update({ embeds: [updatedEmbed], components: [] });
        await interaction.followUp({ embeds: [client.embeds.success(`Marked ${user.user.username}'s store purchase as completed.`)], ephemeral: true });
        if (interaction.channel.isThread()) {
            await interaction.channel.setArchived(true, `Purchase completed by ${interaction.user.username}`)
        }
        const acceptionNotice = new EmbedBuilder()
            .setDescription(`Your purchase of ${interaction.message.embeds[0]?.title} has been completed. Contact ${interaction.user.toString()} for more information.`)
            .setColor('Green');
        try {
            user.send({ embeds: [acceptionNotice] });
        } catch (error) {
            await interaction.followUp({ embeds: [client.embeds.attention(`Unable to notify ${user.user.username} via Direct Messages.`)], ephemeral: true })
        }
    }
});