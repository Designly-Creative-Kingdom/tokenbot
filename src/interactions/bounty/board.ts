import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { interactionOptions } from "../../typings";

export const boardCommand = {
    name: 'board',
    description: 'Manage your bounty board.',
    cooldown: 2500,
    directory: 'bounty',
    options: [
        {
            name: 'setup',
            description: 'Setup your guild\'s bounty board.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Choose a channel you want the guild\'s bounty board to be set up in.',
                    type: ApplicationCommandOptionType.Channel,
                    channel_types:[
                        ChannelType.GuildText
                    ],
                    required: true
                }
            ]
        },
        {
            name: 'refresh',
            description: 'Refresh your guild\'s bounty board.',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'bounties',
            description: 'Manage your guild\'s bounties.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'Add a bounty to your guild\'s bounty board.',
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: 'remove',
                    description: 'Remove a bounty from your guild\'s bounty board.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'bounty_id',
                            description: 'The ID of the bounty you want to remove.',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'upcoming',
                    description: 'View the upcoming bounties.',
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        }
    ]
} as interactionOptions;