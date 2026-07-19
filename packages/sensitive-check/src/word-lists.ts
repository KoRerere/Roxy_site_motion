import AdsWordsRaw from './words/ads.txt?raw'
import illegalWordsRaw from './words/illegal.txt?raw'
import politicsWordsRaw from './words/politics.txt?raw'
import violenceWordsRaw from './words/violence.txt?raw'

function parseWordList(content: string): string[] {
  return content
    .split(/\r?\n/g)
    .map(word => word.trim())
    .filter(Boolean)
}

export const builtinSensitiveWords = [
  ...parseWordList(illegalWordsRaw),
  ...parseWordList(politicsWordsRaw),
  ...parseWordList(violenceWordsRaw),
  ...parseWordList(AdsWordsRaw),
]
