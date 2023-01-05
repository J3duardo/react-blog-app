export type CategoryObj = {[key: string]: number};

/**
 * Contar el número de ocurrencias de los elementos de un array
 * y retornar  los resultados en forma de un array de objetos
 * ordenados de forma descendente.
 */
export function arrayOccurrencesCounter<T extends string | number>(arr: T[]){
  const resultObj: CategoryObj = {};

  // Convertir el array de strings en un objeto
  // donde cada propiedad es el string y cada valor
  // es su número de ocurrencias.
  arr.forEach(str => {
    if (str in resultObj) {
      resultObj[str] = resultObj[str] + 1;
    } else {
      resultObj[str] = 1
    };
  });

  // 1. Convertir el objeto en un array de tuplas donde cada tupla
  // es de la forma [key, value].
  // 2. Ordenar el array de tuplas de forma descendente.
  // 3. Convertir el array de tuplas en un array de objetos ordenados.
  const resultSorted = Object.entries(resultObj).sort((a, b) => {
    return b[1] - a[1]
  })
  .map(entry => {
    return {[entry[0]]: entry[1]}
  });

  return resultSorted;
};