import OpenAI from 'openai';

interface Options {
    prompt: string;
}


export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt } = options;


    const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `
            Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
            Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
            Debes de responder en formato JSON, 
            tu tarea es corregirlos y retornar información con soluciones, 
            también debes de dar un porcentaje de acierto por el usuario,
            la solución no puede ser igual a la solución,
            ten en cuenta el contexto del texto como puntos o comas,
            también pueden ser palabras sueltas
            
    
            Si no hay errores, debes de retornar un mensaje de felicitaciones.
    
            Ejemplo de salida:
            {
              userScore: number,
              errors: string[], // ['error -> solución']
              message: string, //  Usa emojis y texto para felicitar al usuario
              correctedText: string, // devuelve el texto corregido con las palabras corregidas envueltas en la etiqueta HTML <b style='background-color: red;'></b>
            }
            
            `
          },
          {
            role: 'user',
            content: prompt,
          }
      ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        response_format: {
          type: 'json_object'
        }
      });

      const jsonResp = JSON.parse(completion.choices[0].message.content);

      return jsonResp;
}