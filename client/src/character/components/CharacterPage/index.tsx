import { action, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Link, Redirect } from "react-router-dom"

import { Icon } from "../../../app/components/Icon"
import { routePaths } from "../../../routePaths"
import { Button, PageSection, PageTitle, PageWrapperPanel } from "../../../styles/elements"
import { deleteCharacter, getCharacterById } from "../../firebaseActions"
import { CharacterModel } from "../../models/CharacterModel"

@observer
export class CharacterPage extends React.Component<{ id: string }> {
  @observable character: CharacterModel | null = null
  @observable shouldRedirect = false

  @action
  setCharacter = (character: CharacterModel) => {
    this.character = character
  }

  @action
  triggerRedirect = () => {
    this.shouldRedirect = true
  }

  handleDeleteAction = async () => {
    if (!this.character) return

    const result = window.prompt(
      "Type your character's name if you really really wanna delete them:",
    )
    if (result === this.character.name) {
      await deleteCharacter(this.character.id)
      this.triggerRedirect()
    } else {
      window.alert("Name was incorrect.")
    }
  }

  async componentDidMount() {
    this.setCharacter(await getCharacterById(this.props.id))
  }

  render() {
    if (this.shouldRedirect) {
      return <Redirect to={routePaths.characterList} />
    }

    if (!this.character) {
      return null
    }

    return (
      <PageWrapperPanel>
        <PageTitle>{this.character.name}</PageTitle>
        <PageSection>{this.character.tagline}</PageSection>
        <hr />
        <PageSection>
          <Link to={routePaths.editCharacter(this.character.id)}>
            <Button flat>
              <Icon name="edit" /> Edit
            </Button>
          </Link>
          <Button flat onClick={this.handleDeleteAction}>
            <Icon name="trash" /> Delete
          </Button>
        </PageSection>
      </PageWrapperPanel>
    )
  }
}