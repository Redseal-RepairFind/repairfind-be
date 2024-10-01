import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { Logger } from '../logger';
import { exceptions } from 'winston';



export async function translateText({ text, targetLang, sourceLang, format = 'text', model = 'text' }: { text: string; targetLang: string; sourceLang?: string; format?: string; model?: string }): Promise<any> {
  try {
    if (!text  || !targetLang) {
        throw new Error('Text, source language, and target language are required');
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${config.google.apiKey}`;
    const response = await axios.post(
      url,
      {},
      {
        params: {
          q: text,
          source: sourceLang || null, 
          target: targetLang, 
          key: config.google.apiKey,
          // model: model,
          format:  format,
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error: any) {
    Logger.error('Error translating text:', error?.response?.data);
    throw new Error (error?.response?.data?.error?.message)
  }
}




