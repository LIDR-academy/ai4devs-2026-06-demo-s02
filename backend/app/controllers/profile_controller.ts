import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }
}
