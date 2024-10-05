import { useEffect, useState } from 'react'
import { QuestionGrade } from '../../../constants/quiz'
import { FlashCardAnsweredQuestion, FlashCardQuestion } from '../../../types/quiz'
import { QuizLayout } from '../../layout/QuizLayout'
import { FlashCard } from './FlashCard'
import { QuizResult } from './QuizResult'
import { QuizStatus } from './QuizStatus'

type Quiz = {
  initialQuestions: FlashCardQuestion[]
}

export const Quiz = ({ initialQuestions }: Quiz) => {
  const [questions, setQuestions] = useState<FlashCardQuestion[]>([...initialQuestions]) // Unanswered questions;
  const [answeredQuestions, setAnsweredQuestions] = useState<FlashCardAnsweredQuestion[]>([])
  const [totalQuestionsLength, setTotalQuestionsLength] = useState(initialQuestions.length)
  const [isEndlessMode, setEndlessMode] = useState(false)
  const [isFlipped, setFlipped] = useState(false)
  const isQuizFinished = questions.length === 0

  const handleGradeQuestion = (grade: QuestionGrade) => {
    setAnsweredQuestions(p => [...p, { ...questions[0], grade: grade, answered_at: Date.now() }])

    setQuestions(prev => {
      if (isEndlessMode) {
        return [...prev.slice(1), prev[0]]
      } else {
        return prev.slice(1)
      }
    })
  }

  const resetGame = (newQuestions: FlashCardQuestion[], endless: boolean) => {
    setQuestions(() => {
      const newQuestionsState = [...newQuestions]
      setAnsweredQuestions([])
      setTotalQuestionsLength(newQuestionsState.length)
      setEndlessMode(endless)

      return newQuestionsState
    })
  }

  const handleGameRestart = () => {
    resetGame([...initialQuestions], false)
  }

  const handleEndlessGameStart = () => {
    resetGame([...initialQuestions], true)
  }

  const handleRetryBadGradesStart = (questionIds: number[]) => {
    resetGame([...initialQuestions.filter(question => questionIds.includes(question.id))], false)
  }

  const handleStopEndlessMode = () => {
    setQuestions([])
  }

  useEffect(() => {
    setFlipped(false)
  }, [questions])

  return (
    <QuizLayout>
      <h3 className='w-full my-4 text-2xl font-bold text-left text-white'>Learning the whatever</h3>
      {!isQuizFinished ? (
        <FlashCard question={questions[0]} flipped={isFlipped} onGradeClick={handleGradeQuestion} />
      ) : (
        <QuizResult
          answeredQuestions={answeredQuestions}
          onRetryClick={handleGameRestart}
          onEndlessModeClick={handleEndlessGameStart}
          onBadGradeRetryClick={handleRetryBadGradesStart}
        />
      )}
      <QuizStatus
        totalQuestions={totalQuestionsLength}
        questionsLeft={questions.length}
        buttonEnabled={!isFlipped}
        isEndlessMode={isEndlessMode}
        isFinished={isQuizFinished}
        onFlipClick={() => setFlipped(true)}
        onStopEndlessModeClick={handleStopEndlessMode}
      />
    </QuizLayout>
  )
}
