import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from "discord.js";
import { interactionOptions } from "../../typings";

export const storeCommand = {
    name: 'store',
    description: 'Manage the server\'s store.',
    cooldown: 3000,
    dmPermission: false,
    default_member_permission: String(PermissionFlagsBits.ManageGuild),
    options: [
        {
            name: 'add',
            description: 'Add a new listing to the store.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'title',
                    description: 'The title of the item listing.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'description',
                    description: 'The description of the item listing.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'cost',
                    description: 'The amount of Nibs this item will cost.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove an item listing from the store.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'item_id',
                    description: 'The ID of the item listing that you want to remove.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'edit',
            description: 'Edit an item listing.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'The ID of the item listing that you want to remove.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true
                },
                {
                    name: 'active',
                    description: 'Set this active status of this item.',
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                },
                {
                    name: 'title',
                    description: 'The title of the item.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'description',
                    description: 'The description of the item.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'price',
                    description: 'The price of the item.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false
                }
            ]
        },
        {
            name: 'post',
            description: 'Send the store listing in a specified channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel where the store listing will be sent.',
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [
                        ChannelType.GuildText,
                        ChannelType.GuildAnnouncement
                    ],
                    required: true
                }
            ]
        },
        {
            name: 'view',
            description: 'View all valid store listings.',
            type: ApplicationCommandOptionType.Subcommand
        }
    ]
} as interactionOptions;