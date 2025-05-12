import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
export { Mongoose } from 'mongoose';
export type Schemas<T> = {
    [K in keyof T]: mongoose.Schema<T[K]>;
};
export type Models<T> = {
    [K in keyof T]: mongoose.Model<T[K]>;
};
export type SetMongooseInstanceFunction = (mongoose: Mongoose) => void;
export type GetModelFunction<T> = <K extends keyof Models<T>>(modelName: K) => Models<T>[K];
type ModelFactoryReturnType<T> = {
    setMongooseInstance: SetMongooseInstanceFunction;
    getModel: GetModelFunction<T>;
};
export declare function modelFactory<T>(schemas: Schemas<T>): ModelFactoryReturnType<T>;
