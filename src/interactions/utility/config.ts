import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { interactionOptions } from "../../typings";

export const configCommand = {
    name: 'config',
    description: 'Setup the configuration for your guild.',
    dmPermission: false,
    cooldown: 2500,
    permission: ["ManageGuild"],
    options: [
        {
            name: 'welcome',
            description: 'Edit the welcome message the bot sends.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'active',
                    description: 'Set the active status of the welcome message.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'status',
                            description: 'The status of the welcome module.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently add a channel to the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },
                {
                    name: 'dm_status',
                    description: 'Set the status of the DM welcome message.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'enabled',
                            description: 'The status of the DM welcome message.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently add a channel to the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },
                {
                    name: 'tokens',
                    description: 'Set the amount of tokens you want gifted to new members.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount of tokens you want given to new members.',
                            type: ApplicationCommandOptionType.Number,
                            required: true
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently add a channel to the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                }
            ]
        },
        {
            name: 'watchlist',
            description: 'Manage your actively monitored channels.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'Add a channel to the client\'s watch list.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to add to the client\'s watch list.',
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [
                                ChannelType.GuildText,
                                ChannelType.GuildForum
                            ]
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently add a channel to the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a channel from the client\'s watch list.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to remove from the client\'s watch list.',
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [
                                ChannelType.GuildText,
                                ChannelType.GuildForum
                            ]
                        },
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently remove a channel from the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },
                {
                    name: 'list',
                    description: 'View all the channels currently in the client\'s watch list.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'silent',
                            description: 'Whether or not you want to silently view the watch list.',
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                }
            ]
        }
    ]
} as interactionOptions;