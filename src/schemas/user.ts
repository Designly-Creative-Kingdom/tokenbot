import { Schema, model, SchemaTypes } from 'mongoose';
import { type UserModelType } from '../typings/models';
import { Snowflake } from 'discord.js';

const schema = new Schema<UserModelType>({
    userID: { type: SchemaTypes.String, required: true },
    guildID: { type: SchemaTypes.String, required: true },
    balance: { type: SchemaTypes.Number, required: true, default: 0 },
    cooldown: { type: SchemaTypes.Boolean, required: true, default: false },
}, { versionKey: false });

const userModel = model<UserModelType>('user', schema);

export async function getBalance(userID: Snowflake, guildID: Snowflake) {
    const user = await userModel.findOne({ userID: userID, guildID: guildID });
    if (!user) return userModel.create({ userID: userID, guildID, balance: 0 });
    return user;
}

export async function updateBalance(userID: Snowflake, guildID: Snowflake, balance: number) {
    const user = await userModel.findOneAndUpdate({ userID: userID, guildID: guildID }, { $set: { balance: balance }}, { upsert: true });
    return user;
}

export async function setCooldown(userID: Snowflake, guildID: Snowflake, status: boolean) {
    const user = await userModel.findOneAndUpdate({ userID: userID, guildID: guildID }, { $set: { cooldown: status }}, { upsert: true });
    return user;
}

export async function resetCooldown() {
    await userModel.updateMany({ cooldown: true }, { $set: { cooldown: false }});
}

export async function getTop(guildID: Snowflake, limit: number) {
    return userModel.find({ guildID: guildID }).sort({ balance: -1 }).limit(limit);
}