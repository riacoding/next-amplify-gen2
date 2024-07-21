// utils/amplify-utils.ts
import { cookies } from 'next/headers'
import { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api'
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth/server'

import { type Schema } from '@/amplify/data/resource'
import outputs from '@/amplify_outputs.json'

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
})

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
})

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })
    return currentUser
  } catch (error) {
    console.error(error)
  }
}

export async function AuthGetCurrentUserGroupsServer() {
  let groups: (string | undefined)[] = []
  try {
    const currentUser = await AuthGetCurrentUserServer()
    if (currentUser) {
      const client = new CognitoIdentityProviderClient({
        region: outputs.auth.aws_region,
      })

      const username = currentUser.username
      const userPoolId = outputs.auth.user_pool_id

      const command = new AdminListGroupsForUserCommand({
        UserPoolId: userPoolId,
        Username: username,
      })

      const response = await client.send(command)

      // Extract groups from the response
      if (response.Groups !== undefined) {
        groups = response.Groups?.map((group) => group.GroupName)
        return groups
      }
    }

    return groups
  } catch (error) {
    console.error('Error fetching groups', error)
  }
}

export async function AuthGetUserAttributes() {
  try {
    const attributes = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    })
    return attributes
  } catch (error) {
    console.error(error)
  }
}

export async function AuthGetSession() {
  try {
    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    })
    return session
  } catch (error) {
    console.error(error)
  }
}
