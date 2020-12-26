export const create2dArray = (rows, cols) => {
  let result = new Array(cols);
  for (let i = 0; i < rows; i++) result[i] = new Array(cols).fill(0);
  return result;
};
