import { HTMLChakraProps, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface LogoOutlineProps {
  fontSize: HTMLChakraProps<"text">["fontSize"];
}

export const LogoOutline: React.FC<LogoOutlineProps> = ({ fontSize }) => {
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
        color={isHomeScreen ? "white" : "gray.600"}
        textShadow={"0px 0px 5px rgba(0,0,0,0.4), 0px 0px 15px rgba(0,0,0,0.2)"}
        outline={"1px"}
      >
        Miscanthus
      </Text>
      <Text
        display={"inline"}
        m={"0px"}
        fontSize={fontSize}
        fontWeight={"bold"}
        color={isHomeScreen ? "#adffbe" : "#68D3B6"}
        textShadow={"0px 0px 5px rgba(0,0,0,0.4), 0px 0px 15px rgba(0,0,0,0.2)"}
      >
        .finance
      </Text>
    </>
  );
};
