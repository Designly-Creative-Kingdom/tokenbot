import { Schema, model, SchemaTypes } from 'mongoose';
import { type PostingSchemaType } from '../typings/models';

const schema = new Schema({
    example: { type: SchemaTypes.String }
}, { versionKey: false });

export const postModel = model<PostingSchemaType>('posting', schema);