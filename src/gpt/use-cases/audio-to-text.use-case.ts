import * as fs from 'fs'

import OpenAI from "openai";

interface Options {
    prompt: string;
    audioFile: Express.Multer.File
}

export const audioToTextUseCase = async(openAi: OpenAI, options: Options) => {

    const {prompt, audioFile} = options;

    const response = await openAi.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream( audioFile.path ),
        prompt: prompt, // mismo idioma audio
        language: 'es',
        response_format: 'verbose_json'
    })

    return response


}