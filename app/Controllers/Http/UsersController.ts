import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['email', 'username', 'password', 'avatar'])
    const UserByEmail = await User.findBy('email', userPayload.email)

    if (UserByEmail)
      throw new BadRequest('email already in use', 409)

    const user = await User.create(userPayload)
    return response.created({ user })
  }
}
