import { RootState } from '@store'
import { tokenSelectorByDisplaySymbol } from '@store/wallet'
import randomColor from 'randomcolor'
import Svg, { Circle, SvgProps, Text, G, Path } from 'react-native-svg'
import { useSelector } from 'react-redux'

export function _Default (symbol: string): (props: SvgProps) => JSX.Element {
  const tokenDetail = useSelector((state: RootState) => tokenSelectorByDisplaySymbol(state.wallet, symbol))

  if (tokenDetail?.isLoanToken === true) {
    return function (props: SvgProps): JSX.Element {
      const name = symbol.substring(1, 5).toUpperCase()
      return (
        <Svg width='32' height='32' viewBox='0 0 32 32' fill='none' {...props}>
          <G clipPath='url(#clip0_1388_11287)'>
            <Path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.838 32 32 24.837 32 16C32 7.163 24.838 0 16 0Z'
              fill='#0E0A0D'
            />
          </G>
          <Text
            x='50%'
            y='62%'
            textAnchor='middle'
            fontSize={10}
            fill='white'
            fontWeight='bold'
          >
            {name}
          </Text>
        </Svg>
      )
    }
  }

  if (tokenDetail?.isLPS === true) {
    return function (props: SvgProps): JSX.Element {
      const [tokenA, tokenB] = symbol.split('-')
      return (
        <Svg width='32' height='32' viewBox='0 0 32 32' fill='none' {...props}>
          <G clipPath='url(#clip0_1388_11287)'>
            <Path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.838 32 32 24.837 32 16C32 7.163 24.838 0 16 0Z'
              fill='#0E0A0D'
            />
          </G>
          <Text
            x='50%'
            y='47%'
            textAnchor='middle'
            fontSize={9}
            fill='white'
            fontWeight='bold'
          >
            {tokenA}
          </Text>
          <Text
            x='50%'
            y='77%'
            textAnchor='middle'
            fontSize={9}
            fill='white'
            fontWeight='bold'
          >
            {tokenB}
          </Text>
        </Svg>
      )
    }
  }

  return function (props: SvgProps): JSX.Element {
    const bg = randomColor({
      luminosity: 'bright',
      format: 'rgba',
      seed: symbol,
      alpha: 0.2
    })
    const text = randomColor({
      luminosity: 'dark',
      format: 'rgba',
      seed: symbol,
      alpha: 100
    })
    const first = symbol?.substring(0, 1)?.toUpperCase() ?? 'T'

    return (
      <Svg
        height={32}
        viewBox='0 0 32 32'
        width={32}
        {...props}
      >
        <Circle
          cx={16}
          cy={16}
          fill={bg}
          r={16}
        />

        <Text
          alignmentBaseline='central'
          fill={text}
          fontSize='24'
          fontWeight='bolder'
          textAnchor='middle'
          x='50%'
          y='50%'
        >
          {first}
        </Text>
      </Svg>
    )
  }
}
