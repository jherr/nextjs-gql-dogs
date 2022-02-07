export const weeksToString = (weeks: number): string => {
  let result = [];
  let currentWeeks = weeks;

  const years = Math.floor(currentWeeks / 52);
  if (years > 0) {
    result.push(`${years} years`);
    currentWeeks -= years * 52;
  }

  const months = Math.floor(currentWeeks / 4);
  if (months > 0) {
    result.push(`${months} months`);
    currentWeeks -= months * 4;
  }

  if (currentWeeks > 0) {
    result.push(`${currentWeeks} weeks`);
  }

  return result.join(" ");
};
