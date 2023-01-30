import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SelectMenu } from "../../structures/selectMenu";

export default new SelectMenu({
    customId: 'skillLevel',
    execute: async ({ interaction, values }) => {
        const modal = new ModalBuilder()
            .setCustomId(`jobSubmit-${values[0]}`)
            .setTitle('Post a Job!')
           .setComponents(
                [
                    new ActionRowBuilder<TextInputBuilder>()
                        .setComponents([
                            new TextInputBuilder()
                                .setCustomId('title')
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(200)
                                .setRequired(true)
                                .setPlaceholder('Choose a title for this job posting.')
                                .setLabel('Job Title')
                        ]),
                    
                    new ActionRowBuilder<TextInputBuilder>()
                        .setComponents([
                            new TextInputBuilder()
                                .setCustomId('description')
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                                .setMaxLength(2048)
                                .setPlaceholder('Set a description for this job posting.')
                                .setLabel('Job Description')
                        ]),
                    
                    new ActionRowBuilder<TextInputBuilder>()
                        .setComponents([
                            new TextInputBuilder()
                                .setCustomId('budget')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                                .setMaxLength(4)
                                .setPlaceholder('(eg. $100)')
                                .setLabel('Budget ($5 Minimum)')
                        ]),
                    
                    new ActionRowBuilder<TextInputBuilder>()
                        .setComponents([
                            new TextInputBuilder()
                                .setCustomId('dueDate')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(false)
                                .setMaxLength(100)
                                .setPlaceholder('(eg. January 1st, 2024)')
                                .setLabel('Job Due Date')
                        ]),
                ]);
    await interaction.showModal(modal)
    }
})