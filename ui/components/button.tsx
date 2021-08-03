import React from "react"
import styled, { StyledComponent } from "styled-components"

// ******************** //
// LOCAL INCLUDES
// ******************** //

import {
  FS_SMALL,
  BLACK,
  WHITE,
  BLUE,
  BACKGROUND,
  SEPARATOR,
  ANIMATION_SPEED_MS
} from "@ui"

// ******************************** //
// Styles
// ******************************** //

const SharedButtonStyles = styled.button<{ hasIcon: boolean }>`
  cursor: pointer;
  width: 100%;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: ${FS_SMALL};
  font-weight: 500;
  transition: all ${ANIMATION_SPEED_MS}ms ease-out;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${props => props.hasIcon ? 'padding-right: 8px;' : ''}
`

export const ButtonPrimaryStyle = styled(SharedButtonStyles)`
  background-color: ${BLUE};
  border: 1px solid #127ac6;
  color: ${WHITE};
  fill: ${WHITE} !important;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 2px 0 #56a4ff, 0 4px 8px rgba(0, 0, 0, 0.16);

  &:hover {
    background-color: #0c71e9;
    box-shadow: inset 0 1px 0 #56a4ff, 0 2px 4px rgba(0, 0, 0, 0.24);
  }
`

export const ButtonSecondaryStyle = styled(SharedButtonStyles)`
  background-color: #f7f8fa;
  border: 1px solid ${SEPARATOR};
  color: ${BLACK};
  fill: ${BLACK} !important;
  text-shadow: 0 1px 0 ${WHITE};
  /* box-shadow: inset 0 2px ${WHITE}, 0 3px 6px rgba(0, 0, 0, 0.08); */

  &:hover {
    background-color: ${WHITE};
    /* box-shadow: inset 0 1px 0 ${WHITE}, 0 2px 4px rgba(0, 0, 0, 0.04); */
  }
`

export const ButtonDisabledStyle = styled(SharedButtonStyles)`
  user-select: none;
  cursor: default;
  background-color: ${BACKGROUND};
  border: 1px solid #dbe2ec;
  color: #8593a3;
  fill: #8593a3 !important;
  text-shadow: 0 1px 0 ${WHITE};
  box-shadow: inset 0 1px ${WHITE};
`

// ******************************** //
// Interfaces
// ******************************** //

interface DisabledButton {
  label: string
  icon?: React.ReactElement
  style?: React.CSSProperties
  onClick?: Function
}

interface Button extends DisabledButton {
  onClick: Function
}

interface ButtonGenerator extends Button {
  Wrapper: StyledComponent<any,any>
}

// ******************************** //
// Button Generator
// ******************************** //

export const generateButton = ({ label, icon, onClick, Wrapper, style }: ButtonGenerator) => {
  return (
    <Wrapper
      hasIcon={icon ? true : false}
      onClick={() => onClick()}
      style={style}>
      {label} {icon}
    </Wrapper>
  )
}

// ******************************** //
// EXPORTED BUTTONS
// ******************************** //

export const ButtonPrimary = (props: Button) => {
  return generateButton({
    ...props,
    Wrapper: ButtonPrimaryStyle
  })
}

export const ButtonSecondary = (props: Button) => {
  return generateButton({
    ...props,
    Wrapper: ButtonSecondaryStyle
  })
}

export const ButtonDisabled = (props: DisabledButton) => {
  return generateButton({
    ...props,
    onClick: props.onClick ? props.onClick : () => {},
    Wrapper: ButtonDisabledStyle
  })
}
