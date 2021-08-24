import React from 'react'
import { TextInput } from 'react-native'
import { useThemeContext } from '../../contexts/ThemeProvider'
import { tailwind } from '../../tailwind'
import { ThemedProps } from './index'

type ThemedTextInputProps = TextInput['props'] & ThemedProps

export function ThemedTextInput (props: ThemedTextInputProps): JSX.Element {
  const { theme } = useThemeContext()
  const { style, light = 'text-gray-700 bg-white', dark = 'text-white bg-darksurface', ...otherProps } = props
  return (
    <TextInput
      placeholderTextColor={theme === 'light' ? 'rgba(0, 0, 0, 0.4)' : '#828282'}
      style={[style, tailwind(theme === 'light' ? light : dark)]} {...otherProps}
    />
  )
}
