import { Schema, model, SchemaTypes } from 'mongoose';

const schema = new Schema({
    example: { type: SchemaTypes.String }
}, { versionKey: false });

export const postModel = model('example', schema);
