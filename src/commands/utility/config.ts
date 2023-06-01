import { Command } from '../../structures/Command';
import { interactions } from '../../interactions';
import { EmbedBuilder, ForumChannel, GuildTextBasedChannel } from 'discord.js';
import { getGuild } from '../../schemas/guild';

export default new Command({
    interaction: interactions.config,
    excute: async ({ client, interaction, options }) => {
        const command = `${options.getSubcommandGroup()} ${options.getSubcommand()}`;
        const ephemeral = options.getBoolean('silent') || false;
        const guild = await getGuild(interaction.guild.id);
        await interaction.deferReply({ ephemeral });
        
        if (command == 'watchlist add') {
            const channel = options.getChannel('channel') as GuildTextBasedChannel | ForumChannel;
            if (guild.channels?.includes(channel.id)) {
                return interaction.followUp({ embeds: [client.embeds.attention(`This channel is already on the watchlist.`)], ephemeral });
            } else {
                guild.channels?.push(channel.id);
                await guild.save();
                return await interaction.followUp({ embeds: [client.embeds.success(`Added ${channel.toString()} to the watchlist.`)], ephemeral });
            }
        } else if (command == 'watchlist remove') {
            const channel = options.getChannel('channel') as GuildTextBasedChannel | ForumChannel;
            if (guild.channels?.includes(channel.id)) {
                guild.channels = guild.channels?.filter((c) => c != channel.id);
                guild.save();
                return await interaction.followUp({ embeds: [client.embeds.success(`Removed ${channel.toString()} from the watchlist.`)], ephemeral });
            } else if (!guild.channels?.includes(channel.id)) {
                return await interaction.followUp({ embeds: [client.embeds.attention(`This channel is not currently on the watchlist.`)], ephemeral });
            }
        } else if (command == 'watchlist list') {
            const guildChannels = new EmbedBuilder()
                .setDescription(guild.channels?.map((c) => {
                    return `<#${c}>`
                }).join(',') || 'There are no channels currently on the watchlist.');
            return await interaction.followUp({ content: guild?.channels?.length > 0 ? `Here are the channels currently on the watchlist.` : null, embeds: [guildChannels], ephemeral });

        }
    }
});