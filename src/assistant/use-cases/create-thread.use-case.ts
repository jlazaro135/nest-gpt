import OpenAI from "openai";
import * as fs from 'fs'


export const createThreadUseCase = async(openai: OpenAI) => {
    const {id} = await openai.beta.threads.create();
    

    return {id};
}