import { EmbedBuilder } from "discord.js";
import { checkIfPurchased, getBountyByTimestamps, purchaseBounty } from "../../schemas/bounty";
import { getBalance, updateBalance } from "../../schemas/user";
import { Button } from "../../structures/Button";

export default new Button({
    customId: 'purchaseBounty',
    permission: ['SendMessages'],
    cooldown: 15000,
    execute: async ({ client, interaction, options }) => {
        const startDate = Number(options[1]);
        const endDate = Number(options[2]);

        await interaction.deferReply({ ephemeral: true });
        const bounty = await getBountyByTimestamps(interaction.guild.id, startDate, endDate);
        const alreadyBought = await checkIfPurchased(interaction.guild.id, bounty._id, interaction.user.id);
        
        if (alreadyBought) {
            return interaction.followUp({ embeds: [client.embeds.attention(`You\'ve already purchased this bounty! Press the **info** button to view more details about this bounty or use /submit to send in your completed work!`)], ephemeral: true  })
        } else {
            const user = await getBalance(interaction.user.id);
            if (Number(bounty.cost) > user.balance) {
                return interaction.followUp({ embeds: [client.embeds.attention(`Uh oh! Looks like you don\'t have enough nibs to purchase this bounty.`)], ephemeral: true })
            }
            await updateBalance(interaction.user.id, user.balance - Number(bounty.cost));
            await purchaseBounty(interaction.guild.id, bounty._id, interaction.user.id);
            await interaction.followUp({ embeds: [client.embeds.success(`You\'ve purchased this bounty for ${bounty.cost} nibs! Complete and submit this bounty to get a 200% ROI!`)], ephemeral: true });
            const bountyEmbed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: `Bounty Info`, iconURL: interaction.guild.iconURL() })
                .setTitle(bounty.title)
                .setDescription(bounty.description)
                .addFields(
                    { name: 'Start Date', value: `<t:${bounty.startDate}:F>`, inline: false },
                    { name: 'End Date', value: `<t:${bounty.endDate}:F>`, inline: false },
                    { name: 'Cost', value: `${bounty.cost} nibs`, inline: false },
                )
                .setFooter({ text: `⚠️ Don\'t share this bounty info with anyone, doing so could result in a punishment!` })
            return await interaction.followUp({ embeds: [bountyEmbed], ephemeral: true });
        }
    }
});