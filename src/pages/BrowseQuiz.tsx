import { getRecentQuizzes } from '@/api/api'
import { QuizTable } from '@/components/pages/BrowseQuiz/QuizTable/QuizTable'
import { getErrorMessage } from '@/util'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const BrowseQuiz = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['recent_quizzes'],
    queryFn: getRecentQuizzes,
  })

  useEffect(() => {
    if (error) toast.error(getErrorMessage(error))
  }, [error])

  return (
    <div className='flex flex-col flex-1 w-full h-full gap-4 md:gap-8 max-w-[1000px] items-center'>
      <h3 className='w-full text-xl font-bold text-white md:text-4xl'>Explore Available Quizzes</h3>

      <QuizTable quizzes={data ?? []} loading={isPending} />

      <span className='-my-2 text-sm font-medium text-center text-red-600 md:-my-4'>
        Quizzes are submitted by users and are <span className='font-bold'>not moderated</span>.
      </span>
    </div>
  )
}
