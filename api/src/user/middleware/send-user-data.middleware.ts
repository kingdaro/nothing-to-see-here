import { Middleware } from "koa-compose"

import { ClientUserData } from "../../../../shared/user/types/client-user-data"
import { UserContext } from "../types/user-context.interface"

export function sendUserIdentity(): Middleware<UserContext> {
  return async (ctx, next) => {
    if (ctx.state.user) {
      const { username, displayName } = ctx.state.user
      ctx.body = { ...ctx.body, username, displayName } as ClientUserData
    }
    await next()
  }
}
