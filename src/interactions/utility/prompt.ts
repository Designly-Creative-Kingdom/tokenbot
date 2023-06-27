import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { interactionOptions } from "../../typings";

export const promptCommand = {
    name: 'prompt',
    description: 'Customize the check in prompt for users!',
    default_member_permission: String(PermissionFlagsBits.ManageGuild),
    permission: ['ManageGuild'],
    options: [
        {
            name: 'set',
            description: 'Set the active prompt for users that check in',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'view',
            description: 'View the active prompt for users that check in',
            type: ApplicationCommandOptionType.Subcommand
        }
    ]
} as interactionOptions;