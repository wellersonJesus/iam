import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])

    await Mail.send((message) => {
      message
        .from('no-reply@iam.com')
        .to(email)
        .subject('Roleplay: Recuperação de Senha')
        .text('Clique no link abaixo para redefinir a sua senha.')
    })

    return response.noContent()
  }
}
