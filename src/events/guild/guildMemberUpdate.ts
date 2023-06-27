import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { getGuild } from "../../schemas/guild";
import { getBalance, updateBalance } from "../../schemas/user";
import { Event } from "../../structures/Event";

export default new Event('guildMemberUpdate', async (oldMember, member) => {
    if (member.user?.bot || oldMember.partial && !member.partial) return;
    const guild = await getGuild(member.guild.id);
    const user = await getBalance(member.user.id);
    if (!guild) return;

    if (user.balance == 0) {
        await updateBalance(member.user.id, guild.welcome.nibs);
        const welcomeEmbed = new EmbedBuilder()
            .setColor(`#d51733`)
            .setDescription(`Welcome to **${member.guild.name}**. Enjoy a complimentary ${guild.welcome.nibs} Nibs!`)
        const welcomeRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('help')
                    .setEmoji('❓')
                    .setLabel('Help')
                    .setStyle(ButtonStyle.Secondary)
            ])
            try {
            await member.send({ embeds: [welcomeEmbed], components: [welcomeRow] })
        } catch (error) {
        };
    };
});