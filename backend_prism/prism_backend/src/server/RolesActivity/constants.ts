export class jwtStaticRandomSTR {
    static stringRandomTime: string = jwtStaticRandomSTR.randomStringWithTime();

    private static randomStringWithTime() : string{
        let randSize = 1
        let r = Math.random().toString(36).substring(randSize);
 
        let dateTime = new Date()
        let finalStr : string
        finalStr = r + dateTime
 
        
        console.log("random str to output", finalStr);
        return finalStr

        
    }
}
  


//By exporting the same secret used when we signed the JWT,
// we ensure that the verify phase performed by Passport, 
// and the sign phase performed in our AuthService, use a common secret.
export const jwtConstants = {
    secret: '-*Xsxx-=!2@@sawvpoA5~233Sx*-x+2+<+>?||sa3G44&r#oi6^n^Ms^df45-*sd4%*(W$%da#{q}}-<{s',
};