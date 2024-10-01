import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Logger } from '../services/logger';
import { GoogleServiceProvider } from '../services/google';
import { config } from '../config';

//@ts-ignore
import {Translate} from "translate";
import { text } from 'body-parser';

// Define the translation type structure
interface Translation {
    [key: string]: Partial<{
        en: string;
        fr: string;
        pa: string;
        zh: string;
        es: string;
    }>;
}

// Load a JSON file and parse it
function loadTranslations(filePath: string): Translation {
    const jsonData = readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
}


// Define the path to the general.json file
const generalTranslationsPath = path.join(__dirname, '..', '..', 'locale', 'general.json');


// Load all translations from different files
const translations: Translation = {
    ...loadTranslations(generalTranslationsPath),
    ...loadTranslations(path.join(__dirname, '..', '..', 'locale', 'notifications.json')),
    ...loadTranslations(path.join(__dirname, '..', '..', 'locale', 'api_response.json')),
    ...loadTranslations(path.join(__dirname, '..', '..', 'locale', 'email.json')),
};

// Slugify function to convert plain English text to a slug
function slugify(text: string): string {
    return text
        .toString()
        .normalize("NFD")  // Normalize the string (decomposing accents)
        .replace(/[\u0300-\u036f]/g, "")  // Remove diacritical marks
        .trim()  // Remove leading/trailing whitespace
        .replace(/[^a-zA-Z0-9]+/g, "_")  // Replace any sequence of non-alphanumeric characters with underscores
        .replace(/_{2,}/g, "_")  // Replace consecutive underscores with a single underscore
        .replace(/^_+|_+$/g, "")  // Remove leading or trailing underscores
        .toLowerCase();  // Convert the string to lowercase
}


// Define valid languages as a type
type Language = 'en' | 'fr' | 'pa' | 'zh' | 'es';


// Function to save new translations to general.json
function saveTranslationToFile(slug: string, lang: Language, translatedText: string): void {
    const currentTranslations = loadTranslations(generalTranslationsPath);

    // Update the translation object
    if (!currentTranslations[slug]) {
        currentTranslations[slug] = {};
    }

    // Add the translated text for the target language
    currentTranslations[slug][lang] = translatedText;

    // Write the updated translations back to the general.json file
    writeFileSync(generalTranslationsPath, JSON.stringify(currentTranslations, null, 2), 'utf8');

    Logger.info(`New translation saved for '${slug}' in language '${lang}' to general.json.`);
}


// Updated function to get translation with fallback to Google Translate API
async function getTranslation({ phraseOrSlug, lang = 'en', saveToFile = true, contentType = 'text', useGoogle = false }: { 
    phraseOrSlug: string; 
    lang?: Language; 
    saveToFile?: boolean; 
    contentType?: string; 
    useGoogle?: boolean; 
  }) {
    try {
        // Check if the provided input is already a valid slug
        if (translations[phraseOrSlug] && translations[phraseOrSlug][lang]) {
            return translations[phraseOrSlug][lang];
        }

        // If not found, slugify the phrase and search for the translation
        const slug = slugify(phraseOrSlug);
        if (translations[slug] && translations[slug][lang]) {
            return translations[slug][lang];
        }

        // If no translation is found, fall back to Google Translate API
        Logger.info(`No local translation found for '${phraseOrSlug}', using Google Translate...`);

        let translatedText = phraseOrSlug
        if(useGoogle){
            translatedText = await GoogleServiceProvider.translate.translateText({text: phraseOrSlug, targetLang: lang, format: contentType });
        }else{
            translatedText = await freeCloudTranslate(phraseOrSlug, lang)
        }
        // translatedText = await GoogleServiceProvider.translate.translateText({text: phraseOrSlug, targetLang: lang, format: contentType });


        // Save the new translation to general.json for future use
        if(saveToFile){
            saveTranslationToFile(slug, lang, translatedText);
        }

        return translatedText;
    } catch (error) {
        Logger.error('Error getting translation:', error);
        return phraseOrSlug;
    }
}




export async function freeCloudTranslate(text: string, targetLang: string, sourceLang?: string,): Promise<any> {
    try {
        if (!text || !targetLang) {
            throw new Error('Text, source language, and target language are required');
        }
        const translate = Translate({ engine: config.i18n.engine, key: config.i18n.key });        
        const translatedText = await translate(text, targetLang);
        return translatedText
    } catch (error: any) {
        Logger.error('Error translating text:', error?.response?.data);
        throw new Error(error?.response?.data?.error?.message)
    }
}


export const i18n = {
    getTranslation,
    freeCloudTranslate
};