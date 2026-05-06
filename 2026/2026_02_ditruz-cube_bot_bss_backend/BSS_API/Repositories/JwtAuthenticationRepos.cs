using BSS_API.Helpers;
using BSS_API.Repositories.Interface;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;

namespace BSS_API.Repositories
{
    public class JwtAuthenticationRepos : IJwtAuthenticationRepos
    {
        protected readonly IAppShare _share;
        public JwtAuthenticationRepos(IAppShare share)
        {
            _share = share;
        }

        public async Task<string> GenerateTokenAsync(string username, string rolename)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.JwtIssuerSigningKey));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, username),
                    new Claim(ClaimTypes.Role,rolename),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };


                var token = new JwtSecurityToken(
                        issuer: AppConfig.JwtValidIssuer,
                        audience: AppConfig.JwtValidAudience,
                        claims: claims,
                        expires: DateTime.UtcNow.AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble()),
                        signingCredentials: credentials);

                return await Task.Run(() =>
                {
                    return new JwtSecurityTokenHandler().WriteToken(token);
                });

            }
            catch (Exception ex)
            {

                return await Task.Run(() =>
                {
                    return string.Empty;
                });
            }
        }

    }
}
