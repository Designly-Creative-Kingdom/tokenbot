import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { getBalance, updateBalance } from '../../schemas/user';

export default new Command({
    interaction: interactions.bank,
    excute: async ({ client, interaction, options }) => {
        const subcommand = options.getSubcommand();
        const silent = options.getBoolean('silent') || false;
        await interaction.deferReply({ ephemeral: silent });
        if (subcommand == 'give') {
            const member = options.getUser('user');
            const amount = options.getInteger('nibs');
            const user = await getBalance(member.id);

            const updatedBalance = client.embeds.success(`Added ${amount} to ${member.toString()}\'s bank. Their new balance is ${user.balance + amount} Nibs${client.cc.nibs}.`)
            await updateBalance(member.id, user.balance + amount);
            return interaction.followUp({ embeds: [updatedBalance] });
        } else if (subcommand == 'remove') {
            const member = options.getUser('user');
            const amount = options.getInteger('nibs');
            const user = await getBalance(member.id);;

            const updatedBalance = client.embeds.success(`Removed ${amount} from ${member.toString()}\'s bank. Their new balance is ${user.balance - amount} Nibs${client.cc.nibs}.`)
            await updateBalance(member.id, user?.balance - amount); 
            return interaction.followUp({ embeds: [updatedBalance] });
        } else if (subcommand == 'set') {
            const member = options.getUser('user');
            const amount = options.getInteger('nibs');
            const user = await getBalance(member.id);

            const updatedBalance = client.embeds.success(`Successfully set ${member.toString()}\'s account balance to ${amount}. Their previous balance was ${user.balance} Nibs${client.cc.nibs}.`);
            await updateBalance(member.id, amount);
            return await interaction.followUp({ embeds: [updatedBalance] })
        }
    }
})