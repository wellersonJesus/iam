**_IAM_** _o objetivo é que esse serviço seja configurável e que funcione com qualquer outro serviço Qesh. Construir um IAM completo que a gente possa reutilizar em todos os nossos serviços._

_Teremos permissões, políticas, grupos de políticas (grupos de usuários) e usuários._

---

**_Recursos_**

- Postgres
- Insomnia
- VsCode
- [Adonis](https://blog.rocketseat.com.br/adonis-auth-jwt-api-rest/)
- [Node](https://medium.com/desenvolvimento-com-node-js/come%C3%A7ando-a-desenvolver-com-o-node-js-74b70af01a0d)
- yarn
- [mailtrap](https://mailtrap.io/register/signup)

**_Preparando ambiente_**

    npm install --global yarn
    node -v
    npm -v

    yarn create adonis-ts-app iam
        api |Estrutura de projeto
        name project
        setup eslint | yes
        setup pretier | yes

    yarn add japa execa@5.1.1 get-port@5.1.1 -D
    yarn sqlite3 -D

    node ace serve --watch
    curl http://localhost:3333

    yarn test
    yarn add -D supertest @types/supertest

    node ace make:controller User
    yarn add @adonisjs/lucid
    node ace configure @adonisjs/lucid
    node ace make:model User
    node ace make:migration users
    yarn add phc-argon2
    node ace make:exception BadRequest
    node ace make:validator CreateUser

    yarn add @adonisjs/mail
    node ace configure @adonis/mail

**_*Funcionalidade Cenario dos testes Padrão estilo*_**

    qrn:<id do usuário>:
    <id do escopo de cliente>:
    <id do recurso>:<permissão>

**_Categorizar recursos específicos_**

1. Tipo: Se é de todas as contas
2. Tipo: Se é de um grupo de contas apenas,

- UserMaster => Representa o User mestre com acesso total. Usuário ID gustavo, tem permissão total banco qeshdev

       qrn:gustavo:qeshdev:*:*

- User => Representa usuário com ID arantes, tem permissão apenas para ver os extratos das contas do banco qeshdev:

      qrn:gustavo:qeshdev:account:getStatements

- Group => Representa grupos existentes de contas

---
