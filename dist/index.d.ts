import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
export { Mongoose } from 'mongoose';
type Schemas<T> = {
    [K in keyof T]: mongoose.Schema<T[K]>;
};
type Models<T> = {
    [K in keyof T]: mongoose.Model<T[K]>;
};
type GetModelFunction<T> = (mongooseInstance: Mongoose) => Models<T>;
export default function modelFactory<T extends Record<string, any>>(schemas: Schemas<T>): GetModelFunction<T>;
