# mongoose-model-factory

An easy way to manage mongoose models across packages.

## What?

This package export a `modelFactory<T>(schemas)` function that returns a `getModels(mongoose) => YourModels` function that allows you to get all of your models linked to a given mongoose instance / connection. This is convenient when you have a dependency that also uses your mongoose models where you want/need to share a connection and avoid complex and annoying model definition and connection management errors.

## Why?

Before writing this, every single one of our projects / services had to redefine every single one of our models. Moreover, when we tried to create a cache package that interfaced with both the db and redis, we started to get `OverwriteModelError`s and issues managing which mongoose connection we were using. This package makes it easy to to do both while maintaining type safety

## Basic Usage

```typescript
import mongoose from 'mongoose';
import { modelFactory } from 'mongoose-models';
import { UserSchema, type IUser } from './user'

// Create your factory
const getModels = modelFactory<{ User: IUser }>({
  User: UserSchema
});

// Get models
const { User } = getModels(mongoose);
```

## Useful pattern

Imagine the scenario where you have three packages, `mongoose-schemas`, `app` and a `utils` package that `app` imports.

In your schemas package:

```typescript
// index.ts
import mongoose from 'mongoose';
import { modelFactory, type Models, type Mongoose } from 'mongoose-models';
import { UserSchema, type IUser } from './user'

type MyTypes = {
  User: IUser
}

type MyModels = Models<MyTypes>
// Create your factory
const getModelsWithConnection: (mongoose: Mongoose) => MyModels = modelFactory<MyTypes>({
  User: UserSchema
});

let mongooseInstance: Mongoose | null = null;

export function setMongooseInstance(mongoose: Mongoose) {
  mongooseInstance = mongoose;
}

export function getModels(): MyModels {
  if (!mongooseInstance) throw new Error('Mongoose not initialized');
  return getModelsWithConnection(mongooseInstance);
}

export function getModel<T extends keyof MyModels>(name: T): MyModels[T] {
  return getModels()[name]
}
```

In your app:

```typescript
// app.ts
import mongoose from 'mongoose';
import { setMongooseInstance } from '@your-org/mongoose-schemas';
import { initialize } from '@your-org/utils'

setMongooseInstance(mongoose);
// Can call getModels any time after initialization
const { User } = getModels()
// or
const User = getModel('User')

// utils doesn't use the same instance of schemas, so we have to initialize that too
// in the utils package, we can't call getModels() on the top level since it is not
// possible to set the mongoose instance before initializing, so it's best to call
// getModel/getModels at runtime
initialize(mongoose)

// Can initialize before or after
mongoose.connect('mongodb://localhost:27017/myapp');

// anywhere else
import { getModels } from './models';
function getUser(id) {
  return getModel('User').findById(id)
}
```

In utils:
```typescript
import { setMongooseInstance, Mongoose } from '@your-org/mongoose-schemas';
export function initialize(mongooseInstance: Mongoose): void {
  setMongooseInstance(mongooseInstance)
}

// anywhere else
import { getModels } from './models';
const { User } = getModels();
```

## License

MIT