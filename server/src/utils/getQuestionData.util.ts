import type { Game } from '@types';

interface QuestionData {
  questionNumber: number;
  totalQuestions: number;
  text: string;
  options: string[];
  timeLimitSec: number;
}

export const getQuestionData = ({
  currentQuestion,
  questions,
}: Game): QuestionData => ({
  questionNumber: currentQuestion + 1,
  totalQuestions: questions.length,
  text: questions[currentQuestion].text,
  options: questions[currentQuestion].options,
  timeLimitSec: questions[currentQuestion].timeLimitSec,
});
