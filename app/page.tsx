// app/page.tsx
import { useState, useEffect } from 'react'
import { revalidatePath } from 'next/cache'
import {
  cookiesClient,
  AuthGetCurrentUserServer,
  AuthGetUserAttributes,
  AuthGetCurrentUserGroupsServer,
} from '@/utils/amplify-utils'
import Logout from '@/components/Logout'
import StatusButton from '@/components/StatusButton'
import DeleteTodo from '@/components/DeleteTodo'
async function App() {
  const user = await AuthGetUserAttributes()
  const groups = await AuthGetCurrentUserGroupsServer()

  console.log('has Admin', groups?.includes('admin'))

  //{ filter: { done: { eq: false } } }

  const { data: todos } = await cookiesClient.models.Todo.list()

  async function addTodo(data: FormData) {
    'use server'
    console.log('adding todo')

    const title = data.get('title')?.toString()
    const start = performance.now()
    await cookiesClient.models.Todo.create({
      content: title,
      done: false,
      priority: 'medium',
    })
    const end = performance.now()
    console.log(`Execution time: ${end - start} ms`)
    revalidatePath('/')
  }

  async function deleteTodo(id: string) {
    'use server'
    console.log('deleting todo')
    await cookiesClient.models.Todo.delete({ id })
    revalidatePath('/')
  }

  return (
    <>
      <h1>Hello, Amplify 👋</h1>
      {groups?.includes('admin') ? <div>Admin Only</div> : <div>Guest</div>}
      {user && <Logout />}
      <form action={addTodo}>
        <input type='text' name='title' />
        <StatusButton title='Add Todo' />
      </form>

      <ul style={{ listStyle: 'none' }}>
        {todos &&
          todos.map((todo) => (
            <li key={todo.id}>
              <DeleteTodo todo={todo} deleteTodo={deleteTodo} />
            </li>
          ))}
      </ul>
    </>
  )
}

export default App
