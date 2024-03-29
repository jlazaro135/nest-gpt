import * as path from "path";
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, TextToAudioDto, TranslateDto, messageThreadDto} from './dtos';

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

    async prosConsDiscusser(messageThreadsDto: OpenAI.Chat.ChatCompletionMessageParam[]){
        return await prosConsDiscusserUseCase(this.openai, messageThreadsDto);
    }
    

    async prosConsDiscusserStream({prompt}: any){
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

    async audioToText(audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto){
        return await audioToTextUseCase(this.openai, {
            audioFile, 
            prompt: audioToTextDto.prompt
        })
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto){

        return await imageGenerationUseCase(this.openai, {...imageGenerationDto})

    }

    async imageGenerationGetter(fileName: string){

        const filePath = path.resolve(__dirname, '../../generated/images', `${fileName}`);

        const wasFound = fs.existsSync( filePath );

        if( !wasFound ) throw new NotFoundException(`File ${fileName} not found`);

        return filePath;

    }

    async generateImageVariation({ baseImage }: ImageVariationDto){

        return await imageVariationUseCase(this.openai, { baseImage })

    }
    
}
