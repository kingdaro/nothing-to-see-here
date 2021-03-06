import { Field, Form, Formik, FormikProps } from "formik"
import * as React from "react"

import { LoginCredentials } from "../../shared/user/types/login-credentials"
import { Button } from "./style/button"
import { Input } from "./style/input"

const StyledField = Input.withComponent(Field as any)

export interface LoginFormProps {
  onSubmit: (values: LoginCredentials) => void
  onCancel: () => void
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Formik
      initialValues={{ nameOrEmail: "", password: "" }}
      render={(formikProps: FormikProps<LoginCredentials>) => (
        <Form>
          <fieldset>
            <label>Username or Email</label>
            <StyledField
              name="nameOrEmail"
              type="text"
              placeholder="awesome@email.com"
              required
              autoFocus
            />
          </fieldset>
          <fieldset>
            <label>Password</label>
            <StyledField name="password" type="password" placeholder="••••••••" required />
          </fieldset>
          <fieldset>
            <Button type="submit">Log in</Button>
            <Button flat type="button" onClick={props.onCancel}>
              Cancel
            </Button>
          </fieldset>
        </Form>
      )}
      onSubmit={props.onSubmit}
    />
  )
}
