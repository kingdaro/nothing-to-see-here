import styled, { css } from "react-emotion"

import { foregroundColor, shadowColor } from "../colors"

export const raisedPanelStyles = css`
  background-color: ${foregroundColor};
  box-shadow: 0px 0px 12px ${shadowColor};
`

export const RaisedPanel = styled.div`
  ${raisedPanelStyles};
`