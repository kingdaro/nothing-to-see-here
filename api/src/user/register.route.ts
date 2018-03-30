import Koa, { Context } from "koa"
import compose, { Middleware } from "koa-compose"

import { validateBody } from "../middleware/validate-body"
import { createUserToken } from "./create-user-token.middleware"
import { NewUserData, newUserDataSchema } from "./new-user-data.interface"
import { sendUserToken } from "./send-user-token.middleware"
import { UserContext } from "./user-context.interface"
import { UserService } from "./user.service"

function checkUserExistence(users: UserService): Middleware<Context> {
  return async (ctx, next) => {
    const { username, email } = ctx.request.body as NewUserData
    if (await users.userExists(username, email)) {
      ctx.body = { error: "User already exists" }
      return
    }
    await next()
  }
}

function createUser(users: UserService): Middleware<UserContext> {
  return async (ctx, next) => {
    const newUserData = ctx.request.body as NewUserData
    ctx.state.user = await users.createUser(newUserData)
    await next()
  }
}

export function handleRegisterRoute(users: UserService): Koa.Middleware {
  return compose([
    validateBody(newUserDataSchema),
    checkUserExistence(users),
    createUser(users),
    createUserToken(users),
    sendUserToken(),
  ])
}
