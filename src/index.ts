import mongoose from 'mongoose';
import { Mongoose } from 'mongoose';

export { Mongoose } from 'mongoose';

export type Schemas<T> = {
  [K in keyof T]: mongoose.Schema<T[K]>
};

export type Models<T> = {
  [K in keyof T]: mongoose.Model<T[K]>
};

function getOrCreateModel<T, K extends keyof Schemas<T>>(
  mongooseInstance: Mongoose,
  schemas: Schemas<T>,
  modelName: K
): Models<T>[K] {
  const modelNameString = modelName as string
  try {
    // Get
    return mongooseInstance.model(modelNameString) as Models<T>[K]
  } catch (error) {
    // Create
    return mongooseInstance.model(
      modelNameString, 
      schemas[modelName]
    ) as Models<T>[K]
  }
};

export type SetMongooseInstanceFunction = (mongoose: Mongoose) => void;
export type GetModelFunction<T> = <K extends keyof Models<T>>(modelName: K) => Models<T>[K];

type ModelFactoryReturnType<T> = {
  setMongooseInstance: SetMongooseInstanceFunction;
  getModel: GetModelFunction<T>;
}

export function modelFactory<T>(schemas: Schemas<T>): ModelFactoryReturnType<T> {
  
  let mongooseInstance: Mongoose | null = null;

  const setMongooseInstance = (mongoose: Mongoose): void => {
    mongooseInstance = mongoose;
    for (const modelName in schemas) {
      getOrCreateModel(mongoose, schemas, modelName as keyof Schemas<T>);
    }
  }

  const getModel: GetModelFunction<T> = (modelName) => {
    if (!mongooseInstance) {
      throw new Error('Mongoose not initialized')
    }
    return getOrCreateModel(mongooseInstance, schemas, modelName);
  }

  return {
    setMongooseInstance,
    getModel
  }
}