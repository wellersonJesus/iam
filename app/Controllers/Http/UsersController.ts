import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async store({ response }: HttpContextContract) {
    return response.created({})
  }
}
