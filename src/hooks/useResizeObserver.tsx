import { useEffect, useState, MutableRefObject, useMemo } from "react";

interface ObserverProps {
  elementRef: MutableRefObject<HTMLElement>
}

interface Dimentions {
  elemWidth: number;
  elemHeight: number;
};

/**
 * Custom hook para calcular el with y el height de un elemento
 * proporcionando una referencia (ref) del mismo.
 */
const useResizeObserver = ({elementRef}: ObserverProps): Dimentions => {
  const [dimentions, setDimentions] = useState<Dimentions>({
    elemWidth: 0,
    elemHeight: 0
  });

  // Resize observer del elemento referenciado
  const resizeObserver = useMemo(() => new ResizeObserver((entries) => {
    setDimentions({
      elemWidth: (entries[0].target as HTMLElement).offsetWidth,
      elemHeight: (entries[0].target as HTMLElement).offsetHeight
    });
  }), [elementRef]);

  // Inicializar el resize observer del elemento
  useEffect(() => {
    const element = elementRef.current as HTMLElement;
    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    }
  }, [elementRef]);

  return {
    elemWidth: dimentions.elemWidth,
    elemHeight: dimentions.elemHeight
  };
}

export default useResizeObserver;