using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text;
using NuGet.Common;
using BSS_WEB.Models.SearchModel;
using DocumentFormat.OpenXml.Spreadsheet;
using ZXing.Aztec.Internal;
using System.Security.Cryptography;

namespace BSS_WEB.Services
{
    public class BssAuthenticationService : BaseApiClient, IBssAuthenticationService
    {
        private readonly ILogger<BssAuthenticationService> _logger;
        public BssAuthenticationService(ILogger<BssAuthenticationService> logger, HttpClient client, IHttpContextAccessor contextAccessor) 
            : base(client, logger, contextAccessor)
        {
            _logger = logger;
        }

        public async Task<CheckUserAuthorizationResult> CheckUserAuthorizationAsyn(string usernameId)
        {
            return await SendAsync<CheckUserAuthorizationResult>(HttpMethod.Get, $"api/Authentication/CheckUserAuthorization?usernameId={usernameId}");
        }
        public async Task<UserInternalAuthenResult> UserInternalAuthenAsyn(string logonName)
        {
            return await SendAsync<UserInternalAuthenResult>(HttpMethod.Get, $"api/Authentication/UserInternalAuthen?logonName={logonName}");
        }
        public async Task<UserExternalAuthenResult> UserExternalAuthenAsyn(string sCertificate)
        {
            return await SendAsync<UserExternalAuthenResult>(HttpMethod.Get, $"api/Authentication/UserExternalAuthen?sCertificate={Uri.EscapeDataString(sCertificate)}");
        }
        public async Task<SearchUserForRegisterResult> SearchUserForRegisterAsync(SearchUserForCreateRequest request)
        {
            return await SendAsync<SearchUserForRegisterResult>(HttpMethod.Post, $"api/Authentication/SearchUserForRegister", request);
        }
        public async Task<UpdateUserOperationSettingResult> UpdateUserOperationSettingAsync(SaveOperationSettingRequest request)
        {
            return await SendAsync<UpdateUserOperationSettingResult>(HttpMethod.Post, $"api/Authentication/UpdateUserOperationSetting", request);
        }
        public async Task<UpdateUserOperationSettingResult> UpdateUserVerifySettingAsync(SaveVerifySettingRequest request)
        {
            return await SendAsync<UpdateUserOperationSettingResult>(HttpMethod.Post, $"api/Authentication/UpdateUserVerifySetting", request);
        }
        public async Task<BaseServiceResult> UserLogoutAsync(UserLogoutRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/Authentication/UserLogout", request);
        }
        public async Task<GetSorterUsersResult> GetSorterUsersAsync(GetSorterUsersRequest request)
        {
            return await SendAsync<GetSorterUsersResult>(HttpMethod.Post, $"api/Authentication/GetSorterUsers", request);
        }

        public async Task<string> GenerateAccessTokenJwt(UserAccessData user)
        {
            try
            {
                var claims = new[]
                {
                    new Claim("UserID", user.UserID),
                    new Claim("UserRegisterID", user.UserRegisterID),
                    new Claim("UserName", user.UserName),
                    new Claim("UserEmail", user.UserEmail),
                    new Claim("RoleGroupID", user.RoleGroupID),
                    new Claim("RoleID", user.RoleID),
                    new Claim("DepartmentID", user.DepartmentID),
                    new Claim("CompanyID", user.CompanyID),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.JwtIssuerSigningKey));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.Now.AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());

                var jwtToken = new JwtSecurityToken(
                   issuer: AppConfig.JwtValidIssuer,
                   audience: AppConfig.JwtValidAudience,
                   claims: claims,
                   expires: expires,
                   signingCredentials: credentials);

               var tokenData = new JwtSecurityTokenHandler().WriteToken(jwtToken);
                return await Task.FromResult(tokenData);
            }
            catch (Exception)
            {
                return await Task.FromResult(string.Empty);
            }
        }

        public async Task<string> GenerateRefreshToken()
        {
            return await Task.FromResult(Guid.NewGuid().ToString());
        }

        public async Task<string> HashRefreshToken(string refreshToken)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));
            return await Task.FromResult(Convert.ToBase64String(bytes));
        }

        public async Task<GetUserInformationDataResult> GetUserInformationDataAsync(string usernameId)
        {
            return await SendAsync<GetUserInformationDataResult>(HttpMethod.Get, $"api/Authentication/CheckUserAuthorization?usernameId={usernameId}");
        }

        public async Task<RefreshTokenServiceResult> CreateRefreshTokenAsync(CreateRefreshTokenRequest request)
        {
            return await SendAsync<RefreshTokenServiceResult>(HttpMethod.Post, $"api/Authentication/CreateRefreshToken", request);
        }

        public async Task<RefreshTokenServiceResult> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request)
        {
            return await SendAsync<RefreshTokenServiceResult>(HttpMethod.Post, $"api/Authentication/RefreshTokenAndRotation", request);
        }

        public async Task<RefreshTokenServiceResult> LogoutAndRevoke(LogoutAndRevokeRequest request)
        {
            return await SendAsync<RefreshTokenServiceResult>(HttpMethod.Post, $"api/Authentication/LogoutAndRevoke", request);
        }

        public async Task<CheckUserSessionLoginActiveResult> CheckUserSessionLoginActiveAsyn(string usernameId)
        {
            return await SendAsync<CheckUserSessionLoginActiveResult>(HttpMethod.Get, $"api/Authentication/CheckUserSessionLoginActive?usernameId={usernameId}");
        }

        public async Task<GetUserLoginDropdownResult> GetUserLoginDropdownAsync()
        {
            return await SendAsync<GetUserLoginDropdownResult>(HttpMethod.Get, $"api/Authentication/GetUserLoginDropdown");
        }

        public async Task<CheckUserSessionLoginActiveResult> CheckUserSessionByMachineAsync(CheckUserSessionByMachineActiveRequest request)
        {
            return await SendAsync<CheckUserSessionLoginActiveResult>(HttpMethod.Post, $"api/Authentication/CheckUserSessionByMachine", request);
        }
    }
}
