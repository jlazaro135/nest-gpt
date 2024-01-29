import * as path from "path";
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

import OpenAI from "openai";


@Injectable()
export class GptService {

    // Solo va a llamar casos de uso

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async orthographyCheck(orthographyDto: OrthographyDto){
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt
        });
        
    }

    async prosConsDiscusser({prompt}: ProsConsDiscusserDto){
        return await prosConsDiscusserUseCase(this.openai, {
            prompt
        });
        
    }

    async prosConsDiscusserStream({prompt}: ProsConsDiscusserDto){
        return await prosConsDiscusserStreamUseCase(this.openai, {
            prompt
        });
        
    }

    async translate(translateDto: TranslateDto){
        return await translateUseCase(this.openai, {
            prompt: translateDto.prompt,
            lang: translateDto.lang
        });
        
    }

    async textToAudio({prompt, voice}: TextToAudioDto){
        return await textToAudioUseCase(this.openai, {
            prompt: prompt,
            voice
        });
        
    }

    async textToAudioGetter(fileId: string){

        const filePath = path.resolve(__dirname, '../../generated/audios', `${fileId}.mp3`);

        const wasFound = fs.existsSync( filePath );

        if( !wasFound ) throw new NotFoundException(`File ${fileId} not found`);

        return filePath;

    }
}
