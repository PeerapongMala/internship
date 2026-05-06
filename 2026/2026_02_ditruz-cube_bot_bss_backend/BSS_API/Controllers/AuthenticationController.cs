using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Repositories;
using BSS_API.Repositories.Interface;
using BSS_API.Services;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Net.NetworkInformation;
using System.Text.Json.Serialization;

namespace BSS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class AuthenticationController : BaseController
    {
        #region / * Construction * / 
        private readonly IJwtAuthenticationRepos _jwtAuthentService;
        private readonly IBssAuthenticationService _bssAuthenService;
        private readonly IMasterUserService _masterUserService;
        private readonly IMasterDepartmentService _masterDepartmentService;
        private readonly IMasterCompanyService _masterCompanyService;
        private readonly IMasterUserRoleService _masterUserRoleService;
        private readonly IMasterRoleService _masterRoleService;
        private readonly IMasterRoleGroupService _masterRoleGroupService;
        private readonly IAppShare _share;
        //private readonly ILogger<AuthenticationController> _logger;
        private readonly ITransactionUserLoginLogService _loginLogService;
        private readonly IMasterCompanyDepartmentService _CompanyDepartmentService;
        private readonly IMasterConfigService _masterConfigService;
        private readonly IMasterShiftService _shiftService;
        private readonly IBssAuthorizationService _authorizationService;
        private readonly IBssRefreshTokenService _refreshTokenService;
        public AuthenticationController(IJwtAuthenticationRepos jwtAuthentService,
            IAppShare share,
            IBssAuthenticationService bssAuthenService,
            IMasterUserService masterUserService,
            IMasterDepartmentService masterDepartmentService,
            IMasterCompanyService masterCompanyService,
            IMasterUserRoleService masterUserRoleService,
            IMasterRoleService masterRoleService,
            IMasterRoleGroupService masterRoleGroupService,
            ITransactionUserLoginLogService loginLogService,
            IMasterCompanyDepartmentService companyDepartmentService,
            IMasterConfigService masterConfigService,
            IMasterShiftService shiftService,
            IBssAuthorizationService authorizationService,
            IBssRefreshTokenService refreshTokenService) : base(share)
        {
            _jwtAuthentService = jwtAuthentService;
            _share = share;
            _bssAuthenService = bssAuthenService;
            _masterUserService = masterUserService;
            _masterDepartmentService = masterDepartmentService;
            _masterCompanyService = masterCompanyService;
            _masterUserRoleService = masterUserRoleService;
            _masterRoleService = masterRoleService;
            _masterRoleGroupService = masterRoleGroupService;
            _loginLogService = loginLogService;
            _CompanyDepartmentService = companyDepartmentService;
            _masterConfigService = masterConfigService;
            _shiftService = shiftService;
            _authorizationService = authorizationService;
            _refreshTokenService = refreshTokenService;
        }
        #endregion / * Construction * / 

        #region /* BOT AD WS For Internal Authentication  */

        [HttpGet("GetUserByLogonName")]
        public async Task<IActionResult> GetUserByLogonName([Required] string logonName)
        {
            var userResult = await _bssAuthenService.GetUserByLogonName(logonName);
            if (!userResult.is_success)
            {
                return ApiDataNotFound();

            }

            return ApiSuccess(userResult.data);
        }

        [HttpGet("GetUsersByGuid")]
        public async Task<IActionResult> GetUsersByGuid([Required] string guid)
        {
            var userResult = await _bssAuthenService.GetUsersByGuid(guid);
            if (!userResult.is_success)
            {
                return ApiDataNotFound();

            }

            return ApiSuccess(userResult);
        }

        [HttpGet("GetAllInOUAccountByDisplayNames")]
        public async Task<IActionResult> GetAllInOUAccountByDisplayNames([Required] string displayName)
        {
            var userResult = await _bssAuthenService.GetAllInOUAccountByDisplayNames(displayName);
            if (!userResult.is_success)
            {
                return ApiDataNotFound();

            }

            return ApiSuccess(userResult);
        }

        [HttpGet("UserInternalAuthen")]
        public async Task<IActionResult> UserInternalAuthen([Required] string logonName)
        {
            _share.LogInformation($"STEP1:Controller: Authentication , Action: UserInternalAuthen");
            var userResult = await _bssAuthenService.GetUserByLogonName(logonName);
            _share.LogInformation($"STEP99:UserResult From GetUserByLogonName :{JsonConvert.SerializeObject(userResult)}");
            if (!userResult.is_success)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(userResult.data);
        }

        #endregion /* BOT AD WS For Internal Authentication */

        #region /* BOT AUTHEN WS For External Authentication  */

        [HttpGet("GetActivePersonByCert")]
        public async Task<IActionResult> GetActivePersonByCert([Required] string sCertificate)
        {
            var userResult = await _bssAuthenService.GetActivePersonByCert(sCertificate);
            if (!userResult.is_success)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(userResult.data);
        }

        [HttpGet("GetPersonListBySearchName")]
        public async Task<IActionResult> GetPersonListBySearchName([Required] string partialName, [Required] string organizationID)
        {
            var userResult = await _bssAuthenService.GetPersonListBySearchName(partialName, organizationID);
            if (!userResult.is_success)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(userResult);
        }

        [HttpGet("UserExternalAuthen")]
        public async Task<IActionResult> UserExternalAuthen(string sCertificate)
        {
            var userResult = await _bssAuthenService.GetActivePersonByCert(sCertificate);

            if (!userResult.is_success)
            {
                return ApiDataNotFound();
            }
            else
            {
                var userData = new UserExternalAuthenData()
                {
                    RegID = userResult.data.RegID,
                    PID = userResult.data.PID,
                    NameEN = userResult.data.NameEN,
                    NameTH = userResult.data.NameTH,
                    InstCode = userResult.data.InstCode,
                    ProfileType = userResult.data.ProfileType,
                    Status = userResult.data.Status
                };

                return ApiSuccess(userData);
            }
        }


        #endregion /* BOT AUTHEN WS For External Authentication  */

        [HttpGet("CheckUserAuthorization")]
        public async Task<IActionResult> CheckUserAuthorization([Required] string usernameId)
        {
            var userResult = await _authorizationService.CheckUserAuthorizationAsync(usernameId);
            if (userResult == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูลผู้ใช้งานในระบบ");
            }

            return ApiSuccess(userResult);
        }

        [HttpPost("SearchUserForRegister")]
        public async Task<IActionResult> SearchUserForRegister(SearchUserForRegisterRequest request)
        {
            var serviceResponse = new BaseResponse<List<SearchUserForRegisterData>>();

            var userData = new List<SearchUserForRegisterData>();

            var userCreateInfo = await _masterUserService.GetUserById(request.CreateBy);
            var userDepartmentInfo = await _masterDepartmentService.GetDepartmentById(userCreateInfo.DepartmentId);
            var userCompanyInfo = await _masterCompanyService.GetCompanyById(request.CompanyId);

            if (userCreateInfo.IsInternal == true)
            {
                var userInternalResult = await _bssAuthenService.GetAllInOUAccountByDisplayNames(request.UserNameInput);
                if (userInternalResult.data != null)
                {
                    var listData = userInternalResult.data.Select(x => new SearchUserForRegisterData
                    {
                        RegisterId = x.ObjectGUID,
                        FirstName = x.ThaiFullName.Trim().Split(" ")[0].ToString(),
                        LastName = x.ThaiFullName.Trim().Split(" ")[1].ToString(),
                        Email = x.Email,
                        LogonName = string.IsNullOrEmpty(x.Email) ? string.Empty : x.Email.Trim().Split("@")[0].ToString()
                    }).ToList();

                    userData = listData;
                }
            }
            else
            {
                string organizationID = userDepartmentInfo.DepartmentShortName;
                string partialName = request.UserNameInput.Trim();
                var userExternalResult = await _bssAuthenService.GetPersonListBySearchName(partialName, organizationID);
                if (userExternalResult.data != null)
                {
                    var listData = userExternalResult.data.Select(x => new SearchUserForRegisterData
                    {
                        RegisterId = x.RegID,
                        FirstName = x.NameTH.ToString(),
                        LastName = x.NameEN.ToString(),
                        Email = string.Empty,
                        LogonName = x.NameTH.ToString()
                    }).ToList();
                    userData = listData;
                }
            }

            return ApiSuccess(userData);
        }

        [HttpPost("UpdateUserOperationSetting")]
        public async Task<IActionResult> UpdateUserOperationSetting(SaveOperationSettingRequest request)
        {
            var userloginData = await _loginLogService.GetTransactionLoginLogByUserId(request.UserId);
            var roleData = await _masterRoleService.GetRoleByCode(request.OperationSelected.Trim());

            if (request.MachineSelected != "999")
            {
                userloginData.MachineId = request.MachineSelected.AsInt();
                await _loginLogService.UpdateTransactionUserLoginLog(userloginData);
            }


            var userOperationInfo = new UpdateUserOperationSettingDasta()
            {
                UserId = request.UserId,
                RoleId = roleData.RoleId,
                RoleCode = roleData.RoleCode,
                RoleName = roleData.RoleName,
                MachineId = request.MachineSelected.AsInt(),
                SorterUserId = string.IsNullOrEmpty(request.SorterSelected) ? 0 : request.SorterSelected.AsInt()
            };

            return ApiSuccess(userOperationInfo);
        }

        [HttpPost("UpdateUserVerifySetting")]
        public async Task<IActionResult> UpdateUserVerifySetting(SaveVerifySettingRequest request)
        {
            var serviceResponse = new BaseResponse<UpdateUserOperationSettingDasta>();

            var userloginData = await _loginLogService.GetTransactionLoginLogByUserId(request.UserId);
            var roleData = await _masterRoleService.GetRoleByCode(request.OperationSelected.Trim());

            userloginData.MachineId = request.MachineSelected.AsInt();
            await _loginLogService.UpdateTransactionUserLoginLog(userloginData);

            var userOperationInfo = new UpdateUserOperationSettingDasta()
            {
                UserId = request.UserId,
                RoleId = roleData.RoleId,
                RoleCode = roleData.RoleCode,
                RoleName = roleData.RoleName,
                MachineId = request.MachineSelected.AsInt(),
                SorterUserId = 0
            };

            return ApiSuccess(userOperationInfo);
        }

        [HttpPost("UserLogout")]
        public async Task<IActionResult> UserLogout(UserLogoutRequest request)
        {
            var userloginData = await _loginLogService.GetTransactionLoginLogByUserId(request.UserId);
            if (userloginData != null)
            {
                userloginData.LastLogin = DateTime.Now;
                userloginData.IsActive = false;
                userloginData.UpdatedBy = request.UserId;
                userloginData.UpdatedDate = DateTime.Now;
                await _loginLogService.UpdateTransactionUserLoginLog(userloginData);
            }

            return ApiSuccess("Logout Success.");
        }

        [HttpPost("GetSorterUsers")]
        public async Task<IActionResult> GetSorterUsers(GetSorterUsersRequest request)
        {
            var sorterUser = new List<UserInfoData>();
            var operatorUsers = await _masterUserService.GetOperatorUsersActive(request);
            if (operatorUsers.Any())
            {
                var operatorLogin = await _loginLogService.GetTransactionUserLoginLogsByDepartmentId(request.DepartmentId);

                if (operatorLogin.Any())
                {
                    foreach (var user in operatorUsers)
                    {
                        var existLogin = operatorLogin.Where(item => item.UserId == user.UserId).ToList();
                        if (existLogin == null || existLogin.Count == 0)
                        {
                            sorterUser.Add(user);
                        }
                    }
                }
                else
                {
                    sorterUser.AddRange(operatorUsers);
                }
            }

            return ApiSuccess(sorterUser);
        }

        [HttpGet("GetUserInformationData")]
        public async Task<IActionResult> GetUserInformationData([Required] string usernameId)
        {
            var userResult = await _authorizationService.GetUserInformationDataAsync(usernameId);
            if (userResult == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูลผู้ใช้งานในระบบ");
            }

            return ApiSuccess(userResult);
        }

        [HttpPost("CreateRefreshToken")]
        public async Task<IActionResult> CreateRefreshToken(CreateRefreshTokenRequest request)
        {
            var tokenResult = await _refreshTokenService.CreateRefreshTokenAsync(request);
            if (tokenResult == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(tokenResult);
        }

        [HttpPost("RefreshTokenAndRotation")]
        public async Task<IActionResult> RefreshTokenAndRotation(RefreshTokenAndNewGenerateRequest request)
        {
            var tokenResult = await _refreshTokenService.RefreshTokenAndRotationAsync(request);
            if (tokenResult == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(tokenResult);
        }

        [HttpPost("LogoutAndRevoke")]
        public async Task<IActionResult> LogoutAndRevoke(LogoutAndRevokeRequest request)
        {
            var tokenResult = await _refreshTokenService.LogoutAndRevokeAsync(request);
            if (tokenResult == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(tokenResult);
        }


    }
}
