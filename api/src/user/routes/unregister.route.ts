import Koa from "koa"
import compose, { Middleware } from "koa-compose"

import { checkAuth } from "../../common/middleware/check-auth.middleware"
import { emptyResponse } from "../../common/middleware/empty-response.middleware"
import { logOut } from "../../common/middleware/log-out.middleware"
import { UserContext } from "../types/user-context.interface"
import { UserService } from "../user.service"

function removeUser(users: UserService): Middleware<UserContext> {
  return async (ctx, next) => {
    const { user } = ctx.state
    if (user) {
      await users.removeUser(user.username)
    }
    await next()
  }
}

export function unregisterRoute(users: UserService): Koa.Middleware {
  return compose([checkAuth(), removeUser(users), logOut(), emptyResponse()])
}