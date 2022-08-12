import { StyleProp, View, ViewProps, ViewStyle } from 'react-native'
import NumberFormat from 'react-number-format'
import BigNumber from 'bignumber.js'
import { tailwind } from '@tailwind'
import { ThemedProps, ThemedText, ThemedView } from './themed'
import { IconTooltip } from './tooltip/IconTooltip'
import { ActiveUSDValueV2 } from '@screens/AppNavigator/screens/Loans/VaultDetail/components/ActiveUSDValueV2'

type INumberRowProps = React.PropsWithChildren<ViewProps> & NumberRowProps

interface NumberRowProps extends ThemedProps {
  lhs: NumberRowElement
  rhs: RhsNumberRowElement
  containerStyle?: ThemedProps & { style: ThemedProps & StyleProp<ViewStyle> }
}

interface RhsNumberRowElement extends NumberRowElement {
  usdAmount?: BigNumber
  isOraclePrice?: boolean
  subValue?: NumberRowElement
}

export interface NumberRowElement {
  value: string | number
  prefix?: string
  suffix?: string
  testID: string
  themedProps?: ThemedProps & { style?: ThemedProps & StyleProp<ViewStyle> }
}

export function NumberRowV2 (props: INumberRowProps): JSX.Element {
  return (
    <ThemedView
      style={props.containerStyle?.style ?? tailwind('flex-row items-start w-full bg-transparent')}
      light={props.containerStyle?.light ?? tailwind('bg-transparent')}
      dark={props.containerStyle?.dark ?? tailwind('bg-transparent')}
    >
      <View style={tailwind('w-5/12')}>
        <View style={tailwind('flex-row items-end justify-start')}>
          <ThemedText
            style={tailwind('text-sm font-normal-v2')}
            light={tailwind('text-mono-light-v2-900')}
            dark={tailwind('text-mono-dark-v2-900')}
            testID={`${props.lhs.testID}_label`}
            {...props.lhs.themedProps}
          >
            {props.lhs.value}
          </ThemedText>
        </View>
      </View>

      <View style={tailwind('flex-1')}>
        <View>
          <View style={tailwind('flex flex-row justify-end flex-wrap items-center')}>
            <NumberFormat
              decimalScale={8}
              displayType='text'
              prefix={props.rhs.prefix}
              suffix={props.rhs.suffix !== undefined ? ` ${props.rhs.suffix}` : undefined}
              renderText={(val: string) => (
                <ThemedText
                  style={tailwind('text-right font-normal-v2 text-sm')}
                  light={tailwind('text-mono-light-v2-700')}
                  dark={tailwind('text-mono-dark-v2-700')}
                  testID={props.rhs.testID}
                  {...props.rhs.themedProps}
                >
                  {val}
                </ThemedText>
              )}
              thousandSeparator
              value={props.rhs.value}
            />
          </View>
        </View>
        <View style={tailwind('flex flex-row justify-end flex-wrap items-center')}>
          {
            props.rhs.usdAmount !== undefined &&
              <ActiveUSDValueV2
                price={props.rhs.usdAmount}
                containerStyle={tailwind('justify-end')}
                testId={`${props.rhs.testID}_rhsUsdAmount`}
              />
          }
          {
            props.rhs.isOraclePrice === true && (
              <IconTooltip />
            )
          }
          {
            props.rhs.subValue !== undefined &&
              <NumberFormat
                decimalScale={8}
                displayType='text'
                prefix={props.rhs.subValue.prefix}
                suffix={props.rhs.subValue.suffix}
                renderText={(val: string) => (
                  <ThemedText
                    style={tailwind('text-right font-normal-v2 text-sm mt-1')}
                    light={tailwind('text-mono-light-v2-700')}
                    dark={tailwind('text-mono-dark-v2-700')}
                    testID={props.rhs.subValue?.testID}
                    {...props.rhs.subValue?.themedProps}
                  >
                    {val}
                  </ThemedText>
              )}
                thousandSeparator
                value={props.rhs.subValue.value}
              />
          }
        </View>
      </View>
    </ThemedView>
  )
}
