import { ApplicationCommandOptionType } from "discord.js";
import { interactionOptions } from "../../typings";

export const submitCommand = {
    name: 'submit',
    description: 'Submit your work for the active bounty.',
    cooldown: 10000,
    options: [
        {
            name: 'files',
            description: 'Upload your attachments as a .zip folder.',
            type: ApplicationCommandOptionType.Attachment,
        },
        {
            name: 'link',
            description: 'Upload your work as a link.',
            type: ApplicationCommandOptionType.String,
        }
    ]
} as interactionOptions;