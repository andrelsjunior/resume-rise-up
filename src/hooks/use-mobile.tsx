import { useMediaQuery } from "react-responsive"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT - 1 })
  return isMobile
}
