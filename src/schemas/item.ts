import { Schema, model, SchemaTypes } from 'mongoose';
import { ItemModalType } from '../typings/models';
import { Snowflake } from 'discord.js';

const schema = new Schema<ItemModalType>({
    guildID: { type: SchemaTypes.String, required: true },
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String, required: true },
    cost: { type: SchemaTypes.Number, required: true },
    active: { type: SchemaTypes.Boolean, required: true, default: true },
}, { versionKey: false });

const itemModal = model<ItemModalType>('item', schema);

export async function createItem(title: string, description: string, cost: number, guildID: Snowflake) {
    return await itemModal.create({ title, description, cost, guildID, active: true });
}

export async function editItem(id: string, active?: boolean, title?: string, description?: string, cost?: number) {
    if (active == undefined && title == undefined && description == undefined && cost == undefined) return undefined;
    let toUpdate: any = new Object();
    if (active) toUpdate["active"] = active || false;
    if (title) toUpdate["title"] = title;
    if (description) toUpdate["description"] = description;
    if (cost) toUpdate["cost"] = cost;

    return await itemModal.findByIdAndUpdate(id, toUpdate);
};

export async function removeItem(id: string) {
    await itemModal.findByIdAndRemove(id);
}

export async function getActive(guildID: Snowflake) {
    return itemModal.find({ guildID: guildID, active: true });
}

export async function getItemByID(id: string) {
    return itemModal.findById(id)
}

export async function getAllItems(guildID: Snowflake) {
    return itemModal.find({ guildID: guildID });
}