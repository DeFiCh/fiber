import { NavigationProp, useNavigation } from '@react-navigation/native'
import { View } from '@components/index'
import { ThemedScrollView } from '@components/themed'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import { WalletParamList } from '../WalletNavigator'
import { ImageBackground } from 'react-native'
import { ButtonV2 } from '@components/ButtonV2'
import GridBackgroundImageLight from '@assets/images/onboarding/grid-background-light.png'
import GridBackgroundImageDark from '@assets/images/onboarding/grid-background-dark.png'
import { VersionTagV2 } from '@components/VersionTagV2'
import { OnboardingCarouselV2 } from '@screens/WalletNavigator/screens/components/OnboardingCarouselV2'
import { useThemeContext } from '@shared-contexts/ThemeProvider'

export function OnboardingV2 (): JSX.Element {
  const navigator = useNavigation<NavigationProp<WalletParamList>>()
  const { isLight } = useThemeContext()
  return (
    <ThemedScrollView
      contentContainerStyle={tailwind('h-full')}
      style={tailwind('flex-1')}
      testID='onboarding_carousel'
    >
      <View style={tailwind('h-3/5')}>
        <OnboardingCarouselV2 />
      </View>
      <View>
        <ImageBackground
          source={isLight ? GridBackgroundImageLight : GridBackgroundImageDark}
          style={tailwind('px-8')}
          resizeMode='cover'
        >
          <ButtonV2
            label={translate('screens/Onboarding', 'Get started')}
            styleProps='m-2 mt-20'
            onPress={() => navigator.navigate('CreateWalletGuidelines')}
            testID='get_started_button'
          />
          <ButtonV2
            fill='flat'
            label={translate('screens/Onboarding', 'Restore Wallet')}
            styleProps='mx-2 mt-6 mb-12'
            onPress={() => navigator.navigate('RestoreMnemonicWallet')}
            testID='restore_wallet_button'
          />
        </ImageBackground>
        <VersionTagV2 />
      </View>
    </ThemedScrollView>
  )
}
