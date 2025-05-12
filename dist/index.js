"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongoose = void 0;
exports.modelFactory = modelFactory;
var mongoose_1 = require("mongoose");
Object.defineProperty(exports, "Mongoose", { enumerable: true, get: function () { return mongoose_1.Mongoose; } });
function getOrCreateModel(mongooseInstance, schemas, modelName) {
    const modelNameString = modelName;
    try {
        // Get
        return mongooseInstance.model(modelNameString);
    }
    catch (error) {
        // Create
        return mongooseInstance.model(modelNameString, schemas[modelName]);
    }
}
;
function modelFactory(schemas) {
    let mongooseInstance = null;
    const setMongooseInstance = (mongoose) => {
        mongooseInstance = mongoose;
        for (const modelName in schemas) {
            getOrCreateModel(mongoose, schemas, modelName);
        }
    };
    const getModel = (modelName) => {
        if (!mongooseInstance) {
            throw new Error('Mongoose not initialized');
        }
        return getOrCreateModel(mongooseInstance, schemas, modelName);
    };
    return {
        setMongooseInstance,
        getModel
    };
}
//# sourceMappingURL=index.js.map