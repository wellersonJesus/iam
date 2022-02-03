import { UserFactory } from './../../database/factories/index';
import test from "japa"
import { Assert } from "japa/build/src/Assert"
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database';

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
    assert.equal(body.user.avatar, userPayload.avatar)
    assert.notExists(body.user.password, 'Password defined')
  })
  //Retorna erro 409 quando email já estiver sendo utilizado
  test.only('it should return 409 whe email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      })
      .expect(409)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
