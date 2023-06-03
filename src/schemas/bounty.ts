import { Schema, model, SchemaTypes } from 'mongoose';
import { BountyModalType } from '../typings/models';
import { Snowflake } from 'discord.js';

const schema = new Schema({
    guildID: { type: SchemaTypes.String, required: true },
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String, required: true },
    cost: { type: SchemaTypes.Number, required: true },
    basicInfo: { type: SchemaTypes.String, required: true },
    purchasedBy: { type: SchemaTypes.Array, required: true, default: [] },
    completedBy: { type: SchemaTypes.Array, required: true, default: [] },
    startDate: { type: SchemaTypes.Number, required: true, default: Date.now() },
    endDate: { type: SchemaTypes.Number, required: true, default: Date.now() }
}, { versionKey: false });

const bountyModal = model<BountyModalType>('bounty', schema);

export async function getCurrentBounty(guildID: Snowflake) {
    const bounty = (await bountyModal.find({ guildID: guildID })).filter((b) => Math.floor(Date.now() / 1000) >= b.startDate && b.endDate > Math.floor(Date.now() / 1000));
    return bounty[0]
};

export async function getNextBounty(guildID: Snowflake) {
    const bounty = (await bountyModal.find({ guildID: guildID }))?.filter((b) => b?.startDate > Date.now());
    return bounty[0]
};

export async function createBounty(guildID: Snowflake, title: string, description: string, cost: number, basicInfo: string, startDate: number, endDate: number) {
    await bountyModal.create({ guildID, title, description, cost, basicInfo, purchasedBy: [], completedBy: [], startDate, endDate });
};

export async function checkIfPurchased(guildID: Snowflake, bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ guildID: guildID, _id: bountyID });
    if (bounty?.purchasedBy.includes(userID)) {
        return true
    };
    return false;
}

export async function purchaseBounty(guildID: Snowflake, bountyID: any, userID: Snowflake) {
    await bountyModal.findOneAndUpdate({ guildID, _id: bountyID }, { $addToSet: { purchasedBy: [userID]} });
}

export async function checkIfCompleted(guildID: Snowflake, bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ guildID: guildID, _id: bountyID });
    const filter = bounty.completedBy.filter((b) => b.userId == userID);
    return filter[0] || null;
};

export async function deleteSubmission(bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ _id: bountyID });
    const removedSubmission = bounty.completedBy.filter((b) => { b.userId !== userID});
    console.log(removedSubmission)
    await bountyModal.findOneAndUpdate({ _id: bountyID }, { $set: { completedBy: removedSubmission } });
}

export async function getBountyByTimestamps(guildID: Snowflake, startDate: number, endDate: number) {
    const bounty = await bountyModal.findOne({ guildID, startDate, endDate });
    return bounty;
}

export async function markAsPending(bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ _id: bountyID });
    const filter = bounty.completedBy.findIndex((e) => e.userId == userID);
    if (filter !== -1) {
        bounty.completedBy[filter].status = 'pending';
    } else {
        bounty.completedBy.push({ userId: userID, status: 'pending' })
    }
    await bounty.save();
}

export async function markAsAccepted(bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ _id: bountyID });
    const filter = bounty.completedBy.findIndex((e) => e.userId == userID);
    if (filter !== -1) {
        bounty.completedBy[filter].status = 'approved';
    } else {
        bounty.completedBy.push({ userId: userID, status: 'approved' })
    }
    await bounty.save();
}

export async function markAsDenied(bountyID: any, userID: Snowflake) {
    const bounty = await bountyModal.findOne({ _id: bountyID });
    const filter = bounty.completedBy.findIndex((e) => e.userId == userID);
    if (filter !== -1) {
        bounty.completedBy[filter].status = 'rejected';
    } else {
        bounty.completedBy.push({ userId: userID, status: 'rejected' })
    }
    await bounty.save();
}