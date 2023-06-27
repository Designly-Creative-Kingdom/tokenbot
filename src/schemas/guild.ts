import { Schema, model, SchemaTypes } from 'mongoose';
import { type GuildModelType } from '../typings/models';
import { Snowflake } from 'discord.js';

const schema = new Schema({
    guildID: { type: SchemaTypes.String, required: true },
    welcome: {
        dmMode: { type: SchemaTypes.Boolean, required: true, default: false },
        nibs: { type: SchemaTypes.Number, required: true, default: 200 },
        active: { type: SchemaTypes.Boolean, required: true, default: false }
    },
    channels: { type: Array<string>, required: true, default: [] },
    store: { type: SchemaTypes.String, required: false, default: undefined },
    bounty: { 
        channel: { type: SchemaTypes.String, required: false, default: undefined },
        messageID: { type: SchemaTypes.String, required: false, default: undefined },
        lastRefreshed: { type: SchemaTypes.Number, required: false, default: 0 }
    },
    prompt: { type: SchemaTypes.String, required: false }
}, { versionKey: false });

const guildModel = model<GuildModelType>('guild', schema);

export async function create(guildID: Snowflake) { 
    return await guildModel.create({ guildID: guildID, welcome: {
        dmMode: false,
        nibs: 200,
        active: false
    },
    channels: [],
});
}

export async function getGuild(guildID: Snowflake) {
    const guild = await guildModel.findOne({ guildID: guildID });
    if (!guild) return await create(guildID);
    return guild;
}

export async function updateWelcome(guildID: Snowflake, nibs?: number, dmMode?: boolean, active?: boolean) {
    if (active == undefined && nibs == undefined && dmMode == undefined) return;

    let toUpdate: any = new Object()
    if (nibs) toUpdate["nibs"] = nibs;
    if (active) toUpdate["active"] = active || false;
    if (dmMode) toUpdate["dmMode"] = dmMode || false;

    return await (await getGuild(guildID)).updateOne({ guildID: guildID }, { welcome: toUpdate })
};