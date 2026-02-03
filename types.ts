export interface FlashcardData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  englishDefinition: string; // Definition in English
  vietnameseDefinition: string; // Definition explained in Vietnamese
  exampleSentence: string;
  exampleSentenceMeaning: string; // New field: Meaning of the example in Vietnamese
  tip?: string; // Mnemonic or usage tip
}

export enum AppState {
  INPUT = 'INPUT',
  STUDY = 'STUDY',
  ERROR = 'ERROR'
}

export interface DeckStats {
  total: number;
  current: number;
  viewed: Set<number>;
}