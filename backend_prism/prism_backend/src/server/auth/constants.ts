//By exporting the same secret used when we signed the JWT,
// we ensure that the verify phase performed by Passport, 
//and the sign phase performed in our AuthService, use a common secret.
export const jwtConstants = {
  secret: '-*Xsxx-=!2@@sawvpoA5~233Sx*-x+2+<+>?||sa3G44&r#oi6^n^Ms^df45-*sd4%*(W$%da#{q}}-}{s',
};
