'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Loader } from '@aws-amplify/ui-react'

type Props = {
  title: string
}

export default function StatusButton({ title }: Props) {
  const { pending } = useFormStatus()
  return (
    <button style={{ width: '100px' }} type='submit'>
      {pending === true ? <Loader /> : title}
    </button>
  )
}
