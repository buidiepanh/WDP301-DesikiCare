import { AppConfig } from "src/config/app.config";

export function apply_PreHooks(schema: any) {
    var moment = require('moment-timezone');
    const timezone = AppConfig().appConfig.TZ

    // UTC+7 offset in milliseconds
    // const tzOffset = 7 * 60 * 60 * 1000;
    const tzOffset = moment().tz(timezone).utcOffset() * 60 * 1000;


    // Handle save (single document)
    schema.pre('save', function (next) {
        const now = new Date(Date.now() + tzOffset);
        if (this.isNew) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        next();
    });

    // Handle insertMany
    schema.pre('insertMany', function (next, docs: any[]) {
        const now = new Date(Date.now() + tzOffset);
        docs.forEach(doc => {
            doc.createdAt = now;
            doc.updatedAt = now;
        });
        next();
    });

    // Handle create (single/multiple)
    schema.pre('create', function (next: Function, docs: any | any[]) {
        const now = new Date(Date.now() + tzOffset);
        if (Array.isArray(docs)) {
            docs.forEach((doc: any) => {
                doc.createdAt = now;
                doc.updatedAt = now;
            });
        } else if (docs) {
            (docs as any).createdAt = now;
            (docs as any).updatedAt = now;
        }
        next();
    });

    // Handle replaceOne
    schema.pre('replaceOne', function (next) {
        const now = new Date(Date.now() + tzOffset);
        if (this.getUpdate) {
            const update = this.getUpdate();
            update.updatedAt = now;
        }
        next();
    });

    // Handle bulkWrite
    schema.pre('bulkWrite', function (next, operations: any[]) {
        const now = new Date(Date.now() + tzOffset);
        if (Array.isArray(operations)) {
            operations.forEach(op => {
                if (op.insertOne && op.insertOne.document) {
                    op.insertOne.document.createdAt = now;
                    op.insertOne.document.updatedAt = now;
                }
                if (op.updateOne && op.updateOne.update) {
                    op.updateOne.update.updatedAt = now;
                }
                if (op.updateMany && op.updateMany.update) {
                    op.updateMany.update.updatedAt = now;
                }
                if (op.replaceOne && op.replaceOne.replacement) {
                    op.replaceOne.replacement.updatedAt = now;
                }
            });
        }
        next();
    });

    // Handle update queries (findOneAndUpdate, updateOne, updateMany)
    function setUpdateAt(this: any, next: Function) {
        const now = new Date(Date.now() + tzOffset);
        if (!this.getUpdate) return next();
        const update = this.getUpdate();
        if (update) {
            update.updatedAt = now;
        }
        next();
    }

    schema.pre('findOneAndUpdate', setUpdateAt);
    schema.pre('updateOne', setUpdateAt);
    schema.pre('updateMany', setUpdateAt);
}
export function apply_PostHooks(schema: any) {}
