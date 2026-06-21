import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AccessTokensController {
  async store({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    user.lastLoginAt = DateTime.now()
    await user.save()

    return {
      user: { id: user.id, email: user.email },
      accessToken: token.value!.release(),
    }
  }
}
