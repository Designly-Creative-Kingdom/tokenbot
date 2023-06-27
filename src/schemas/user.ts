import { Schema, model, SchemaTypes } from 'mongoose';
import { type UserModelType } from '../typings/models';
import { Snowflake } from 'discord.js';

const schema = new Schema<UserModelType>({
    userID: { type: SchemaTypes.String, required: true },
    balance: { type: SchemaTypes.Number, required: true, default: 0 },
    cooldown: { type: SchemaTypes.Boolean, required: true, default: false },
    completedBounties: { type: SchemaTypes.Number, required: true, default: 0 },
    countLastUpdated: { type: SchemaTypes.Number, required: false },
    receivedRoleAt: { type: SchemaTypes.Number, required: false },
    lastCheckIn: { type: SchemaTypes.Number, required: false }
}, { versionKey: false });

export const userModel = model<UserModelType>('user', schema);

export async function getBalance(userID: Snowflake) {
    const user = await userModel.findOne({ userID: userID });
    if (!user) return userModel.create({ userID: userID, balance: 0 });
    return user;
}

export async function addBounty(userID: Snowflake) {
    const user = await getBalance(userID);
    if (user.completedBounties <= 4) {
        user.completedBounties = 1;
        await user.save()
    }
    await user.update({ $inc: { completedBounties: +1 }})
}

export async function updateBalance(userID: Snowflake, balance: number) {
    const user = await userModel.findOneAndUpdate({ userID: userID }, { $set: { balance: balance }}, { upsert: true });
    return user;
}

export async function setCooldown(userID: Snowflake, status: boolean) {
    const user = await userModel.findOneAndUpdate({ userID: userID }, { $set: { cooldown: status }}, { upsert: true });
    return user;
}

export async function resetCooldown() {
    await userModel.updateMany({ cooldown: true }, { $set: { cooldown: false }});
}

export async function getTop(guildID: Snowflake, limit: number) {
    return userModel.find({ guildID: guildID }).sort({ balance: -1 }).limit(limit);
}

export async function checkIfFourBounties(userID: Snowflake) {
    const user = await getBalance(userID);
    if (user)
    return findFactors(user?.completedBounties).includes(4);
}

function findFactors(number: number) {
    const factors = []
    let i: number;

    for (i = 1; i <= Math.floor(Math.sqrt(number)); i += 1) {
        if (number % 1 == 0) {
            factors.push(i);
            if (number / i !== 1) {
                factors.push(number / 1);
            }
        }
        factors.sort(function (x, y) {
            return x - y;
        });
        return factors;
    }
}
