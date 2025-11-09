import type { ReactElement } from 'react';

export type Screen = 'home' | 'notes' | 'quiz' | 'chat' | 'qna' | 'profile';

export interface User {
  name: string;
  standard: string;
}

export interface NavItem {
  id: Screen;
  label: keyof TranslationKeys;
  // FIX: Changed JSX.Element to ReactElement to resolve "Cannot find namespace 'JSX'" error in a .ts file.
  icon: (props: { className?: string }) => ReactElement;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  image?: string;
}

export type Language = 'en' | 'hi' | 'hn';

export interface Translations {
  [key: string]: string;
}

export interface TranslationKeys {
  home: string;
  notes: string;
  quiz: string;
  ai_chat: string;
  qna: string;
  profile: string;
  welcome_back: string;
  whats_on_your_mind: string;
  generate_notes: string;
  enter_topic: string;
  generating_notes_message: string;
  notes_for_topic: string;
  quiz_practice: string;
  generate_quiz: string;
  enter_quiz_topic: string;
  generating_quiz_message: string;
  quiz_on_topic: string;
  ai_doubt_solver: string;
  ask_anything: string;
  sending: string;
  my_progress: string;
  overall_accuracy: string;
  quizzes_completed: string;
  weekly_performance: string;
  language: string;
  english: string;
  hindi: string;
  hinglish: string;
  submit: string;
  next_question: string;
  correct_answer: string;
  wrong_answer: string;
  your_answer: string;
  quiz_complete: string;
  your_score: string;
  play_again: string;
  select_language: string;
  ai_is_typing: string;
  get_started_notes: string;
  get_started_quiz: string;
  get_started_chat: string;
  quick_actions: string;
  name: string;
  class_stream: string;
  start_learning: string;
  qna_header: string;
  qna_placeholder: string;
  get_solution: string;
  or_upload_image: string;
  generating_solution_message: string;
  solution_for_question: string;
  capture_image: string;
  retake_photo: string;
  use_photo: string;
}