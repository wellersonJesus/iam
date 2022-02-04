import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories/'
import test from 'japa'
import supertest from 'supertest'
import Hash from '@ioc:Adonis/Core/Hash'


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

/*
{
  "users": {
    "id": number,
    "username": string,
    "password": string,
    "avatar": string
  }
}
*/
//Deve Criar um usuario
test.group('User', (group) => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/image/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, 'Password defined')
  })
  //Retorna erro 409 quando email já estiver sendo utilizado
  test('it should return 409 whe email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      })
      .expect(409)

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })
  //Retorna erro 409 quando username já estiver sendo utilizado
  test('it should return 409 whe username is already in use', async (assert) => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        username,
        email: 'test@test.com',
        password: 'test',
      })
      .expect(409)

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })
  //Retornar 422 quando os dados necessários não são fornecidos
  test('it should return 422 whe required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({}).expect(422)
    //console.log({ body: JSON.stringify(body) })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Retornar 422 quando forneceu um email inválido
  test('it should return 422 whe provided an invalid email', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'test@',
        password: 'test',
        username: 'test',
      })
      .expect(422)
    //console.log({ body: JSON.stringify(body) })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Retornar 422 quando forneceu um password inválido
  test('it should return 422 whe provided an invalid password', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'test@test.com',
        password: 'tes',
        username: 'test',
      })
      .expect(422)
    //console.log({ body: JSON.stringify(body) })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Atualizar um usuário
  test('it should update an user', async (assert) => {
    const { id, password } = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = 'http://github.com/wellersonjesus.png'

    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email,
        avatar,
        password,
      })
      .expect(200)

    assert.exists(body.user, 'User undefined')
    assert.equal(body.user.email, email)
    assert.equal(body.user.avatar, avatar)
    assert.equal(body.user.id, id)
  })
  //Atualiza senha do usuário
  test('it should update the password of the user', async (assert) => {
    const user = await UserFactory.create()
    const password = 'test'

    const { body } = await supertest(BASE_URL)
      .put(`/users/${user.id}`)
      .send({
        email: user.email,
        avatar: user.avatar,
        password,
      })
      .expect(200)

    assert.exists(body.user, 'User undefined')
    assert.equal(body.user.id, user.id)

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })
  //Retorna 422 quando os dados necessários não são fornecidos
  test('it should return 422 when required data is not provided', async (assert) => {
    const { id } = await UserFactory.create()
    const { body } = await supertest(BASE_URL).put('/users/${id}').send({}).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Retornar 422 ao fornecer um e-mail inválido
  test('it should return 422 when providing an invalid email', async (assert) => {
    const { id, password, avatar } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put('/users/${id}')
      .send({
        password,
        avatar,
        email: 'test@',
      })
      .expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Retornar 422 ao fornecer uma senha inválida
  test('it should return 422 when providing an invalid password', async (assert) => {
    const { id, email, avatar } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put('/users/${id}')
      .send({
        email,
        avatar,
        password: 'tes',
      })
      .expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  //Retornar 422 ao fornecer um avatar inválido
  test('it should return 422 when providing an invalid avatar', async (assert) => {
    const { id, email, password } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put('/users/${id}')
      .send({
        email,
        password,
        avatar: 'test',
      })
      .expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })


  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
