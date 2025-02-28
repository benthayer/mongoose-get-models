import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
export { Mongoose } from 'mongoose';

type Schemas<T> = {
  [K in keyof T]: mongoose.Schema<T[K]>
};

type Models<T> = {
  [K in keyof T]: mongoose.Model<T[K]>
};

type GetModelFunction<T> = (mongooseInstance: Mongoose) => Models<T>;

export default function modelFactory<
  T extends Record<string, any>
>(schemas: Schemas<T>): GetModelFunction<T> {
  return function getModels(mongooseInstance: Mongoose): Models<T> {
    const models = {} as Models<T>;
    
    for (const key in schemas) {
      const modelName = key as string;
      // Try to get existing model or create new one
      try {
        // First attempt to get an existing model
        models[key] = mongooseInstance.model(modelName) as mongoose.Model<T[typeof key]>;
      } catch (error) {
        // If the model doesn't exist yet, create it
        models[key] = mongooseInstance.model(
          modelName, 
          schemas[key]
        ) as mongoose.Model<T[typeof key]>;
      }
    }
    
    return models;
  };
}
