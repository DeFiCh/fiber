import { memo } from "react";
import { View } from "react-native";
import { NumericFormat as NumberFormat } from "react-number-format";
import { isEqual } from "lodash";
import { tailwind } from "@tailwind";
import { ThemedTextV2 } from "@components/themed";
import BigNumber from "bignumber.js";

interface APRSectionProps {
  label: string;
  value: {
    decimalScale: number;
    suffix?: string;
    testID: string;
    text: string;
  };
}

export const APRSection = memo((props: APRSectionProps): JSX.Element => {
  return (
    <View style={tailwind("flex flex-col items-end")}>
      <ThemedTextV2
        dark={tailwind("text-green-v2")}
        light={tailwind("text-green-v2")}
        style={tailwind("text-xs font-semibold-v2")}
      >
        {props.label}
      </ThemedTextV2>
      <NumberFormat
        displayType="text"
        renderText={(value) => (
          <ThemedTextV2
            style={tailwind("text-xs font-semibold-v2 text-right")}
            dark={tailwind("text-green-v2")}
            light={tailwind("text-green-v2")}
            testID={props.value.testID}
          >
            {value}
          </ThemedTextV2>
        )}
        thousandSeparator
        suffix={props.value.suffix}
        value={BigNumber(props.value.text).toFixed(props.value.decimalScale)}
      />
    </View>
  );
}, isEqual);
