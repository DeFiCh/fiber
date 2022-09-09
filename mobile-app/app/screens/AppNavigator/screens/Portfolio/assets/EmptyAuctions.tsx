import Svg, {
  Path,
  Ellipse,
  G,
  Circle,
  Defs,
  Rect,
  ClipPath,
} from "react-native-svg";

export function EmptyAuctions(): JSX.Element {
  return (
    <Svg width="127" height="92" viewBox="0 0 127 92">
      <Path
        d="M42.7773 77C58.5175 77 71.2774 64.2401 71.2774 48.5C71.2774 32.7599 58.5175 20 42.7773 20C27.0372 20 14.2773 32.7599 14.2773 48.5C14.2773 64.2401 27.0372 77 42.7773 77Z"
        fill="#FF008C"
      />
      <Path
        d="M20.8984 47.9288C20.9467 47.4703 20.9628 47.0037 21.0352 46.5533C21.2122 45.4673 21.4052 44.3814 21.6144 43.2954C21.6385 43.1828 21.7833 43.0541 21.9039 43.0139C23.1025 42.6117 24.3011 42.2256 25.4996 41.8395C25.6203 41.7992 25.7409 41.751 25.8857 41.6947C25.8294 41.574 25.7892 41.4775 25.7409 41.381C25.1698 40.2628 24.5906 39.1447 24.0195 38.0185C23.9713 37.922 23.9552 37.7611 24.0034 37.6807C24.8481 36.281 25.8455 34.994 26.9958 33.8115C27.036 33.7713 27.0843 33.7391 27.1487 33.6828C27.4382 34.2459 27.7198 34.7929 28.0013 35.3399C28.8942 37.0694 29.7871 38.7908 30.6639 40.5202C30.7765 40.7455 30.9133 40.834 31.1707 40.842C32.2405 40.8822 33.3184 40.9466 34.3883 41.0029C34.6055 41.0109 34.8307 41.0029 35.0238 41.0029C35.0238 40.472 35.0398 39.9652 35.0238 39.4584C34.9996 38.7103 34.9353 37.9622 34.9192 37.2141C34.9192 36.9648 34.8146 36.828 34.5894 36.7154C32.3531 35.6295 30.1169 34.5355 27.8807 33.4495C27.7841 33.4013 27.6876 33.353 27.5589 33.2806C27.8887 32.991 28.1702 32.6854 28.5 32.4521C29.5056 31.7201 30.5352 31.0202 31.5407 30.2963C31.7418 30.1515 31.9107 30.1756 32.1199 30.2802C33.238 30.8352 34.3641 31.3822 35.4823 31.9292C35.5788 31.9775 35.6834 32.0177 35.8121 32.074C36.0051 31.5109 36.1982 30.972 36.3832 30.433C36.6326 29.693 36.89 28.9529 37.1313 28.2129C37.1876 28.0359 37.2841 27.9474 37.4772 27.8992C39.0377 27.5291 40.6144 27.2959 42.2151 27.2717C42.3036 27.2717 42.384 27.2878 42.5128 27.2959C42.2312 28.1324 41.9577 28.9368 41.6842 29.7332C41.0326 31.6396 40.3811 33.5461 39.7376 35.4525C39.6732 35.6456 39.641 35.8547 39.6571 36.0558C39.7536 37.9864 39.8582 39.9169 39.9467 41.8475C39.9628 42.2819 40.0915 42.6197 40.4293 42.9335C41.1453 43.577 41.8129 44.2688 42.5047 44.9364C42.5851 45.0169 42.6736 45.0893 42.8265 45.218V27.2878C43.3654 27.2878 43.8722 27.2556 44.3709 27.2878C46.0521 27.4085 47.7012 27.6981 49.31 28.1887C53.2194 29.3954 56.5335 31.4868 59.2443 34.4872C61.8184 37.3429 63.4835 40.649 64.2638 44.3653C64.6419 46.1832 64.7706 48.0253 64.6338 49.8674C64.1512 56.1418 61.3921 61.2738 56.3726 65.2315C53.7503 67.2988 50.7498 68.6663 47.4518 69.342C46.2532 69.5833 45.0064 69.6477 43.7837 69.8005C43.647 69.8166 43.5102 69.8488 43.3735 69.8649H42.8265C42.8265 69.7764 42.8426 69.6879 42.8426 69.5994C42.8426 63.7997 42.8426 58.008 42.8426 52.2082C42.8426 52.1117 42.8345 52.0232 42.8184 51.8623C42.6897 51.9749 42.5932 52.0473 42.5128 52.1278C41.8129 52.8035 41.1372 53.5033 40.4213 54.1549C40.0915 54.4525 39.9708 54.7743 39.9548 55.1845C39.8663 57.1231 39.7536 59.0698 39.6571 61.0084C39.6491 61.2095 39.6732 61.4267 39.7376 61.6117C40.3811 63.5342 41.0407 65.4487 41.6923 67.3632C41.9658 68.1515 42.2312 68.9479 42.4967 69.7442C42.4484 69.7683 42.4243 69.7925 42.3921 69.7925C42.3358 69.7925 42.2714 69.7925 42.2071 69.7925C40.5983 69.7764 39.0297 69.527 37.4691 69.165C37.26 69.1168 37.1796 69.0042 37.1152 68.8191C36.7291 67.6769 36.343 66.5346 35.9569 65.4004C35.9166 65.2717 35.8603 65.143 35.804 64.9902C35.6834 65.0465 35.5788 65.0787 35.4823 65.1269C34.34 65.682 33.2058 66.237 32.0636 66.8001C31.9107 66.8725 31.782 66.9047 31.6131 66.8001C30.4387 66.0922 29.3125 65.32 28.2829 64.4191C28.0415 64.2099 27.8083 64.0008 27.5428 63.7675C27.6876 63.6951 27.7922 63.6307 27.8967 63.5825C30.133 62.4885 32.3692 61.3945 34.6055 60.3166C34.8146 60.212 34.9031 60.0914 34.9111 59.8661C34.9594 58.6998 35.0157 57.5414 35.0962 56.375C35.1122 56.0774 35.0238 56.005 34.7261 56.0211C33.5437 56.0935 32.3612 56.1498 31.1787 56.1981C30.9213 56.2061 30.7846 56.2946 30.6719 56.5198C29.6664 58.4906 28.6529 60.4534 27.6393 62.4161C27.4785 62.7218 27.3176 63.0274 27.1567 63.3492C27.1084 63.309 27.0682 63.2929 27.0441 63.2688C25.8777 62.0863 24.8722 60.7912 24.0195 59.3835C23.9632 59.295 23.9713 59.118 24.0195 59.0135C24.5826 57.8873 25.1618 56.7692 25.7409 55.6511C25.7892 55.5545 25.8294 55.458 25.8857 55.3374C25.7409 55.281 25.6203 55.2328 25.4996 55.1926C24.3011 54.8064 23.1025 54.4203 21.9039 54.0181C21.7833 53.9779 21.6385 53.8492 21.6224 53.7366C21.4133 52.6506 21.2202 51.5647 21.0432 50.4788C20.9708 50.0444 20.9467 49.602 20.9065 49.1595V48.7412C20.9628 48.7654 21.0111 48.7976 21.0674 48.8136C23.8667 49.7226 26.666 50.6316 29.4653 51.5325C29.5699 51.5647 29.6825 51.5888 29.7871 51.5808C30.2134 51.5647 30.6398 51.5406 31.0581 51.5164C32.7956 51.428 34.5331 51.3395 36.2706 51.2349C36.4395 51.2268 36.6487 51.1464 36.7693 51.0338C37.5818 50.2616 38.3781 49.4733 39.1825 48.693C39.2469 48.6367 39.2951 48.5643 39.3675 48.4838C38.4505 47.5909 37.5496 46.7141 36.6406 45.8373C36.5923 45.7891 36.4958 45.765 36.4234 45.7569C35.7236 45.7167 35.0318 45.6765 34.332 45.6443C32.8438 45.5719 31.3637 45.4915 29.8756 45.4271C29.7067 45.4271 29.5297 45.4512 29.3768 45.5075C27.4382 46.1269 25.4996 46.7544 23.561 47.3818C22.6681 47.6714 21.7833 47.9771 20.8984 48.2666C20.8984 48.146 20.8984 48.0334 20.8984 47.9127V47.9288ZM47.6368 64.4191C53.9594 62.8022 60.8692 56.0372 59.7109 46.4889C59.188 42.1934 57.1448 38.6379 53.7744 35.8225C51.9806 34.3263 49.9454 33.2565 47.6368 32.5888V64.4191Z"
        fill="white"
      />
      <Ellipse cx="61.7773" cy="76.5" rx="61.5" ry="4.5" fill="#5B10FF" />
      <G clipPath="url(#clip0_6907_95952)">
        <Circle cx="42.7773" cy="48.5" r="28.5" fill="#FFE5F7" />
        <Path
          d="M43.9321 26.5625L48.526 27.7935L46.2931 36.1236L54.625 38.3575L53.394 42.9513L43.7083 40.3547L40.4526 42.2358C39.3177 42.8905 38.9292 44.3399 39.5859 45.4763C40.2405 46.6113 41.69 46.9997 42.8264 46.3431C46.2361 44.3763 50.5946 45.5445 52.5629 48.9533C54.4659 52.2526 53.4338 56.4401 50.2763 58.4936L49.9535 58.6917L46.2876 60.807L43.7681 70.2155L39.1741 68.9848L41.3305 60.9257L33.2773 58.7705L34.5072 54.1763L43.9043 56.6906L47.5738 54.5739C48.7091 53.9172 49.0982 52.4652 48.4437 51.3305C47.789 50.1968 46.338 49.8079 45.2042 50.4619C41.7939 52.4326 37.4338 51.264 35.4671 47.8542C33.56 44.5539 34.5928 40.3641 37.7525 38.3143L38.0755 38.1166L41.3411 36.2293L43.9321 26.5625Z"
          fill="#FF00AF"
        />
      </G>
      <Path
        d="M111.804 67.7512L99.585 55.532L90.8094 64.3076L103.029 76.5268L111.804 67.7512Z"
        fill="#58595B"
      />
      <Path
        d="M99.5848 55.5321L89.9316 45.8789L81.156 54.6545L90.8092 64.3077L99.5848 55.5321Z"
        fill="#58595B"
      />
      <Path
        d="M89.9305 45.8786L80.2773 36.2255L71.5017 45.0011L81.1549 54.6542L89.9305 45.8786Z"
        fill="#FFC803"
      />
      <Path
        d="M85.7185 31.135L66.2373 11.6538L46.7561 31.135L66.2373 50.6162L85.7185 31.135Z"
        fill="#5B10FF"
      />
      <Path
        d="M95.1979 21.3069L75.8916 2.00061L66.2384 11.6538L85.5448 30.9601L95.1979 21.3069Z"
        fill="#FFC803"
      />
      <Path
        d="M66.237 50.2664L46.9307 30.9601L37.2775 40.6132L56.5838 59.9196L66.237 50.2664Z"
        fill="#FFC803"
      />
      <Path
        d="M105.509 35C115.174 35 123.009 27.165 123.009 17.5C123.009 7.83502 115.174 0 105.509 0C95.8438 0 88.0088 7.83502 88.0088 17.5C88.0088 27.165 95.8438 35 105.509 35Z"
        fill="#FF008C"
      />
      <Path
        d="M103.686 19.9621V16.4119H105.517C106.368 16.4119 106.997 16.2017 107.413 15.7812C107.828 15.3607 108.036 14.8501 108.036 14.2374C108.036 13.7989 107.939 13.4204 107.744 13.1021C107.549 12.7837 107.277 12.5314 106.926 12.3572C106.575 12.177 106.16 12.0869 105.686 12.0869C105.166 12.0869 104.725 12.189 104.361 12.3872C103.991 12.5855 103.712 12.8558 103.51 13.1922C103.309 13.5286 103.205 13.913 103.205 14.3395H100.342C100.342 13.4865 100.55 12.7116 100.959 12.0088C101.368 11.306 101.978 10.7413 102.79 10.3208C103.601 9.90031 104.588 9.69006 105.757 9.69006C106.822 9.69006 107.738 9.88229 108.51 10.2607C109.283 10.6392 109.874 11.1558 110.289 11.8045C110.705 12.4533 110.913 13.1982 110.913 14.0392V14.2794C110.913 15.0904 110.705 15.8172 110.289 16.454C109.874 17.0907 109.257 17.5953 108.445 17.9617C107.634 18.3282 106.647 18.5144 105.478 18.5324L106.705 17.4932L106.66 19.9681H103.686V19.9621ZM103.446 24.6656V21.7161H106.9V24.6656H103.446Z"
        fill="white"
      />
      <Defs>
        <ClipPath id="clip0_6907_95952">
          <Rect
            width="57"
            height="57"
            fill="white"
            transform="translate(14.2773 20)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}