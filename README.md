# mongoose-get-models

An easy way to manage mongoose models across packages.

## What?

This package export a `modelFactory<T>(schemas)` function that returns a `getModel` function that allows you to get all of your models linked to a given mongoose instance / connection. This is convenient when you have a dependency that also uses your mongoose models where you want/need to share a connection and avoid complex and annoying model definition and connection management errors.

## Why?

Before writing this, every single one of our projects / services had to redefine every single one of our models. Moreover, when we tried to create a cache package that interfaced with both the db and redis, we started to get `OverwriteModelError`s and issues managing which mongoose connection we were using. This package makes it easy to to do both while maintaining type safety

## Basic Usage

```typescript
import mongoose from 'mongoose';
import { modelFactory } from 'mongoose-get-models';
import { UserSchema, type IUser } from './user'

// Create your factory
const { setMongooseInstance, getModel } = modelFactory<{ User: IUser }>({
  User: UserSchema
});

setMongooseInstance(mongoose)

// Get models
const { User } = getModel();
```

## Useful pattern

Imagine the scenario where you have three packages, `mongoose-schemas`, `app` and a `utils` package that `app` imports.

In your schemas package:

```typescript
// index.ts
import mongoose from 'mongoose';
import { modelFactory, type Models, type Mongoose } from 'mongoose-get-models';
import { UserSchema, type IUser } from './user'

type MyTypes = {
  User: IUser
}

type MyModels = Models<MyTypes>
export const { setMongooseInstance, getModel } = modelFactory<MyTypes>({
  User: UserSchema
});
```

In your app:

```typescript
// app.ts
import mongoose from 'mongoose';
import { setMongooseInstance, getModel } from '@your-org/mongoose-schemas';
import { setMongooseInstance as setMongooseInstanceInOtherPackage } from '@your-org/utils'

setMongooseInstance(mongoose);
// Can call getModel any time after initialization
const User = getModel('User')

// It's okay to connect mongoose after initialization
mongoose.connect('mongodb://localhost:27017/myapp');

// Share the mongoose instance with another package
setMongooseInstanceInOtherPackage(mongoose)


// anywhere else
import { getModel } from '@your-org/mongoose-schemas';
function getUser(id) {
  return getModel('User').findById(id)
}
```

In utils:
```typescript
import { setMongooseInstance as setMongooseInstanceSuper, Mongoose } from '@your-org/mongoose-schemas';
export function setMongooseInstance(mongooseInstance: Mongoose): void {
  setMongooseInstanceSuper(mongooseInstance)
}

// anywhere else
import { getModel } from '@your-org/mongoose-schemas';
function getUser(id) {
  return getModel('User').findById(id)
}
```

## License

MIT