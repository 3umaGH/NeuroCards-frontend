import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getQuiz } from '../api/api'
import { Loading } from '../components/common/Loading'
import { QuizLayout } from '../components/layout/QuizLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '../util'
import { Quiz } from '../components/pages/QuizPage/Quiz/Quiz'

export const QuizPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const formattedId = isNaN(Number(id)) ? -1 : Number(id)

  const { isPending, error, data } = useQuery({
    queryKey: [`quiz`, id],
    queryFn: () => (formattedId !== -1 ? getQuiz(formattedId) : null),
  })

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error))
      navigate('/')
    }
  }, [error, navigate])

  useEffect(() => {
    if (formattedId === -1) {
      navigate('/')
    }
  }, [formattedId, navigate])

  return (
    <QuizLayout>
      {data && <Quiz topic={data.quiz_topic} initialQuestions={data.questions} />}
      {isPending && <Loading />}
    </QuizLayout>
  )
}
