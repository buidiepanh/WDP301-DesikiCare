import { IsString, IsNotEmpty, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  options: CreateQuizOptionDto[];
}

export class CreateQuizOptionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  skinTypeIds?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  skinStatusIds?: Types.ObjectId[];
}

export class UpdateQuizQuestionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsArray()
  options?: UpdateQuizOptionDto[];
}

export class UpdateQuizOptionDto {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  skinTypeIds?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  skinStatusIds?: Types.ObjectId[];
}

export class SubmitQuizAnswersDto {
  @IsArray()
  @IsNotEmpty()
  answers: QuizAnswerDto[];
}

export class QuizAnswerDto {
  @IsMongoId()
  questionId: Types.ObjectId;

  @IsMongoId()
  optionId: Types.ObjectId;
}
