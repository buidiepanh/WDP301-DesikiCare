import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model, Types } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './quizOptionSkinType.hooks';
import { apply_Methods } from './quizOptionSkinType.methods';
import { apply_Statics } from './quizOptionSkinType.statics';
import { apply_Virtuals } from './quizOptionSkinType.virtuals';
import { apply_Indexes } from './quizOptionSkinType.indexes';
import { SkinType } from '../skinType/skinType.schema';
import { QuizOption } from '../quizOption/quizOption.schema';


interface IQuizOptionSkinType_Statics {

}

interface IQuizOptionSkinType_Methods {

}

interface IQuizOptionSkinType_Virtuals {
    skinType: SkinType;
}

export type QuizOptionSkinTypeDocument = QuizOptionSkinType & Document & IQuizOptionSkinType_Methods & IQuizOptionSkinType_Virtuals;  



@Schema({ collection: 'quizOptionSkinTypes', timestamps: true })
export class QuizOptionSkinType {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: QuizOption.name, required: true })
    quizOptionId: Types.ObjectId;

    @Prop({ type: Number, ref: SkinType.name, required: true })
    skinTypeId: number;
}



type QuizOptionSkinTypeModel = Model<QuizOptionSkinTypeDocument> & IQuizOptionSkinType_Statics; 
const QuizOptionSkinTypeSchema = SchemaFactory.createForClass(QuizOptionSkinType);

// Apply hooks
apply_PreHooks(QuizOptionSkinTypeSchema);
apply_PostHooks(QuizOptionSkinTypeSchema);

// Apply methods
apply_Methods(QuizOptionSkinTypeSchema);

// Apply statics
apply_Statics(QuizOptionSkinTypeSchema);

// Apply virtuals
apply_Virtuals(QuizOptionSkinTypeSchema);

// Apply indexes
apply_Indexes(QuizOptionSkinTypeSchema);

export {QuizOptionSkinTypeSchema, QuizOptionSkinTypeModel}
