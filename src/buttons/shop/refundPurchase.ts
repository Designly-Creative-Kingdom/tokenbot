import { EmbedBuilder } from "discord.js";
import { Button } from "../../structures/Button";
import { getBalance, updateBalance } from "../../schemas/user";

export default new Button({
    customId: 'refundPurchase',
    execute: async ({ client, interaction }) => {
        const user = await interaction.guild.members.fetch(interaction.message.embeds[0]?.fields[0]?.value).catch(() => {

        });
        if (!user) {
            const updateEmb = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor('Grey');
            await interaction.update({ embeds: [updateEmb], components: [] })
            return await interaction.reply({ embeds: [client.embeds.error('This user is no longer in the server.')], ephemeral: true });
        };
        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor('DarkNavy')
            .setTitle(`Refunded | ${interaction.message.embeds[0]?.title}`);
        await interaction.update({ embeds: [updatedEmbed], components: [] });
        const balance = await getBalance(user.user.id);
        await updateBalance(user.user.id, balance.balance - Number(interaction.message.embeds[0]?.fields[2]?.value))
        await interaction.followUp({ embeds: [client.embeds.success(`Refunded ${user.user.username} for their store purchase.`)], ephemeral: true });
        if (interaction.channel.isThread()) {
            await interaction.channel.setArchived(true, `Purchase refunded by ${interaction.user.username}`)
        }
        const refundNotice = new EmbedBuilder()
            .setDescription(`Your purchase of ${interaction.message.embeds[0]?.title} has been refunded. You've had ${interaction.message.embeds[0]?.fields[2]?.value} Nibs${client.cc.nibs} refunded to your Designly account.`)
            .setColor('DarkNavy');
        try {
            user.send({ embeds: [refundNotice] });
        } catch (error) {
            await interaction.followUp({ embeds: [client.embeds.attention(`Unable to notify ${user.user.toString()} via Direct Messages.`)], ephemeral: true })
        }
    }
});