7 -*
  [-+.

    mport { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['email', 'username', 'password', 'avatar'])
    const UserByEmail = await User.findBy('email', userPayload.email)

    if (UserByEmail) return response.conflict({ message: 'email alread in use' })

    const user = await User.create(userPayload) -
   return response.created({ user })
  }
}
