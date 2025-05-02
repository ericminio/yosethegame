export const powerOfTwoChooser = {
  getNumber: () => {
    const numbers = [8, 16, 32, 64, 128, 1024, 2048];
    const index = Math.floor(Math.random() * numbers.length);
    return numbers[index];
  },
};

export const primeFactorsOf = (number) => {
  const factors = [];
  let divisor = 2;
  while (number > 1) {
    if (number % divisor === 0) {
      factors.push(divisor);
      number = number / divisor;
    }
  }

  return factors;
};
