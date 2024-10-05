import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { Logger } from '../logger';
import { exceptions } from 'winston';



export async function translateText({ text, targetLang, sourceLang, format = 'plain', model = 'text' }: { text: string; targetLang: string; sourceLang?: string; format?: string; model?: string }): Promise<any> {
  try {
    if (!text || !targetLang) {
      throw new Error('Text, source language, and target language are required');
    }

    // const wordsToExclude = ["Google", "API", "Contractor", "Sunday"];
    // const preprocessedText = excludeWords(text, wordsToExclude);

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
          format: format,
        },
      }
    );

    const translatedText =  response.data.data.translations[0].translatedText;
    // const finalText = restoreExcludedWords(translatedText, wordsToExclude);
    return translatedText
  } catch (error: any) {
    Logger.error('Error translating text:', error?.response?.data);
    throw new Error(error?.response?.data?.error?.message)
  }
}



function excludeWords(text: string, wordsToExclude: string[]): string {
  let modifiedText = text;
  wordsToExclude.forEach((word) => {
    const placeholder = `{{EXCLUDE_${word}}}`;  // Use more unique placeholder format
    modifiedText = modifiedText.replace(new RegExp(`\\b${word}\\b`, 'g'), placeholder);
  });
  return modifiedText;
}

function restoreExcludedWords(translatedText: string, wordsToExclude: string[]): string {
  let modifiedText = translatedText;
  wordsToExclude.forEach((word) => {
    const placeholder = `{{EXCLUDE_${word}}}`;
    modifiedText = modifiedText.replace(new RegExp(placeholder, 'g'), word);  // Restore the original word
  });
  return modifiedText;
}


