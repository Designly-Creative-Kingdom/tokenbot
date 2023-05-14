import { Schema, model, SchemaTypes } from 'mongoose';
import { type ExampleSchemaType } from '../typings/models';

const schema = new Schema({
    example: { type: SchemaTypes.String }
}, { versionKey: false });

export const exampleModel = model<ExampleSchemaType>('example', schema);