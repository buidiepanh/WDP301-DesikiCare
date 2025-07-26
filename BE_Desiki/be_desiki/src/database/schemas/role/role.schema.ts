import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './role.hooks';
import { apply_Methods } from './role.methods';
import { apply_Statics } from './role.statics';
import { apply_Virtuals } from './role.virtuals';
import { apply_Indexes } from './role.indexes';


interface IRole_Statics {

}

interface IRole_Methods {

}

interface IRole_Virtuals {

}

export type RoleDocument = Role & Document & IRole_Methods & IRole_Virtuals;  



@Schema({ collection: 'roles', timestamps: true })
export class Role {
    @Prop({ type: Number, required: true })
    _id?: number;

    @Prop({ required: true })
    name: string;
}



type RoleModel = Model<RoleDocument> & IRole_Statics; 
const RoleSchema = SchemaFactory.createForClass(Role);

// Apply hooks
apply_PreHooks(RoleSchema);
apply_PostHooks(RoleSchema);

// Apply methods
apply_Methods(RoleSchema);

// Apply statics
apply_Statics(RoleSchema);

// Apply virtuals
apply_Virtuals(RoleSchema);

// Apply indexes
apply_Indexes(RoleSchema);

export {RoleSchema, RoleModel}  