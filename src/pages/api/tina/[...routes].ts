import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { TinaAuthJSOptions, TinaCredentialsProvider } from 'tinacms-authjs'

import databaseClient from '../../../../tina/__generated__/databaseClient'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

// Helper function placeholders for TinaCredentialsProvider - will not be called if provider is commented out
// const compare = async (a: string, b: string) => a === b; 
// class ErrorWithCode extends Error { constructor(message: string, code: string) { super(message); this.name = code; } }

const handler = TinaNodeBackend({
  // TODO: Remove isLocal when https://github.com/tinacms/tinacms/pull/5049 is merged
  isLocal: isLocal,
  // FIXME: Remove isLocal check when https://github.com/tinacms/tinacms/pull/5049 is merged
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : TinaAuthJSOptions({
        databaseClient: databaseClient,
        secret: process.env.NEXTAUTH_SECRET!,
        callbacks: {
          async session({ session, token }: { session: any, token: any }) {
            const user = await databaseClient.getUser({
              sub: token.sub!,
            })
            if (user) {
              session.user = {
                ...session.user,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
              }
            }
            return session
          },
          async jwt({ token, user, /* account, */ /* profile */ }: { token: any, user: any, account?: any, profile?: any}) {
            if (user) {
              const tinaUser = await databaseClient.createUser({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                verified: user.emailVerified,
                sub: token.sub,
              })
              token.id = tinaUser.id
              token.role = tinaUser.role
              token.verified = tinaUser.verified
            }
            return token
          },
        },
        // customProviders: [
        //   TinaCredentialsProvider({
        //     // @ts-expect-error
        //     authorize: async (credentials, req) => {
        //       const user = await databaseClient.getUser({
        //         // @ts-expect-error
        //         email: credentials.email,
        //       })

        //       if (!user) {
        //         throw new ErrorWithCode(
        //           'Invalid email or password',
        //           'INVALID_CREDENTIALS'
        //         )
        //       }

        //       // @ts-expect-error
        //       if (user && (await compare(credentials.password, user.password))) {
        //         return {
        //           // @ts-expect-error
        //           id: user.id,
        //           // @ts-expect-error
        //           name: user.name,
        //           // @ts-expect-error
        //           email: user.email,
        //           // @ts-expect-error
        //           role: user.role,
        //           // @ts-expect-error
        //           verified: user.verified,
        //         }
        //       } else {
        //         throw new ErrorWithCode(
        //           'Invalid email or password',
        //           'INVALID_CREDENTIALS'
        //         )
        //       }
        //     },
        //   }),
        // ],
      }),
  databaseAdapter: databaseClient,
})

export const GET = async (context: any) => {
  // TODO: Remove when https://github.com/tinacms/tinacms/pull/5049 is merged
  const request = {
    ...context.request,
    // FIXME: TinaNode backend expects the query object to be on the request
    query: Object.fromEntries(context.url.searchParams),
  }
  const result = await handler(request, context.response)
  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  })
}

export const POST = async (context: any) => {
  // TODO: Remove when https://github.com/tinacms/tinacms/pull/5049 is merged
  const request = {
    ...context.request,
    // FIXME: TinaNode backend expects the query object to be on the request
    query: Object.fromEntries(context.url.searchParams),
  }
  const result = await handler(request, context.response)
  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  })
}

// TODO: Remove when https://github.com/tinacms/tinacms/pull/5049 is merged
export const PUT = async (context: any) => {
  // TODO: Remove when https://github.com/tinacms/tinacms/pull/5049 is merged
  const request = {
    ...context.request,
    // FIXME: TinaNode backend expects the query object to be on the request
    query: Object.fromEntries(context.url.searchParams),
  }
  const result = await handler(request, context.response)
  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  })
} 