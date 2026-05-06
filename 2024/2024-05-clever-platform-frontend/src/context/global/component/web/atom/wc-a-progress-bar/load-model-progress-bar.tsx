import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Define the supported languages
type SupportedLanguage = 'en' | 'th' | 'zh';

// Define the structure of our translations
interface TranslationObject {
  update: string;
  model: string;
  footerText: string;
  models: string; // Added translation for "models"
  [key: string]: string; // Allow for additional keys
}

interface Translations {
  en: TranslationObject;
  th: TranslationObject;
  zh: TranslationObject;
}

interface ProgressBarProps {
  progress: number;
  title?: string;
  footer?: string;
}

const ProgressBar = ({ progress, title, footer }: ProgressBarProps) => {
  // Create a translations object with all languages
  const translations: Translations = {
    en: {
      update: 'Update new content......',
      model: 'Model',
      models: 'models',
      footerText: 'Loading level data...',
    },
    th: {
      update: 'อัปเดตเนื้อหาใหม่......',
      model: 'โมเดล',
      models: 'โมเดล',
      footerText: 'กำลังโหลดข้อมูลระดับ...',
    },
    zh: {
      update: '更新新内容......',
      model: '模型',
      models: '模型',
      footerText: '加载等级数据...',
    },
  };
  const { t } = useTranslation(['global']);
  // State to track current language, properly typed
  const [language, setLanguage] = useState<SupportedLanguage>(
    (localStorage.getItem('language') as SupportedLanguage) || 'en',
  );

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'language' && event.newValue) {
        // Validate that it's a supported language
        const newLang = event.newValue as SupportedLanguage;
        if (newLang === 'en' || newLang === 'th' || newLang === 'zh') {
          setLanguage(newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simple translation function with proper typing
  // const t = (key: string): string => {
  //   // Make sure language is valid, default to 'en' if not
  //   const currentLang: SupportedLanguage =
  //     language === 'en' || language === 'th' || language === 'zh' ? language : 'en';

  //   // Get the translation, defaulting to the key if not found
  //   return title || key;
  // };

  // Function to determine if footer contains loading data
  const isLoadingDataFooter = (footerText?: string): boolean => {
    if (!footerText) return false;

    // Check for patterns that indicate loading data
    // Looking for patterns like "MB", "/", "models", or numbers with decimals
    return (
      footerText.includes('MB') ||
      footerText.includes('/') ||
      /\d+\.\d+/.test(footerText) || // Check for decimal numbers
      footerText.includes('models')
    );
  };

  // Function to translate the loading data footer
  const translateLoadingFooter = (footerText: string): string => {
    // Example input: "143.73MB/292.73MB (30/179 models)"

    // Match pattern: numbers, MB, slashes, and parentheses with numbers
    const regex = /(\d+\.\d+)MB\/(\d+\.\d+)MB \((\d+)\/(\d+) models\)/;
    const match = footerText.match(regex);

    if (match) {
      // Extract the numbers
      const [, loadedSize, totalSize, loadedModels, totalModels] = match;

      // Get the translated word for "models"
      const modelsTranslation = t('default-models');

      // Format the string with the translated word
      return `${loadedSize}MB/${totalSize}MB (${loadedModels}/${totalModels} ${modelsTranslation})`;
    }

    // If pattern doesn't match, return original text
    return footerText;
  };

  const dot = 3; // For dot animation in title
  const defaultTitle = t('default-update'); // Using the correct key
  const footerTitle = t('default-footerText');
  const finalTitle = title || defaultTitle;

  // Determine which footer text to display
  const displayFooter = footer
    ? isLoadingDataFooter(footer)
      ? translateLoadingFooter(footer)
      : footerTitle
    : '';

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="text-center text-2xl">{finalTitle}</div>
      <div className="flex gap-2 w-full justify-center items-center">
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div className="relative w-full bg-gray-200 rounded-full h-5 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-[length:200%_100%] animate-[progressGradient_2s_linear_infinite]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-2xl w-4">{progress}%</div>
      </div>
      {footer && <div className="text-end w-full text-2xl">{displayFooter}</div>}
    </div>
  );
};

export default ProgressBar;
