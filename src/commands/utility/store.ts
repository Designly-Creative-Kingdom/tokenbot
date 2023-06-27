import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { createItem, editItem, getActive, getAllItems, getItemByID } from '../../schemas/item';
import { Paginator } from '../../structures/Paginator';
import { ActionRowBuilder, EmbedBuilder, GuildTextBasedChannel, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { splitText } from '../../functions/other/splitText';

export default new Command({
    interaction: interactions.store,
    excute: async ({ client, interaction, options }) => {
        const command = options.getSubcommand() as 'add' | 'remove' | 'edit' | 'post' | 'view';
        if (command == 'view') {
            const items = await getAllItems(interaction.guild.id);
            if (items.length == 0) {
                return await interaction.reply({ embeds: [client.embeds.attention('There are no items in the store.')], ephemeral: true });
            };
            const mappedItems = [];
            items.forEach((i) => {
                mappedItems.push(`**Title:** ${i.title}\n**Description:** ${i.description}\n**Cost:** ${i.cost} nibs\n**Active:** ${i.active}\n**ID:** ${i.id}`)
            });
            if (items.length <= 5) {
                const itemsEmbed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name + ' | Items', iconURL: interaction.guild.iconURL() })
                    .setDescription(mappedItems.join('\n\n'))
                    .setFooter({ text: `${mappedItems.length == 1 ? `${mappedItems.length} item` : `${mappedItems.length} items`}` })
                    .setColor(client.cc.designly);
                return await interaction.reply({ embeds: [itemsEmbed], ephemeral: true })
            }

            const itemsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name} | Items`, iconURL: interaction.guild.iconURL() })
                .setDescription('${{array}}')
                .setFooter({ text: '${{currentPage}} / ${{totalPages}} • ' + `${mappedItems.length == 1 ? `${mappedItems.length} item` : `${mappedItems.length} items`}`})
                .setColor(client.cc.designly)

            const pagination = new Paginator();
            pagination.start(interaction, { 
                itemPerPage: 5,
                joinWith: '\n\n',
                embed: itemsEmbed,
                time: 60000,
                array: mappedItems
            });
        } else if (command == 'add') {
            const title = options.getString('title');
            const desc = options.getString('description');
            const cost = options.getInteger('cost');
            await interaction.deferReply({ ephemeral: true })
            await createItem(title, desc, cost, interaction.guild.id)
                .then(async (e) => {
                    return await interaction.followUp({ embeds: [client.embeds.success(`Successfully added new item. Item ID: ${e.id}`)]})
                })
                .catch(async () => {
                    return await interaction.followUp({ embeds: [client.embeds.error('An unknown error occured while trying to create this item. Please wait a few minutes and try again.')], ephemeral: true })
                });
        } else if (command == 'remove') {
            const itemID = options.getString('itemID');
            const item = await getItemByID(itemID);

            if (!item) {
                return await interaction.reply({ embeds: [client.embeds.error('No item was found for the provided ID.')], ephemeral: true });
            }
            await item.delete();
            return await interaction.reply({ embeds: [client.embeds.success('Successfully removed this item from the database.')], ephemeral: true });
        } else if (command == 'post') {
            const channel = options.getChannel('channel') as GuildTextBasedChannel;
            const itemsEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Designly Shop', iconURL: interaction.guild.iconURL() })
                .setDescription(`Welcome to the Designly Shop! Here you can spend the Nibs ${client.cc.nibs} you earn from interacting with the community to purchase various things!`)
                .setImage('https://i.imgur.com/qxb8agt.png')
                .setColor(client.cc.designly);
                const activeItems = await getActive(interaction.guild.id);
                const itemOptions = [] as StringSelectMenuOptionBuilder[];
                activeItems.map((i) => {

                    itemOptions.push(new StringSelectMenuOptionBuilder({ label: i.title, description: splitText(i.description, 100), value: i.id, default: false, emoji: client.cc.nibs }))
                })

                const itemShopRow = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents([
                    new StringSelectMenuBuilder()
                        .setPlaceholder('Choose an item!')
                        .setCustomId('itemShop')
                        .addOptions(itemOptions)
                ]);
            
            await channel.send({ embeds: [itemsEmbed], components: [itemShopRow] });
        } else if (command == 'edit') {
            const id = options.getString('id');
            const active = options.getBoolean('active');
            const title = options.getString('title');
            const description = options.getString('description');
            const price = options.getInteger('price');

            const item = await getItemByID(id);
            if (!item) {
                return await interaction.reply({ embeds: [client.embeds.error('No item was found for the ID provided.')], ephemeral: true });
            };

            const updatedItem = await editItem(id, active || item.active, title, description, price);
            const newItemEmbed = new EmbedBuilder()
                .setTitle(updatedItem.title)
                .setDescription(updatedItem.description)
                .addFields(
                    { name: 'Price', value: `${updatedItem.cost} ${client.cc.nibs}`},
                    { name: 'Item Status', value: `Item Status: ${updatedItem.active ? 'Active' : 'Inactive'}`}
                )
                .setColor(updatedItem.active ? 'Green' : 'Red')
                .setFooter({ text: `Item ID: ${updatedItem.id}`});
            
            return await interaction.reply({ embeds: [newItemEmbed], content: 'View the updated item below.', ephemeral: true });
        }
    }
});