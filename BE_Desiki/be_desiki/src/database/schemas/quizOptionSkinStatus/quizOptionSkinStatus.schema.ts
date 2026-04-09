import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model, Types } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './quizOptionSkinStatus.hooks';
import { apply_Methods } from './quizOptionSkinStatus.methods';
import { apply_Statics } from './quizOptionSkinStatus.statics';
import { apply_Virtuals } from './quizOptionSkinStatus.virtuals';
import { apply_Indexes } from './quizOptionSkinStatus.indexes';
import { SkinStatus } from '../skinStatus/skinStatus.schema';
import { QuizOption } from '../quizOption/quizOption.schema';


interface IQuizOptionSkinStatus_Statics {

}

interface IQuizOptionSkinStatus_Methods {

}

interface IQuizOptionSkinStatus_Virtuals {
    skinStatus: SkinStatus;
}

export type QuizOptionSkinStatusDocument = QuizOptionSkinStatus & Document & IQuizOptionSkinStatus_Methods & IQuizOptionSkinStatus_Virtuals;  



@Schema({ collection: 'quizOptionSkinStatuses', timestamps: true })
export class QuizOptionSkinStatus {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: QuizOption.name, required: true })
    quizOptionId: Types.ObjectId;

    @Prop({ type: Number, ref: SkinStatus.name, required: true })
    skinStatusId: number;
}



type QuizOptionSkinStatusModel = Model<QuizOptionSkinStatusDocument> & IQuizOptionSkinStatus_Statics; 
const QuizOptionSkinStatusSchema = SchemaFactory.createForClass(QuizOptionSkinStatus);

// Apply hooks
apply_PreHooks(QuizOptionSkinStatusSchema);
apply_PostHooks(QuizOptionSkinStatusSchema);

// Apply methods
apply_Methods(QuizOptionSkinStatusSchema);

// Apply statics
apply_Statics(QuizOptionSkinStatusSchema);

// Apply virtuals
apply_Virtuals(QuizOptionSkinStatusSchema);

// Apply indexes
apply_Indexes(QuizOptionSkinStatusSchema);

export {QuizOptionSkinStatusSchema, QuizOptionSkinStatusModel}
