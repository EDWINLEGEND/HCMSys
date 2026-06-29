using System;
using System.IdentityModel.Tokens.Jwt;
namespace HCMSys.Helpers
{
    public static class JwtHelper
    {
        public static bool IsTokenExpired(string token)
        {
            if (string.IsNullOrEmpty(token))
                return true;

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            var exp = jwt.Payload.Exp;
            if (exp == null)
                return true;

            var expiry = DateTimeOffset.FromUnixTimeSeconds((long)exp).UtcDateTime;
            return expiry < DateTime.UtcNow;
        }
    }
}
