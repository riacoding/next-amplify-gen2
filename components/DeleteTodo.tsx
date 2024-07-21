'use client'
import { useState } from 'react'
import { type Schema } from '@/amplify/data/resource'
type Todo = Schema['Todo']['type']

type Props = {
  todo: Todo
  deleteTodo: (id: string) => void
}

export default function DeleteTodo({ todo, deleteTodo }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const handleClick = (todo: Todo) => {
    setIsDeleting(true)
    console.log('deleting todo', todo.id)
    deleteTodo(todo.id)
  }
  return (
    <div style={{ display: 'flex' }}>
      {todo.content}
      <div onClick={() => handleClick(todo)}>{isDeleting === true ? '❌ deleting...' : '❌'}</div>
    </div>
  )
}
