import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";
import { AiOutlineArrowUp } from "react-icons/ai";

const BTN_STYLES: React.CSSProperties = {
  position: "fixed",
  right: "var(--spacing)",
  bottom: "var(--spacing)",
  backgroundColor: "var(--primary)",
  zIndex: 1000,
};

/**
 * Botón para scrollear al top de la página
 * luego de cierto porcentaje scrolleado del window.
 */
const GoToTopBtn = () => {
  const {pathname} = useLocation();
  const [scrolledPercentage, setScrolledPercentage] = useState(0);

  // Calcular el porcentaje scrolleado cada vez que se hace scroll.
  useEffect(() => {
    const scrollHeight = document.documentElement.clientHeight;

    const scrollListener = (e: Event) => {
      const scrollY = window.scrollY;
      const percentage = Number((scrollY / scrollHeight * 100).toFixed(0));
      setScrolledPercentage(percentage);
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
      setScrolledPercentage(0);
    };

  }, [pathname]);

  // Click handler del botón.
  const onClickHandler = () => {
    window.scrollTo({top: 0, behavior: "auto"});
  };

  // Mostrar el botón si el porcentaje scrolleado es mayor o igual a 40%.
  if(scrolledPercentage < 40) {
    return null;
  };

  return (
    <Tooltip title="Go to top">
      <IconButton
        style={BTN_STYLES}
        size="medium"
        onClick={onClickHandler}
      >
        <AiOutlineArrowUp style={{color: "white"}} />
      </IconButton>
    </Tooltip>
  )
};

export default GoToTopBtn;