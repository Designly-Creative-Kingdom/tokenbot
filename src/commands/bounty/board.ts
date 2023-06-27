import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { ActionRowBuilder, EmbedBuilder, GuildTextBasedChannel, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getGuild } from '../../schemas/guild';
import { createBounty, getCurrentBounty, getUpcomingBounties } from '../../schemas/bounty';
import { getNextBounty } from '../../schemas/bounty';
import { checkBounties } from '../../jobs/checkBounties';
import { Paginator } from '../../structures/Paginator';

export default new Command({
    interaction: interactions.board,
    excute: async ({ client, interaction, options }) => {
        const command = options.getSubcommandGroup() ? `${options.getSubcommandGroup()} ${options.getSubcommand()}` : options.getSubcommand();
        if (!['bounties add'].includes(command)) await interaction.deferReply({ ephemeral: true });
        const guild = await getGuild(interaction.guild.id);
        if (command == 'refresh') {
            if (Date.now() - guild.bounty.lastRefreshed <= 120000) { // Checks if the board was refreshed in the last 15 minutes.
                return interaction.followUp({ embeds: [client.embeds.error(`The board was last refreshed at: <t:${guild.bounty.lastRefreshed}:R>. Please wait until <t:${guild.bounty.lastRefreshed + 120000} before running this command again.`)] })
            }
            await interaction.followUp({ embeds: [client.embeds.success('Refreshing bounty board.')] });
            await checkBounties();
        } else if (command == 'setup') {
            const channel = options.getChannel('channel') as GuildTextBasedChannel;
            if (guild.bounty?.channel == channel.id) {
                return await interaction.followUp({ embeds: [client.embeds.attention(`The bounty board is already configured in this channel!`)], ephemeral: true });
            } if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'EmbedLinks'])) {
                return await interaction.followUp({ embeds: [client.embeds.attention('I don\'t have permission to send messages or embed links in this channel. Grant me those permissions then try again!')], ephemeral: true });
            } else {
                const currentBounty = await getCurrentBounty(interaction.guild.id)
                guild.bounty.channel = channel.id;
                const bountyBoard = new EmbedBuilder()
                    .setColor('DarkAqua')
                    .setTitle('Bounty Board')
                    .setImage('https://i.imgur.com/3F4Xomv.png')
                    .setTimestamp();
                if (currentBounty) {
                    bountyBoard.setDescription(`Here's what we know about this week's bounty: ${currentBounty.basicInfo}`);
                } else if (!currentBounty) {
                    const nextBounty = await getNextBounty(interaction.guild.id)
                    bountyBoard.setDescription(`The next bounty isn't ready for you yet. ${nextBounty ? `Check for the next bounty on <t:${nextBounty.startDate}:D> at <t:${nextBounty.startDate}:t>!` : `Check back soon!`}`)
                }

                const bountyMessage = await channel.send({ embeds: [bountyBoard] });
                guild.bounty.messageID = bountyMessage.id;
                await interaction.followUp({ embeds: [client.embeds.success(`The bounty board has been successfully configured and is now active in ${channel.toString()}.`)]})
                return await guild.save()
            }
        } else if (command == 'bounties add') {
            const modal = new ModalBuilder()
                .setTitle('Create a Bounty!')
                .setCustomId('cltr-newBounty')
                .addComponents([
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('title')
                                .setLabel('Bounty Title')
                                .setPlaceholder('What should the title of the bounty be?')
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(256)
                                .setRequired(true)
                        ]),
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('description')
                                .setLabel('Bounty Description')
                                .setPlaceholder('What should the description of the bounty be?')
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(4000)
                                .setRequired(true)
                        ]),
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('cost')
                                .setLabel('Bounty Cost')
                                .setPlaceholder('What should the cost of the bounty be? (i.e 10)')
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(10)
                                .setRequired(true)
                        ]),
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('basicInfo')
                                .setLabel('Bounty Basic Info')
                                .setPlaceholder('Provide some basic info about the bounty for people who haven\'t purchased it yet.')
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(200)
                                .setRequired(true)
                        ]),
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId('time')
                                .setLabel('Bounty Timestamps')
                                .setPlaceholder('When should this bounty start and end?')
                                .setStyle(TextInputStyle.Short)
                        ]) 
                ]);
            await interaction.showModal(modal);
            await interaction.awaitModalSubmit({ time: 120000 })
                .then(async (m) => {
                    const title = m.fields.getTextInputValue('title');
                    const description = m.fields.getTextInputValue('description');
                    const cost = Number(m.fields.getTextInputValue('cost'));
                    const basicInfo = m.fields.getTextInputValue('basicInfo');
                    const timestamps = m.fields.getTextInputValue('time').split(' - ');
                    const ts1 = Number(timestamps[0]);
                    const ts2 = Number(timestamps[1]);

                    if (isNaN(cost)) {
                        return m.reply({ embeds: [client.embeds.error('The cost provided was not a valid number. Please provide a valid number and try again.')], ephemeral: true });
                    }

                    if (isNaN(ts1) || isNaN(ts2)) {
                        return m.reply({ embeds: [client.embeds.error('One of the timestamps provided was not a valid number. Please correct this timestamp, and re-submit this bounty.')], ephemeral: true });
                    }
                    // @ts-ignore
                    await createBounty(interaction.guild.id, title, description, cost, basicInfo, timestamps[0], timestamps[1])
                    await m.reply({ embeds: [client.embeds.success(`New bounty added! This bounty will go live at <t:${timestamps[0]}:F> and end at <t:${timestamps[1]}:F>`)] })
                })
            .catch();
            return await checkBounties();
        } else if (command == 'bounties upcoming') {
            const upcomingBounties = await getUpcomingBounties(interaction.guild.id);
            if (upcomingBounties.length == 0) {
                return await interaction.followUp({ embeds: [client.embeds.attention('There are no upcoming bounties.')], ephemeral: true })
            }
            if (upcomingBounties.length == 1) {
                const bountyEmbed = new EmbedBuilder()
                    .setTitle(upcomingBounties[0].title)
                    .setDescription(`${upcomingBounties[0].description}`)
                    .addFields(
                        { name: 'Start Time', value: `<t:${upcomingBounties[0].startDate}:f>` },
                        { name: 'End Time', value: `<t:${upcomingBounties[0].endDate}:f>`},
                        { name: 'ID', value: upcomingBounties[0].id }
                        )
                    .setImage('https://i.imgur.com/3F4Xomv.png')
                    .setColor('DarkAqua');
                return await interaction.followUp({ embeds: [bountyEmbed], ephemeral: true })
            } else {
                const mappedBounties = [];
                upcomingBounties.forEach((b) => {
                    mappedBounties.push(`**Title:** ${b.title}\n**Description:** ${b.description}\n**Start Time:** <t:${b.startDate}:f>\n**End Time:** <t:${b.endDate}:f>\n**ID:** ${b.id}`)
                })
                const itemsEmbed = new EmbedBuilder()
                    .setDescription('${{array}}')
                    .setColor(client.cc.designly)
                    .setFooter({ text: '${{currentPage}} / ${{totalPages}} entires' });
                const pagination = new Paginator();
                pagination.start(interaction, {
                    itemPerPage: 1,
                    embed: itemsEmbed,
                    joinWith: '\n',
                    time: 60000,
                    array: mappedBounties
                })
            }
        }
    }
})