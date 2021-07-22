import React from 'react'
import { StyleSheet, TextInput as DefaultTextInput, View as DefaultView } from 'react-native'
import { Text as DefaultText, TextProps } from './Text'

const Default = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'RegularFont'
  }
})

export function Text (props: TextProps): JSX.Element {
  return <DefaultText {...props} />
}

export function View (props: DefaultView['props']): JSX.Element {
  const { style, ...otherProps } = props

  return <DefaultView style={[style]} {...otherProps} />
}

export function TextInput (props: DefaultTextInput['props']): JSX.Element {
  const { style, ...otherProps } = props

  return <DefaultTextInput style={[Default.text, style]} {...otherProps} />
}
