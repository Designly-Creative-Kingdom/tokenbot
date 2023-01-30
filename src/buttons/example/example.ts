import { Button } from "../../structures/Button";

export default new Button({
    customId: 'example',
    permission: [],
    cooldown: 1000,
    execute: async ({ interaction }) => {
        return interaction.reply({ content: 'Example Button'})
    }
});