import { useMediaQuery } from "@chakra-ui/react";

export const useTypeDevice = () => {
  const [isMobileSmall] = useMediaQuery("(max-width: 480px)");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isDesktopSmall] = useMediaQuery("(min-width: 992px)");
  const [isDesktop] = useMediaQuery("(min-width: 1024px)");
  const [isMobileTablet] = useMediaQuery("(min-width: 1200px)");
  const [isLaregeMobileTablet] = useMediaQuery("(min-width: 1280px)");
  const [isLargeDesktop] = useMediaQuery("(min-width: 1440px)");
  return {
    isMobileSmall,
    isMobile,
    isDesktopSmall,
    isMobileTablet,
    isLaregeMobileTablet,
    isDesktop,
    isLargeDesktop,
  };
};
