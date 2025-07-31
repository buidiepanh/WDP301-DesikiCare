import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './quizQuestion.hooks';
import { apply_Methods } from './quizQuestion.methods';
import { apply_Statics } from './quizQuestion.statics';
import { apply_Virtuals } from './quizQuestion.virtuals';
import { apply_Indexes } from './quizQuestion.indexes';


interface IQuizQuestion_Statics {

}

interface IQuizQuestion_Methods {

}

interface IQuizQuestion_Virtuals {

}

export type QuizQuestionDocument = QuizQuestion & Document & IQuizQuestion_Methods & IQuizQuestion_Virtuals;  



@Schema({ collection: 'quizQuestions', timestamps: true })
export class QuizQuestion {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    content: string;
}



type QuizQuestionModel = Model<QuizQuestionDocument> & IQuizQuestion_Statics; 
const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);

// Apply hooks
apply_PreHooks(QuizQuestionSchema);
apply_PostHooks(QuizQuestionSchema);

// Apply methods
apply_Methods(QuizQuestionSchema);

// Apply statics
apply_Statics(QuizQuestionSchema);

// Apply virtuals
apply_Virtuals(QuizQuestionSchema);

// Apply indexes
apply_Indexes(QuizQuestionSchema);

export {QuizQuestionSchema, QuizQuestionModel}
