/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  newAccount: {
    store: typeof routes['new_account.store']
  }
  accessTokens: {
    store: typeof routes['access_tokens.store']
  }
  profile: {
    show: typeof routes['profile.show']
  }
}
