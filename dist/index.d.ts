import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
export { Mongoose } from 'mongoose';
export type Schemas<T> = {
    [K in keyof T]: mongoose.Schema<T[K]>;
};
export type Models<T> = {
    [K in keyof T]: mongoose.Model<T[K]>;
};
export type GetModelFunction<T> = (mongooseInstance: Mongoose) => Models<T>;
export default function modelFactory<T>(schemas: Schemas<T>): GetModelFunction<T>;
