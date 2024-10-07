import React, { useRef, useState } from 'react'
import { FaFile } from 'react-icons/fa'
import { IoCloudUploadOutline } from 'react-icons/io5'
import pdfToText from 'react-pdftotext'
import { Button } from '../../common/Button'

export const AiTab = () => {
  const [text, setText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 50

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value

    if (value.length > maxLength) {
      e.preventDefault()
      return
    }

    setText(value)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    const file = e.target.files[0]
    pdfToText(file)
      .then(text => setText(text.replaceAll('   ', ' ')))
      .catch(error => console.error('Failed to extract text from pdf'))
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
  }

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <div className='flex flex-col flex-1 h-full gap-4 animate-fade-in'>
      <div className='flex flex-col items-center justify-center gap-2 my-8'>
        <IoCloudUploadOutline className='w-12 h-12 text-gray-400' />
        <span className='text-sm'>Upload (.pdf .docx .txt)</span>
        <span className='text-sm'>Max 5MB</span>

        <input ref={fileInputRef} type='file' onChange={handleFileChange} accept='application/pdf' className='hidden' />

        <Button
          onClick={handleImportClick}
          className='px-2 py-1 mt-4 text-teal-800 bg-green-50 outline outline-teal-500 max-w-[120px] flex items-center gap-2 justify-center'>
          <FaFile />
          Import
        </Button>
      </div>

      <span className='py-1 text-xl text-center border-t-[1px] border-b-[1px] font-medium text-gray-600'>
        Or Paste Text
      </span>

      <div className='flex flex-col flex-1 gap-2'>
        <div className='flex flex-col flex-1 gap-2'>
          <label htmlFor='textarea' className='text-sm font-medium'>
            Study materials:
          </label>

          <textarea
            id='textarea'
            className='w-full p-2 bg-gray-50 rounded-xl min-h-[50px] h-full focus:outline-blue-200'
            onChange={handleTextChange}
            value={text}
          />
        </div>

        <span className='flex justify-between gap-2 text-xs text-gray-500 md:text-sm'>
          Flash cards will be generated from this text
          <span className={text.length === maxLength ? 'text-red-600' : ''}>
            {text.length}/{maxLength}
          </span>
        </span>
      </div>

      {/*} <div className='flex items-center gap-2'>
        <input type='checkbox' id='share' /> <label htmlFor='share'>Show in the public list</label>
      </div>*/}

      <Button disabled className='self-end w-min'>
        Submit
      </Button>
    </div>
  )
}
