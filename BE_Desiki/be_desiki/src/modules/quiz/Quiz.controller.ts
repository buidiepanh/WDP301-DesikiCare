import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { Types } from 'mongoose';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';

@Controller('Quiz')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class QuizController {

  constructor(
    private readonly quizService: QuizService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Lấy toàn bộ câu hỏi và option của quiz cửa hàng
  @Get()
  async getQuizQuestionsAndOptions(
    @Req() req
  ) {
    const quizQuestions = await this.quizService.getQuizQuestionsAndOptions();
    return {
      quizQuestions: quizQuestions,
    };
  }

  // Thêm câu hỏi quiz
  @Post('questions')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuizQuestion(
    @Body() body: {
      quizQuestion: {
        content: string;
      };
    }
  ) {
    await this.quizService.createQuizQuestion(body.quizQuestion);
    return {
      message: 'Quiz question created successfully',
    };
  }

  // Cập nhật câu hỏi quiz
  @Put('questions/:quizQuestionId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateQuizQuestion(
    @Param('quizQuestionId') quizQuestionId: Types.ObjectId,
    @Body() body: {
      quizQuestion: {
        content: string;
      };
    }
  ) {
    const questionId = new Types.ObjectId(quizQuestionId);
    await this.quizService.updateQuizQuestion(questionId, body.quizQuestion);
    return {
      message: 'Quiz question updated successfully',
    };
  }

  // Xóa câu hỏi và mọi option của nó (bao gồm quizOptionSkinTypes và quizOptionSkinStatuses)
  @Delete('questions/:quizQuestionId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deleteQuizQuestion(
    @Param('quizQuestionId') quizQuestionId: Types.ObjectId
  ) {
    const questionId = new Types.ObjectId(quizQuestionId);
    await this.quizService.deleteQuizQuestion(questionId);
    return {
      message: 'Quiz question deleted successfully',
    };
  }

  // Thêm option vào câu hỏi
  @Post('questions/:quizQuestionId/options')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuizOption(
    @Param('quizQuestionId') quizQuestionId: Types.ObjectId,
    @Body() body: {
      quizOption: {
        content: string;
      };
      skinTypeIds?: number[];
      skinStatusIds?: number[];
    }
  ) {
    const questionId = new Types.ObjectId(quizQuestionId);
    await this.quizService.createQuizOption(questionId, body);
    return {
      message: 'Quiz option created successfully',
    };
  }

  // Cập nhật option
  @Put('options/:quizOptionId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateQuizOption(
    @Param('quizOptionId') quizOptionId: Types.ObjectId,
    @Body() body: {
      quizOption?: {
        content: string;
      };
      skinTypeIds?: number[];
      skinStatusIds?: number[];
    }
  ) {
    const optionId = new Types.ObjectId(quizOptionId);
    await this.quizService.updateQuizOption(optionId, body);
    return {
      message: 'Quiz option updated successfully',
    };
  }

  // Xóa option
  @Delete('options/:quizOptionId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deleteQuizOption(
    @Param('quizOptionId') quizOptionId: Types.ObjectId
  ) {
    const optionId = new Types.ObjectId(quizOptionId);
    await this.quizService.deleteQuizOption(optionId);
    return {
      message: 'Quiz option deleted successfully',
    };
  }

  // Nhận kết quả làm quiz (trả về skin types/statuses và products phù hợp)
  @Post('result')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getQuizResult(
    @Body() body: {
      quizOptionIds: string[];
    }
  ) {
    const optionIds = body.quizOptionIds.map(id => new Types.ObjectId(id));
    const result = await this.quizService.getQuizResult(optionIds);
    return result;
  }
}
