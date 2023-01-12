import {useState, useEffect, useRef, ReactNode, useMemo} from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";
import Sidebar from "./MostPopularSidebar";
import { LayoutState } from "../redux/store";

interface Props {
  children: ReactNode;
};

const Layout = ({children}: Props) => {
  const outerWrapperRef = useRef<HTMLDivElement | null>(null);
  const innerWrapperRef = useRef<HTMLDivElement | null>(null);

  const {pathname} = useLocation();
  const {navbarHeight, sidebarWidth} = useSelector((state: LayoutState) => state.layout);

  // State del offset del contenedor interno
  const [offset, setOffset] = useState<{left: number, right: number}>({
    left: 0,
    right: 0
  });


  // Calcular la posición del contenedor interno con respecto al contenedor externo
  // cuando el contenedor externo cambie de tamaño para reacomodar
  // los elementos con position fixed (sidebar).
  const resizeObserver = useMemo(() => new ResizeObserver(() => {
    if(innerWrapperRef.current) {
      const {left, right} = (innerWrapperRef.current as HTMLDivElement)
      .getBoundingClientRect();
      
      // Actualizar el state de la posición del contenedor interno
      setOffset({left, right});
    }
  }), [innerWrapperRef]);


  /*---------------------------------------------*/
  // Inicializar el observer del wrapper externo
  /*---------------------------------------------*/
  useEffect(() => {
    const element = outerWrapperRef.current as HTMLDivElement;

    if(element) {
      resizeObserver.observe(element);
    }

    return () => resizeObserver.unobserve(element);
  }, [outerWrapperRef]);


  return (
    <Box
      ref={outerWrapperRef}
      className="outer-wrapper"
      component="div"
    >
      <Box
        ref={innerWrapperRef}
        className="inner-wrapper"
        component="div"
      >
        <NavBar />

        {/* No mostrar el sidebar en login o signup */}
        {!pathname.includes("login") && !pathname.includes("signup") && 
          <Sidebar
            offset={{top: navbarHeight, ...offset}}
            trendingCategories={[]}
            loading={true}
          />
        }
        <main
          style={{
            paddingTop: `calc(${navbarHeight}px + var(--spacing-sm))`,
            paddingRight: `${sidebarWidth}px`
          }}
        >
          {children}
        </main>
      </Box>
    </Box>
  )
};

export default Layout