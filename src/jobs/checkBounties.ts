import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildTextBasedChannel } from "discord.js";
import { client } from "..";
import { getCurrentBounty, getNextBounty } from "../schemas/bounty";
import { getGuild } from "../schemas/guild";

export async function checkBounties() {
    const guild = client.guilds.cache.get(client.config.general.guildID);
    const guildDB = await getGuild(client.config.general.guildID);
    const bountyChannel = await guild?.channels?.fetch(guildDB.bounty.channel) as GuildTextBasedChannel;
    const bountyBoard = await bountyChannel?.messages?.fetch(guildDB.bounty.messageID);

    if (!guild || !guildDB || !bountyChannel || !bountyBoard) return;

    const bounty = await getCurrentBounty(client.config.general.guildID);
    const bountyBoardEmbed = new EmbedBuilder()
        .setColor(client.cc.designly)
        .setTitle('Bounty Board')
        .setColor('DarkAqua')
        .setImage('https://i.imgur.com/3F4Xomv.png')
        .setTimestamp()
    const bountyBoardRow = new ActionRowBuilder<ButtonBuilder>()
    if (!bounty) {
        const nextBounty = await getNextBounty(client.config.general.guildID);
        bountyBoardEmbed.setDescription(`The next bounty isn't ready for you yet. ${nextBounty ? `Check for the next bounty on <t:${nextBounty.startDate}:D> at <t:${nextBounty.startDate}:t>!` : `Check back soon!`}`)
        bountyBoardEmbed.setFields()
    } else if (bounty) {
        bountyBoardEmbed.setDescription(`Here's what we know about this week's bounty: ${bounty.basicInfo}\nInterested in purchasing this bounty? This bounty costs ${client.cc.coin}${bounty.cost}!`)
        .addFields(
            { name: 'Duration', value: `<t:${bounty.startDate}:f> - <t:${bounty.endDate}:f>`}
        );
        bountyBoardRow.addComponents([
            new ButtonBuilder()
                .setCustomId(`purchaseBounty-${bounty.startDate}-${bounty.endDate}`)
                .setLabel('Purchase')
                .setStyle(ButtonStyle.Success)
                .setEmoji(client.cc.coin),
            new ButtonBuilder()
                .setCustomId(`bountyInfo-${bounty.startDate}-${bounty.endDate}`)
                .setLabel('Info')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('ℹ️')
        ])
    };

    await bountyBoard.edit({ embeds: [bountyBoardEmbed], components: bounty ? [bountyBoardRow] : [] });
};