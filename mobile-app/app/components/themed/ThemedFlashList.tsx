import { forwardRef } from "react";
import { useThemeContext } from "@shared-contexts/ThemeProvider";
import { tailwind } from "@tailwind";

import { FlashList, FlashListProps } from "@shopify/flash-list";
import { ScrollView } from "react-native";
import { ThemedProps } from "./index";

interface ParentContainer {
  parentContainerStyle?: { [p: string]: string };
}

type ThemedFlashListProps = FlashListProps<any> & ThemedProps & ParentContainer;

export const ThemedFlashList = forwardRef(
  (props: ThemedFlashListProps, ref: React.Ref<any>): JSX.Element => {
    const { isLight } = useThemeContext();
    const {
      contentContainerStyle,
      light = tailwind("bg-mono-light-v2-100"),
      dark = tailwind("bg-mono-dark-v2-100"),
      estimatedItemSize = 5,
      parentContainerStyle,
      ...otherProps
    } = props;
    const theme = isLight ? light : dark;
    const styles = { ...contentContainerStyle };

    return (
      <ScrollView
        contentContainerStyle={[
          { minHeight: 2 },
          tailwind("flex-grow"),
          parentContainerStyle,
          theme,
        ]}
        ref={ref}
      >
        <FlashList
          estimatedItemSize={estimatedItemSize}
          contentContainerStyle={styles}
          {...otherProps}
        />
      </ScrollView>
    );
  }
);
