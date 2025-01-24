//Password Strength Checker
export const passwordStrength = (password: string): string => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 20) strength += 1;
  if (password.match(/[a-zA-Z0-9]/)) strength += 1;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
  if (password.length >= 1 && password.length <= 4) strength = 1;

  switch (strength) {
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Strong";
    case 4:
      return "Strong";
    default:
      return "";
  }
};
