import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { Logger } from '../logger';

export async function translateText(text: string,  targetLang: string, sourceLang?: string,): Promise<any> {
  try {
    if (!text  || !targetLang) {
        throw new Error('Text, source language, and target language are required');
    }

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          source: sourceLang || 'auto',  // Source language (original language of the text)
          target: targetLang,      // Target language (desired language for translation)
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
