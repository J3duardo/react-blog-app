import { useEffect, useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { AiOutlineArrowUp } from "react-icons/ai";

const BTN_STYLES: React.CSSProperties = {
  position: "fixed",
  right: "var(--spacing)",
  bottom: "var(--spacing)",
  backgroundColor: "var(--mui-primary)",
  zIndex: 1000,
};

/**
 * Botón para scrollear al top de la página
 * luego de cierto porcentaje scrolleado del window.
 */
const GoToTopBtn = () => {
  const [scrolled, setScrolled] = useState(0);

  // Calcular el porcentaje scrolleado cada vez que se hace scroll.
  useEffect(() => {
    const scrollListener = (e: Event) => {
      const scrollHeight = (e.target as Document).activeElement!.scrollHeight;
      const scrollY = window.scrollY;
      const scrolledPercentage = Number((scrollY / scrollHeight * 100).toFixed(0));
      setScrolled(scrolledPercentage);
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };

  }, []);

  // Click handler del botón.
  const onClickHandler = () => {
    window.scrollTo({top: 0, behavior: "auto"})
  };

  // Mostrar el botón si el porcentaje scrolleado es mayor o igual a 40%.
  if(scrolled < 40) {
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