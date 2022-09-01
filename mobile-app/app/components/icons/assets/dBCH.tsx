import Svg, { Circle, Path, SvgProps } from "react-native-svg";

export function dBCH(props: SvgProps): JSX.Element {
  return (
    <Svg height={32} width={32} viewBox="0 0 32 32" {...props}>
      <Circle cx={16} cy={16} fill="#CEF3E8" r={16} />

      <Path
        d="M23.504 16.665l-.009-.017-.001-.003-.016-.052v-.001l-.001-.002v-.001l-.002-.001v-.002l-.001-.001-.002-.003a3.269 3.269 0 00-1.068-1.599v-.001l-.047-.036-.02-.015-.016-.012-.006-.005-.014-.01-.007-.006-.014-.01-.007-.005-.015-.012-.008-.004-.015-.012-.008-.005-.016-.01-.008-.005-.01-.014-.008-.006-.016-.011-.009-.006-.016-.01-.008-.007-.017-.01-.008-.007-.017-.012-.009-.006-.019-.011-.008-.006-.019-.012-.008-.006-.019-.011-.008-.006-.019-.012-.01-.005-.018-.011-.01-.006-.02-.01-.01-.005-.02-.012-.01-.006-.021-.012-.01-.005-.021-.012-.01-.007-.021-.012-.011-.006-.022-.011-.011-.007-.022-.011-.015-.008v-.002c-.011-.006-.023-.011-.033-.018a4.562 4.562 0 00-1.461-.461c.143-.154.273-.318.391-.492l.019-.028h.001l.009-.014.011-.019.006-.008.012-.019.006-.008.011-.019.006-.009.012-.018.006-.009.01-.018.007-.009.01-.018.006-.008.01-.018.005-.008.01-.018.004-.008.01-.017.005-.008.009-.017.005-.008.008-.017.005-.008.008-.017.005-.008.01-.016.004-.008.01-.015.005-.008.008-.015.005-.008.008-.015.003-.007.008-.015.003-.007.009-.015.003-.007.008-.015.003-.007.007-.014.003-.008.007-.014.003-.007.007-.014.003-.007.007-.017.01-.021.02-.048.002-.001c.219-.54.27-1.134.147-1.704v-.002l-.002-.002-.001-.002v-.001l-.001-.002-.001-.001-.001-.001v-.002a.54.54 0 00-.012-.047v-.005l-.001-.001-.001-.002v.002l-.006-.013a.941.941 0 00-.017-.067l-.018-.067-.008-.015-.002-.003-.014-.046v-.001l-.001-.001-.001-.002v-.001l-.001-.002-.001-.001-.001-.001a2.904 2.904 0 00-.95-1.423l-.001-.001-.04-.032-.018-.013-.015-.011-.006-.005-.012-.01L20 9.408l-.012-.01-.006-.005-.014-.009-.006-.005-.015-.01-.006-.006-.015-.01-.006-.005-.014-.01-.008-.005-.015-.01-.007-.005-.015-.01-.008-.005-.015-.01-.008-.004-.016-.01-.008-.004-.015-.01-.008-.004-.016-.01-.008-.005-.016-.01-.008-.005-.016-.01-.008-.006-.018-.01-.008-.004-.018-.01-.008-.006-.018-.01-.009-.006-.018-.01-.008-.006-.019-.012-.01-.005-.018-.011-.01-.006-.02-.01-.01-.006-.02-.01-.014-.007-.001-.001-.03-.016c-.874-.454-1.984-.59-3.1-.304l-.291.074-.736-2.859-1.703.437.73 2.85-1.362.35-.733-2.842-1.702.437.732 2.85-3.512.904.467 1.816 1.415-.363a.876.876 0 011.067.63l1.965 7.643a.585.585 0 01-.42.712l-1.24.319.072 2.16 3.508-.902.742 2.845 1.702-.438-.733-2.851 1.362-.35.733 2.851 1.702-.437-.736-2.863.709-.184c1.258-.324 2.276-1.062 2.892-1.982l.02-.03.002-.001.01-.015.014-.021.006-.01.014-.022.006-.011.012-.02.007-.011.012-.021.005-.01.012-.02.005-.01.012-.021.006-.01.01-.02.005-.01.011-.02.005-.01.012-.019.005-.01.011-.018.006-.01.01-.018.005-.01.01-.018.005-.01.01-.017.004-.01.01-.017.004-.01.009-.017.004-.008.01-.017.004-.008.008-.017.005-.007.009-.018.004-.007.01-.017.004-.008.008-.017.005-.008.007-.017.005-.007.007-.017.004-.007.008-.018.01-.024c.008-.018.017-.035.023-.053v-.002a3.272 3.272 0 00.167-1.917V16.9l-.002-.002v-.001l-.001-.002v-.001l-.002-.001v-.002l-.001-.001-.012-.052v-.004l-.001-.001v-.002l-.002-.001v-.001l-.001-.002v-.001l-.002-.001v-.002l-.001-.001v-.002l-.002-.001v-.001l-.001-.002-.003-.005c-.006-.025-.011-.051-.02-.075 0-.016-.004-.042-.006-.071zM13.5 11.552c.29-.074 1.492-.376 1.888-.48.63-.16 1.25-.098 1.735.136l.016.007.007.003.01.005.005.003.01.005.005.003.01.005.004.003.01.005.005.003.01.005.005.003.01.005.005.003.01.005.004.003.01.005.005.002.01.006.005.002.008.006.005.003.009.006.005.003.008.006.005.002.008.005.005.003.007.005.005.002.008.005.005.003.008.004.005.003.007.005.004.003.008.005.003.002.008.005.002.002.008.005.003.002.008.004.003.002.006.006.003.002.008.005.01.006c.009.005.016.012.024.016.248.188.43.449.52.746l.003.004.007.025h.001l.005.01.01.034a.212.212 0 01.007.04l.004.008v.001a.122.122 0 00.007.025l.002.004c.064.304.03.62-.097.904l-.01.026-.007.012-.005.008v.004l-.004.007-.001.004-.005.008-.001.004-.005.008-.002.005-.004.007-.002.004-.004.008-.002.005-.004.007-.002.005-.005.008-.002.004-.005.008-.003.005-.004.008-.003.005-.005.008-.002.004-.007.009-.002.005-.006.008-.003.005-.006.009-.003.004-.006.009-.002.005-.006.008-.003.005-.006.009-.003.005-.006.008-.002.005-.006.008-.003.005-.007.01-.003.004-.008.01-.002.004-.008.01-.002.004-.008.01-.005.006-.01.015c-.313.438-.826.793-1.456.954-.397.102-1.595.416-1.885.49l-.893-3.46zm6.656 5.86l.005.007v.002c.002.01.005.017.006.027l.001.001v.002l.002.001v.002c.067.335.02.683-.137.987l-.015.028-.007.013-.005.01-.003.004-.005.008-.002.005-.005.008-.003.005-.006.008-.003.005-.006.009-.002.004-.006.009-.003.005-.006.008-.003.005-.006.009-.002.004-.006.009-.003.005-.006.008-.003.005-.006.009-.002.004-.007.009-.002.005-.008.009-.002.005-.008.01-.002.004-.007.01-.003.005-.006.011-.003.005-.007.01-.004.006-.006.011-.004.006-.009.011-.004.006-.008.011-.004.006-.008.012-.004.005-.008.012-.004.005-.008.012-.007.007-.013.016c-.38.486-.994.885-1.739 1.076-.47.122-1.89.493-2.235.581l-.966-3.76c.344-.09 1.768-.448 2.238-.569.745-.191 1.476-.137 2.042.104l.018.008.01.004.013.005.006.002.012.006.007.002.012.006.006.002.013.006.004.003.012.005.005.003.012.006.005.003.012.006.005.002.01.005.005.003.01.005.005.003.01.005.004.003.01.005.005.003.01.005.005.003.01.005.005.003.01.005.004.003.01.005.005.003.01.005.005.003.008.006.005.002.009.006.004.003.009.006.005.003.008.006.005.002.009.006.004.003.008.005.005.002.009.006.011.009.027.017c.285.192.496.475.6.802l.003.006.008.025v.002l.005.008.01.039c.008.003.009.018.007.037z"
        fill="#0AC18E"
      />
    </Svg>
  );
}
