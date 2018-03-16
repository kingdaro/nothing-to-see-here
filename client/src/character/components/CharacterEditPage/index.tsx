import { Formik } from "formik"
import { History } from "history"
import { observer } from "mobx-react"
import * as React from "react"
import { Route } from "react-router-dom"

import { ErrorPage } from "../../../app/components/ErrorPage"
import { authStore } from "../../../auth/stores/AuthStore"
import { createFetcher } from "../../../common/components/Fetcher"
import { routePaths } from "../../../routePaths"
import { PageSection, PageTitle, PageWrapperPanel } from "../../../ui/elements"
import { getCharacterById, updateCharacter } from "../../firebaseActions"
import { CharacterModel } from "../../models/CharacterModel"
import { CharacterForm, CharacterFormValues } from "../CharacterForm"

const CharacterFetcher = createFetcher<CharacterModel>()

interface Props {
  id: string
}

@observer
export class CharacterEditPage extends React.Component<Props> {
  render() {
    return (
      <CharacterFetcher
        fetch={() => getCharacterById(this.props.id)}
        render={fs => {
          switch (fs.state) {
            case "success":
              return <SuccessResult character={fs.data} />
            case "error":
              return (
                <ErrorPage
                  message={`Could not find character by id ${this.props.id}.`}
                  error={fs.error}
                />
              )
            default:
              return null
          }
        }}
      />
    )
  }
}

function SuccessResult({ character }: { character: CharacterModel }) {
  const initialValues: CharacterFormValues = {
    name: character.name,
    description: character.tagline,
  }

  return (
    <PageWrapperPanel>
      <PageTitle>editing {character.name}</PageTitle>
      <PageSection>
        <Route
          render={({ history }) => (
            <Formik
              initialValues={initialValues}
              render={props => (
                <CharacterForm
                  values={props.values}
                  onSubmit={props.handleSubmit}
                  onChange={props.handleChange}
                />
              )}
              onSubmit={createSubmitHandler(history, character)}
            />
          )}
        />
      </PageSection>
    </PageWrapperPanel>
  )
}

const createSubmitHandler = (history: History, character: CharacterModel) => async (
  values: CharacterFormValues,
) => {
  const { user } = authStore
  if (!user) return

  await updateCharacter(character.id, {
    name: values.name,
    tagline: values.description,
  })

  history.push(routePaths.characterList)
}
