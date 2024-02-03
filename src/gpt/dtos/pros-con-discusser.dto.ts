import OpenAI from 'openai';
import { IsOptional, IsString } from 'class-validator';

export class messageThreadDto {
  @IsString()
  readonly messageThread: OpenAI.Chat.ChatCompletionMessageParam[];
}
