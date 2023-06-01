import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { getGuild } from "../../schemas/guild";
import { getBalance, updateBalance } from "../../schemas/user";
import { Event } from "../../structures/Event";

export default new Event('guildMemberAdd', async (member) => {
    if (member.user?.bot) return;
    const guild = await getGuild(member.guild.id);
    const user = await getBalance(member.user.id, member.guild.id);
    if (!guild) return;

    if (user.balance == 0) {
        await updateBalance(member.user.id, member.guild.id, guild.welcome.tokens);
        await client.config.logging.webhook.send({ content: `${member.toString()} has joined the server and was given ${guild.welcome.tokens} tokens.`, threadId: client.config.logging.joinsLogging });

        if (guild.welcome.dmMode) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(`#d51733`)
                .setDescription(`Welcome to ${member.guild.name}. Enjoy a complimentary ${guild.welcome.tokens} Designly Tokens!`)
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
                await client.config.logging.webhook.send({ content: `Unable to send ${member.toString()} (${member.user.id}) the welcome embed.`, threadId: client.config.logging.joinsLogging });
            };
        };
    };
});