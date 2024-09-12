export interface QuestionSet {
  id: string;
  title: string;
  videos: Video[];
  questions: Question[];
}

export interface Video {
  id: string;
  url: string;
  title: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}
