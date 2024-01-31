import OpenAI from "openai";
import * as fs from 'fs'


export const createThreadUseCase = async(openai: OpenAI) => {
    const {id} = await openai.beta.threads.create();

    const file = await openai.files.create({
        file: fs.createReadStream("mydata.csv"),
        purpose: "assistants",
      });
    

    return {id};
}