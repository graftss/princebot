export const logArgument = (label: string = 'argument') => <T>(result: T): T => {
  console.log(`${label}: `, result);
  return result;
};
