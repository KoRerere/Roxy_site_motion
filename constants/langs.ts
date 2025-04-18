interface Language {
  title: string;
  code: string;
  icon?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { title: 'English', code: 'en' },
  { title: '中文', code: 'zh' },
  // TODO：俄语暂时关闭入口
  // { title: 'Русский', code: 'ru' },
] as const;

// 默认语言
export const DEFAULT_LANGUAGE = 'en';

// 备选语言（未来可能支持的语言）
export const FUTURE_LANGUAGES: Language[] = [
  { title: 'Français', code: 'fr' },
  { title: 'Español', code: 'es' },
  { title: '日本語', code: 'ja' },
  { title: '한국어', code: 'ko' },
] as const;

// 获取语言标题的辅助函数
export function getLanguageTitle(code: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.title || code;
}

// 检查是否支持某种语言
export function isLanguageSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
} 


export const DEFAULT_BLOG_POST_LIMIT = 9;