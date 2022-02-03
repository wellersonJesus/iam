import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUser)
    const UserByEmail = await User.findBy('email', userPayload.email)
    const UserByUsername = await User.findBy('username', userPayload.username)

    if (UserByEmail) throw new BadRequest('email already in use', 409)
    if (UserByUsername) throw new BadRequest('username already in use', 409)

    const user = await User.create(userPayload)
    return response.created({ user })
  }
}
