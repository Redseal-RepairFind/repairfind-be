import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { Logger } from '../logger';

export async function translateText(text: string,  targetLang: string, sourceLang?: string,): Promise<any> {
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
        },
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error: any) {
    Logger.error('Error translating text:', error?.response?.data);
    throw new Error (error?.response?.data?.error?.message)
  }
}
