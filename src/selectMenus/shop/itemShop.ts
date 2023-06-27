import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ForumChannel, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getItemByID } from "../../schemas/item";
import { SelectMenu } from "../../structures/selectMenu";
import { getBalance, updateBalance } from "../../schemas/user";

export default new SelectMenu({
    customId: 'itemShop',
    permission: ['SendMessages'],
    execute: async ({ client, interaction }) => {
        const itemID = interaction.values[0];
        const item = await getItemByID(itemID);
        if (!item) {
            return await interaction.reply({ embeds: [client.embeds.error('This item does not exist. Notify a staff member!')], ephemeral: true });
        }
        const itemEmbed = new EmbedBuilder()
            .setTitle(item.title)
            .setDescription(item.description)
            .setColor('#2BA2F4')
            .setFooter({ text: `${item.cost} Nibs`, iconURL: 'https://i.imgur.com/hDbBrH5.png' });
        
        const options = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('cltr-cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('cltr-purchase')
                    .setLabel('Purchase')
                    .setStyle(ButtonStyle.Success)
            ]);

        const response = await interaction.reply({ embeds: [itemEmbed], components: [options], ephemeral: true })
        const collector = response.createMessageComponentCollector({ time: 10000, componentType: ComponentType.Button, filter: c => c.user.id == interaction.user.id });
        collector.on('collect', async (c) => {
            const custom_id = c.customId as 'cltr-cancel' | 'cltr-purchase';
            if (custom_id == 'cltr-cancel') {
                await c.update({ components: [] });
            } else if (custom_id == 'cltr-purchase') {
                const user = await getBalance(interaction.user.id);
                if (item.cost > user.balance) {
                    await c.reply({ embeds: [client.embeds.attention(`You only have ${user.balance} Nibs${client.cc.nibs}. To purchase this item, you require ${item.cost} Nibs${client.cc.nibs}!`)], ephemeral: true });
                    return;
                };
                const modal = new ModalBuilder()
                    .setTitle('Include a note')
                    .setCustomId('cltr-purchaseInfo')
                    .addComponents([
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents([
                                new TextInputBuilder()
                                    .setCustomId('note')
                                    .setPlaceholder('Provide any additional info!')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setLabel('Write your note here!')
                            ])
                    ])
                await c.showModal(modal);
                c.awaitModalSubmit({ filter: m => m.user.id == c.user.id && m.customId === modal.data.custom_id, time: 60000 })
                    .then(async (m) => {
                        const note = m.fields.getTextInputValue('note');
                        await m.reply({ embeds: [client.embeds.success(`You've purchases **${item.title}**. If applicable, staff will get in contact with you. For any questions open a ticket`)], ephemeral: true });
                        const purchaseEmbed = new EmbedBuilder()
                            .setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                            .setTitle(item.title)
                            .setDescription(`${interaction.user.username} purchased ${item.title} for ${item.cost} Nibs.`)
                            .addFields(
                                { name: 'User ID', value: interaction.user.id },
                                { name: 'Note', value: note },
                                { name: 'Nibs', value: `${item.cost}` }
                            )
                            .setColor('Gold')
                        const purchaseRow = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents([
                                new ButtonBuilder()
                                    .setCustomId('completePurchase')
                                    .setLabel('Complete')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('refundPurchase')
                                    .setLabel('Refund')
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId('rejectPurchase')
                                    .setLabel('Reject')
                                    .setStyle(ButtonStyle.Danger)
                            ]);
                        const thread = await interaction.guild.channels.fetch(client.config.logging.loggingThread) as ForumChannel;
                        const purchaseChannel = await thread.threads.fetch(client.config.logging.purchases);
                        try {
                            await purchaseChannel.send({ embeds: [purchaseEmbed], components: [purchaseRow] });
                            await updateBalance(interaction.user.id, user.balance - item.cost);
                            
                        } catch {
                            return await m.followUp({ embeds: [client.embeds.error('Unable to log store purchase. You will not be charged for this purchase. Please notify a staff member immediately.')]})
                        };
                });
            };
        });
        collector.on('end', async () => {
            interaction.editReply({ components: [] })
        })
    },
});