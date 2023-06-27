import { Colors, ThreadChannel } from "discord.js";
import { checkIfCompleted, deleteSubmission, getBountyByTimestamps } from "../../schemas/bounty";
import { Button } from "../../structures/Button";
import { getBalance, updateBalance } from "../../schemas/user";

export default new Button({
    customId: 'deleteSubmission',
    cooldown: 5000,
    execute: async ({ client, interaction, options }) => {
        const bountyUser = interaction.guild.members.cache.get(interaction.message.embeds[0]?.footer?.text) || await interaction.guild.members.fetch(interaction.message.embeds[0]?.footer?.text);
        if (!bountyUser) {
            await interaction.reply({ embeds: [client.embeds.error('This user is no longer in the server.')] });
            await interaction.update({ components: [] })
            return await interaction.message.reply({ embeds: [client.embeds.attention('This user has left the server.')]});
        }
        const startDate = Number(options[1]);
        const endDate = Number(options[2]);

        await interaction.deferReply();
        const bounty = await getBountyByTimestamps(interaction.guild.id, startDate, endDate);
        if (!bounty) {
            return await interaction.followUp({ embeds: [client.embeds.error('This bounty does not exist.') ]})
        }
        const completed = await checkIfCompleted(interaction.guild.id, bounty._id, bountyUser.id);
        if (completed.status !== 'pending') {
            return await interaction.followUp({ embeds: [client.embeds.attention(`This bounty has already been marked as ${completed.status}. Please contact a member of the dev team to adjust this bounty.`)],  })
        } else {
            await deleteSubmission(bounty._id, bountyUser.id);
            try {
                await bountyUser.send({ embeds: [{ title: `${bounty.title}`, description: `Your submission for ${bounty.title} has been deleted by ${interaction.user.toString()}. You have been refunded your nibs and can now resubmit this bounty.`, color: Colors.DarkRed }] });
                await interaction.followUp({ embeds: [client.embeds.success(`${bountyUser.toString()} has been notified that their submission was deleted.`)], ephemeral: true });
                const balance = await getBalance(bountyUser.id);
                await updateBalance(bountyUser.id,  Number(bounty.cost) + balance.balance);
                try {
                    const thread = interaction.channel as ThreadChannel;
                    thread.delete();
                } catch (err) {

                }
            } catch (err) {
                return await interaction.followUp({ embeds: [client.embeds.attention(`${bountyUser.toString()} was not able to be notified. This submission has been deleted.`)]})
            }
        }
    }
})