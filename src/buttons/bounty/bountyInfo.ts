import { EmbedBuilder } from "discord.js";
import { checkIfPurchased, getBountyByTimestamps } from "../../schemas/bounty";
import { Button } from "../../structures/Button";

export default new Button({
    customId: 'bountyInfo',
    permission: ['SendMessages'],
    cooldown: 15000,
    execute: async ({ client, interaction, options }) => {
        const startDate = Number(options[1]);
        const endDate = Number(options[2]);

        await interaction.deferReply({ ephemeral: true });
        const bounty = await getBountyByTimestamps(interaction.guild.id, startDate, endDate);
        const alreadyBought = await checkIfPurchased(interaction.guild.id, bounty._id, interaction.user.id);

        if (!alreadyBought) {
            return interaction.followUp({ embeds: [client.embeds.attention(`In order to view information about a bounty, you need to purchase that bounty. Try purchasing the bounty, then coming back!`)], ephemeral: true });
        } else {
            const bountyEmbed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: `Bounty Info`, iconURL: interaction.guild.iconURL() })
                .setTitle(bounty.title)
                .setDescription(bounty.description)
                .addFields(
                    { name: 'Start Date', value: `<t:${bounty.startDate}:F>`, inline: false },
                    { name: 'End Date', value: `<t:${bounty.endDate}:F>`, inline: false },
                    { name: 'Cost', value: `${bounty.cost} tokens`, inline: false },
                )
                .setFooter({ text: `⚠️ Don\'t share this bounty info with anyone, doing so could result in a punishment!` })
            await interaction.followUp({ embeds: [bountyEmbed], ephemeral: true });
        }
    }
});