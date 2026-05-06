using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BSS_WEB.Helpers
{
    public class TokenHelper
    {
        public static ClaimsPrincipal ValidateJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero, // ไม่เผื่อเวลา
                ValidIssuer = AppConfig.JwtValidIssuer,
                ValidAudience = AppConfig.JwtValidAudience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(AppConfig.JwtIssuerSigningKey))
            };

            try
            {
                var principal = tokenHandler.ValidateToken(
                    token,
                    validationParameters,
                    out SecurityToken validatedToken);

                return principal; // ถ้าไม่ throw แสดงว่า valid
            }
            catch
            {
                return null; // token ไม่ถูกต้อง
            }
        }
    }
}
