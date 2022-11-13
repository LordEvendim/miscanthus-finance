import { HTMLChakraProps, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface LogoProps {
  fontSize: HTMLChakraProps<"text">["fontSize"];
}

export const Logo: React.FC<LogoProps> = ({ fontSize }) => {
  const location = useLocation();
  const [isHomeScreen, setIsHomescreen] = useState<Boolean>(true);

  useEffect(() => {
    setIsHomescreen(location.pathname === "/" ? true : false);
  }, [location]);

  return (
    <>
      <Text
        display={"inline"}
        fontSize={fontSize}
        fontWeight={"bold"}
        color={"gray.600"}
        textShadow={"0px 0px 12px rgba(0,0,0,0.4)"}
      >
        Miscanthus
      </Text>
      <Text
        display={"inline"}
        m={"0px"}
        fontSize={fontSize}
        fontWeight={"bold"}
        color={isHomeScreen ? "#adffbe" : "#68D3B6"}
        textShadow={"0px 0px 3px rgba(0,0,0,0.4), 0px 0px 8px rgba(0,0,0,0.1)"}
      >
        .finance
      </Text>
    </>
  );
};
