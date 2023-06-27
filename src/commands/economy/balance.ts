import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { getBalance } from '../../schemas/user';

export default new Command({
    interaction: interactions.balance,
    excute: async ({ client, interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const user = await getBalance(interaction.user.id);
        if (user) {
            return interaction.editReply({ embeds: [{ description: `Your current balance is ${user.balance} Designly Nibs™`}] });
        } else {
            return interaction.editReply({ embeds: [client.embeds.error('You don\'t currently have an account balance.')] })
        }
    }
})