const getAgeYearMonth = (dobStr: string) => {
  let age = '-';
  let remainingMonths = '-';
  if (dobStr && dobStr !== '-') {
    try {
      const dobDate = new Date(dobStr);
      const currentDate = new Date();

      // Calculate age in years
      let ageYears = currentDate.getFullYear() - dobDate.getFullYear();

      // Calculate total months between the dates
      const totalMonths =
        (currentDate.getFullYear() - dobDate.getFullYear()) * 12 +
        (currentDate.getMonth() - dobDate.getMonth());

      // Check if birthday has occurred this year
      if (
        currentDate.getMonth() < dobDate.getMonth() ||
        (currentDate.getMonth() === dobDate.getMonth() &&
          currentDate.getDate() < dobDate.getDate())
      ) {
        ageYears--;
      }

      // Calculate remaining months until next birthday
      const nextBirthdayMonth = (dobDate.getMonth() - currentDate.getMonth() + 12) % 12;

      age = ageYears.toString();
      remainingMonths = nextBirthdayMonth.toString();
    } catch (error) {
      return {
        years: age,
        months: remainingMonths,
      };
    }
    return {
      years: age,
      months: remainingMonths,
    };
  }
  return {
    years: age,
    months: remainingMonths,
  };
};

export const utils = { getAgeYearMonth };
