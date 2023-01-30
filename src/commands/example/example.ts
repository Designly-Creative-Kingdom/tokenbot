import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';

export default new Command({
    interaction: interactions.example,
    excute: async ({ interaction }) => {
		return interaction.reply({ content: 'Example Command' });
	}
})