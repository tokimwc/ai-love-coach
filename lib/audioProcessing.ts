export class AudioProcessor {
  private sampleRate: number;
  private fftSize: number;

  constructor(sampleRate: number = 44100, fftSize: number = 2048) {
    this.sampleRate = sampleRate;
    this.fftSize = fftSize;
  }

  // 簡易的なフーリエ変換
  private fft(signal: Float32Array): Float32Array {
    const n = signal.length;
    if (n <= 1) return signal;

    const even = this.fft(signal.filter((_, i) => i % 2 === 0));
    const odd = this.fft(signal.filter((_, i) => i % 2 === 1));

    const combined = new Float32Array(n);
    for (let k = 0; k < n / 2; k++) {
      const t = odd[k] * Math.exp(-2 * Math.PI * 1i * k / n);
      combined[k] = even[k] + t;
      combined[k + n / 2] = even[k] - t;
    }

    return combined;
  }

  // 音声データからスペクトログラムを生成
  generateSpectrogram(audioData: Float32Array): Float32Array[] {
    const spectrogram: Float32Array[] = [];
    for (let i = 0; i < audioData.length; i += this.fftSize) {
      const slice = audioData.slice(i, i + this.fftSize);
      const spectrum = this.fft(slice);
      spectrogram.push(spectrum);
    }
    return spectrogram;
  }

  // スペクトログラムから簡易的に音素を推定
  estimatePhonemes(spectrogram: Float32Array[]): string[] {
    // 実際の音素推定はもっと複雑ですが、ここでは簡略化しています
    const phonemes: string[] = [];
    const vowels = ['a', 'i', 'u', 'e', 'o'];
    const consonants = ['k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'];

    for (const spectrum of spectrogram) {
      const maxFreq = spectrum.indexOf(Math.max(...spectrum));
      if (maxFreq < spectrum.length / 2) {
        phonemes.push(vowels[Math.floor(Math.random() * vowels.length)]);
      } else {
        phonemes.push(consonants[Math.floor(Math.random() * consonants.length)]);
      }
    }

    return phonemes;
  }

  // 音素列から簡易的に単語を推定
  estimateWords(phonemes: string[]): string {
    // 実際の単語推定はもっと複雑ですが、ここでは簡略化しています
    return phonemes.join('');
  }

  // 音声データを文字列に変換
  transcribe(audioData: Float32Array): string {
    const spectrogram = this.generateSpectrogram(audioData);
    const phonemes = this.estimatePhonemes(spectrogram);
    return this.estimateWords(phonemes);
  }
}

export class EmotionAnalyzer {
  private emotionKeywords: Record<string, string[]> = {
    happy: ['happy', 'joy', 'excited', 'glad', 'delighted'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'blue'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed'],
    neutral: ['okay', 'fine', 'normal', 'average', 'so-so']
  };

  analyzeEmotion(text: string): string {
    const words = text.toLowerCase().split(/\s+/);
    const emotionScores: Record<string, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0
    };

    for (const word of words) {
      for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
        if (keywords.includes(word)) {
          emotionScores[emotion]++;
        }
      }
    }

    const dominantEmotion = Object.entries(emotionScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return dominantEmotion;
  }
}