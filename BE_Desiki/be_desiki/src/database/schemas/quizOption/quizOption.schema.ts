import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model, Types } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './quizOption.hooks';
import { apply_Methods } from './quizOption.methods';
import { apply_Statics } from './quizOption.statics';
import { apply_Virtuals } from './quizOption.virtuals';
import { apply_Indexes } from './quizOption.indexes';
import { QuizQuestion } from '../quizQuestion/quizQuestion.schema';


interface IQuizOption_Statics {

}

interface IQuizOption_Methods {

}

interface IQuizOption_Virtuals {

}

export type QuizOptionDocument = QuizOption & Document & IQuizOption_Methods & IQuizOption_Virtuals;  



@Schema({ collection: 'quizOptions', timestamps: true })
export class QuizOption {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: QuizQuestion.name, required: true })
    quizQuestionId: Types.ObjectId;
}



type QuizOptionModel = Model<QuizOptionDocument> & IQuizOption_Statics; 
const QuizOptionSchema = SchemaFactory.createForClass(QuizOption);

// Apply hooks
apply_PreHooks(QuizOptionSchema);
apply_PostHooks(QuizOptionSchema);

// Apply methods
apply_Methods(QuizOptionSchema);

// Apply statics
apply_Statics(QuizOptionSchema);

// Apply virtuals
apply_Virtuals(QuizOptionSchema);

// Apply indexes
apply_Indexes(QuizOptionSchema);

export {QuizOptionSchema, QuizOptionModel}
