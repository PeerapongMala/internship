using System.Text;
using System.Security.Cryptography;

namespace BSS_API.Helpers
{
    public static class TokenHelper
    {
        public static string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();

            //var bytes = RandomNumberGenerator.GetBytes(64);
            //return Convert.ToBase64String(bytes);
        }

        public static string HashToken(this string token)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(bytes);
        }
    }
}
