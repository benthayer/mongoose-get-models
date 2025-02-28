"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongoose = void 0;
exports.default = modelFactory;
var mongoose_1 = require("mongoose");
Object.defineProperty(exports, "Mongoose", { enumerable: true, get: function () { return mongoose_1.Mongoose; } });
function modelFactory(schemas) {
    return function getModels(mongooseInstance) {
        const models = {};
        for (const key in schemas) {
            const modelName = key;
            // Try to get existing model or create new one
            try {
                // First attempt to get an existing model
                models[key] = mongooseInstance.model(modelName);
            }
            catch (error) {
                // If the model doesn't exist yet, create it
                models[key] = mongooseInstance.model(modelName, schemas[key]);
            }
        }
        return models;
    };
}
//# sourceMappingURL=index.js.map