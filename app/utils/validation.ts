export const MINIMUM_LENGTH = 10;
export const MAXIMUM_LENGTH = 1000;

// NGワードリスト
const NG_WORDS = {
  violence: [
    '殺す', '死ね', '暴力', '殴る', '刺す',
    '血', '傷つける', '破壊', '潰す', '痛め付ける'
  ],
  sexual: [
    'セックス', 'エッチ', '性行為',
    'おっぱい', 'ちんこ', '手マン', 'フェラ'
  ],
  discrimination: [
    '死ね', 'きもい', '障害者', '害児',
    '在日', '黒人', '白人', '差別', '劣等'
  ]
};

// 日本語文字列かどうかをチェック
export const isJapaneseText = (text: string): boolean => {
  const japaneseRegex = /^[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf\s々ー、。！？「」『）（）［］｛｝【】・…]+$/;
  return japaneseRegex.test(text.trim());
};

// テキスト長のバリデーション
export const validateLength = (text: string): { isValid: boolean; message?: string } => {
  if (text.length < MINIMUM_LENGTH) {
    return {
      isValid: false,
      message: `メッセージは最低${MINIMUM_LENGTH}文字以上入力してください。`
    };
  }
  if (text.length > MAXIMUM_LENGTH) {
    return {
      isValid: false,
      message: `メッセージは${MAXIMUM_LENGTH}文字以内で入力してください。`
    };
  }
  return { isValid: true };
};

// NGワードのチェック
export const checkNGWords = (text: string): { isValid: boolean; message?: string } => {
  for (const [category, words] of Object.entries(NG_WORDS)) {
    const foundWord = words.find(word => text.includes(word));
    if (foundWord) {
      return {
        isValid: false,
        message: '不適切な表現が含まれています。'
      };
    }
  }
  return { isValid: true };
};

// メッセージの総合バリデーション
export const validateMessage = (text: string): { isValid: boolean; message?: string } => {
  const lengthValidation = validateLength(text);
  if (!lengthValidation.isValid) {
    return lengthValidation;
  }

  const ngWordsValidation = checkNGWords(text);
  if (!ngWordsValidation.isValid) {
    return ngWordsValidation;
  }

  return { isValid: true };
};
