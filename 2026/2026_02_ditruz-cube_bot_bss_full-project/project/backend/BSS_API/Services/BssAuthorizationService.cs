using BSS_API.Core.Constants;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml.Office;
using Microsoft.Extensions.Logging.Abstractions;
using System.Globalization;

namespace BSS_API.Services
{
    public class BssAuthorizationService : IBssAuthorizationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BssAuthorizationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<UserAuthorizationData> CheckUserAuthorizationAsync(string usernameId)
        {
            UserAuthorizationData userAuthorizationData = new UserAuthorizationData();
            var currentDateTime = DateTime.Now;

            #region /* Get User Info */

            var userData = await _unitOfWork.UserRepos.GetAsync(u => u.UserName == usernameId.Trim() && u.IsActive == true);

            if (userData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            if (!(currentDateTime >= userData.StartDate && currentDateTime <= userData.EndDate))
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            var userInfo = new UserInfoData()
            {
                UserId = userData.UserId,
                UserName = userData.UserName,
                UsernameDisplay = userData.UsernameDisplay,
                UserEmail = userData.UserEmail,
                FirstName = userData.FirstName,
                LastName = userData.LastName,
                IsInternal = userData.IsInternal
            };

            userAuthorizationData.userInfo = userInfo;

            #endregion /* Get User Info */

            #region /* Get User Company And Department Info Data */

            var userCompanyDepartmentInfo = new UserCompanyDepartmentInfoData();

            var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(d => d.DepartmentId == userData.DepartmentId && d.IsActive == true);
            if (departmentData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            userCompanyDepartmentInfo.DepartmentId = departmentData.DepartmentId;
            userCompanyDepartmentInfo.DepartmentCode = departmentData.DepartmentCode;
            userCompanyDepartmentInfo.DepartmentName = departmentData.DepartmentName;
            userCompanyDepartmentInfo.DepartmentShortName = departmentData.DepartmentShortName;

            var userCompDeptDataList = await _unitOfWork.CompanyDepartmentRepos.GetAllAsync(cd => cd.DepartmentId == userData.DepartmentId && cd.IsActive == true);
            if (userCompDeptDataList == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            var userCompDeptData = userCompDeptDataList.OrderByDescending(o => o.CreatedDate).FirstOrDefault();
            if (userData.IsInternal == false)
            {
                if (!(currentDateTime >= userCompDeptData?.StartDate && currentDateTime <= userCompDeptData.EndDate))
                {
                    throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
                }
            }

            userCompanyDepartmentInfo.CbBcdCode = userCompDeptData.CbBcdCode;
            userCompanyDepartmentInfo.IsSendUnsortCc = userCompDeptData.IsSendUnsortCC;
            userCompanyDepartmentInfo.IsPrepareCentral = userCompDeptData.IsPrepareCentral;
            userCompanyDepartmentInfo.StartDate = userCompDeptData.StartDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));
            userCompanyDepartmentInfo.EndDate = userCompDeptData.EndDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));

            var companyData = await _unitOfWork.CompanyRepos.GetAsync(c => c.CompanyId == userCompDeptData.CompanyId && c.IsActive == true);

            if (companyData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            userCompanyDepartmentInfo.CompanyId = companyData.CompanyId;
            userCompanyDepartmentInfo.CompanyCode = companyData.CompanyCode;
            userCompanyDepartmentInfo.CompanyName = companyData.CompanyName;

            userAuthorizationData.userCompanyDepartmentInfo = userCompanyDepartmentInfo;
            #endregion /* Get User Company And Department Info Data */

            #region /* Get Role Info Data */

            var roleGroupInfo = new RoleGroupInfoData();
            var roleLists = new List<RoleInfoData>();

            var userRoleData = await _unitOfWork.UserRoleRepos.GetAsync(ur => ur.UserId == userData.UserId && ur.IsActive == true);
            if (userRoleData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            var roleGroupData = await _unitOfWork.RoleGroupRepos.GetAsync(rg => rg.RoleGroupId == userRoleData.RoleGroupId);
            if (roleGroupData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            roleGroupInfo.RoleGroupId = roleGroupData.RoleGroupId;
            roleGroupInfo.RoleGroupCode = roleGroupData.RoleGroupCode;
            roleGroupInfo.RoleGroupName = roleGroupData.RoleGroupName;

            userAuthorizationData.roleGroupInfo = roleGroupInfo;

            var roleResultData = await _unitOfWork.RoleRepos.GetAllAsync(r => r.RoleGroupId == roleGroupInfo.RoleGroupId && r.IsActive == true);
            if (roleResultData == null)
            {
                throw new Exception(BssAuthorizeResponseMessageConstants.UserUnauthorized);
            }

            var roleData = (from r in roleResultData
                            where r.IsActive == true
                            select new RoleInfoData
                            {
                                RoleId = r.RoleId,
                                RoleCode = r.RoleCode,
                                RoleName = r.RoleName
                            }).OrderBy(o => o.RoleId).ToList();

            roleLists.AddRange(roleData);

            userAuthorizationData.roleData = roleLists;
            #endregion /* Get Role Info Dataa */

            #region /* Get Default Config Info Data*/

            var defaultConfigInfo = new DefaultConfigInfoData();
            var configUnfitQty = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.UNFIT_QTY && item.IsActive == true);
            var configStartTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_START_TIME && item.IsActive == true);
            var configEndTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_END_TIME && item.IsActive == true);
            var configWorkDay = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_DAY && item.IsActive == true);
            var configAlertShift = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.ALERT_SHIFT && item.IsActive == true);
            var configBundle = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BUNDLE && item.IsActive == true);

            defaultConfigInfo.BssUnfitQty = configUnfitQty?.ConfigValue;
            defaultConfigInfo.BssStartTime = configStartTime?.ConfigValue;
            defaultConfigInfo.BssEndTime = configEndTime?.ConfigValue;
            defaultConfigInfo.BssWorkDay = configWorkDay?.ConfigValue;
            defaultConfigInfo.BssAlertShift = configAlertShift?.ConfigValue;
            defaultConfigInfo.BssBundle = configBundle?.ConfigValue;
            userAuthorizationData.configInfo = defaultConfigInfo;
            #endregion /* Get Default Config Info Data*/

            #region /* Get Shift Info Data*/ 

            ShiftInfoData? shiftInfoData = new ShiftInfoData();

            var shipData = await _unitOfWork.ShiftRepos.GetShiftInfoActiveAsync();
            if (shipData != null)
            {
                shiftInfoData = shipData.FirstOrDefault();
            }

            userAuthorizationData.shiftInfo = shiftInfoData;
            #endregion /* Get Shift Info Data*/ 

            return userAuthorizationData;
        }

        public async Task<UserAuthorizationData> GetUserInformationDataAsync(string usernameId)
        {
            UserAuthorizationData userInfoData = new UserAuthorizationData();

            #region /* Get User Info */

            var userData = await _unitOfWork.UserRepos.GetAsync(u => u.UserName == usernameId.Trim() && u.IsActive == true);

            if (userData != null)
            {
                var userInfo = new UserInfoData()
                {
                    UserId = userData.UserId,
                    UserName = userData.UserName,
                    UsernameDisplay = userData.UsernameDisplay,
                    UserEmail = userData.UserEmail,
                    FirstName = userData.FirstName,
                    LastName = userData.LastName,
                    IsInternal = userData.IsInternal
                };

                userInfoData.userInfo = userInfo;
            }

            #endregion /* Get User Info */

            #region /* Get User Company And Department Info Data */

            var userCompanyDepartmentInfo = new UserCompanyDepartmentInfoData();

            var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(d => d.DepartmentId == userData.DepartmentId && d.IsActive == true);
            if (departmentData != null)
            {
                userCompanyDepartmentInfo.DepartmentId = departmentData.DepartmentId;
                userCompanyDepartmentInfo.DepartmentCode = departmentData.DepartmentCode;
                userCompanyDepartmentInfo.DepartmentName = departmentData.DepartmentName;
                userCompanyDepartmentInfo.DepartmentShortName = departmentData.DepartmentShortName;

                var userCompDeptDataList = await _unitOfWork.CompanyDepartmentRepos.GetAllAsync(cd => cd.DepartmentId == userData.DepartmentId && cd.IsActive == true);
                if (userCompDeptDataList != null)
                {
                    var userCompDeptData = userCompDeptDataList.OrderByDescending(o => o.CreatedDate).FirstOrDefault();

                    userCompanyDepartmentInfo.CbBcdCode = userCompDeptData.CbBcdCode;
                    userCompanyDepartmentInfo.IsSendUnsortCc = userCompDeptData.IsSendUnsortCC;
                    userCompanyDepartmentInfo.IsPrepareCentral = userCompDeptData.IsPrepareCentral;
                    userCompanyDepartmentInfo.StartDate = userCompDeptData.StartDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));
                    userCompanyDepartmentInfo.EndDate = userCompDeptData.EndDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));

                    var companyData = await _unitOfWork.CompanyRepos.GetAsync(c => c.CompanyId == userCompDeptData.CompanyId && c.IsActive == true);

                    if (companyData != null)
                    {
                        userCompanyDepartmentInfo.CompanyId = companyData.CompanyId;
                        userCompanyDepartmentInfo.CompanyCode = companyData.CompanyCode;
                        userCompanyDepartmentInfo.CompanyName = companyData.CompanyName;
                    }
                }
            }

            userInfoData.userCompanyDepartmentInfo = userCompanyDepartmentInfo;

            #endregion /* Get User Company And Department Info Data */

            #region /* Get Role Info Data */

            var roleGroupInfo = new RoleGroupInfoData();
            var roleLists = new List<RoleInfoData>();

            var userRoleData = await _unitOfWork.UserRoleRepos.GetAsync(ur => ur.UserId == userData.UserId && ur.IsActive == true);
            if (userRoleData != null)
            {
                var roleGroupData = await _unitOfWork.RoleGroupRepos.GetAsync(rg => rg.RoleGroupId == userRoleData.RoleGroupId);
                if (roleGroupData != null)
                {
                    roleGroupInfo.RoleGroupId = roleGroupData.RoleGroupId;
                    roleGroupInfo.RoleGroupCode = roleGroupData.RoleGroupCode;
                    roleGroupInfo.RoleGroupName = roleGroupData.RoleGroupName;
                }
            }

            userInfoData.roleGroupInfo = roleGroupInfo;


            var roleResultData = await _unitOfWork.RoleRepos.GetAllAsync(r => r.RoleGroupId == roleGroupInfo.RoleGroupId && r.IsActive == true);
            if (roleResultData != null)
            {
                var roleData = (from r in roleResultData
                                where r.IsActive == true
                                select new RoleInfoData
                                {
                                    RoleId = r.RoleId,
                                    RoleCode = r.RoleCode,
                                    RoleName = r.RoleName
                                }).OrderBy(o => o.RoleId).ToList();

                roleLists.AddRange(roleData);
            }

            userInfoData.roleData = roleLists;

            #endregion /* Get Role Info Dataa */

            #region /* Get Default Config Info Data*/

            var defaultConfigInfo = new DefaultConfigInfoData();
            var configUnfitQty = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.UNFIT_QTY && item.IsActive == true);
            var configStartTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_START_TIME && item.IsActive == true);
            var configEndTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_END_TIME && item.IsActive == true);
            var configWorkDay = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BSS_DAY && item.IsActive == true);
            var configAlertShift = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.ALERT_SHIFT && item.IsActive == true);
            var configBundle = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == ConfigConstants.BUNDLE && item.IsActive == true);

            defaultConfigInfo.BssUnfitQty = configUnfitQty?.ConfigValue;
            defaultConfigInfo.BssStartTime = configStartTime?.ConfigValue;
            defaultConfigInfo.BssEndTime = configEndTime?.ConfigValue;
            defaultConfigInfo.BssWorkDay = configWorkDay?.ConfigValue;
            defaultConfigInfo.BssAlertShift = configAlertShift?.ConfigValue;
            defaultConfigInfo.BssBundle = configBundle?.ConfigValue;

            userInfoData.configInfo = defaultConfigInfo;

            #endregion /* Get Default Config Info Data*/

            #region /* Get Shift Info Data*/ 

            ShiftInfoData? shiftInfoData = new ShiftInfoData();

            var shipData = await _unitOfWork.ShiftRepos.GetShiftInfoActiveAsync();
            if (shipData != null)
            {
                shiftInfoData = shipData.FirstOrDefault();
            }

            userInfoData.shiftInfo = shiftInfoData;
            #endregion /* Get Shift Info Data*/ 

            return userInfoData;
        }

        public async Task<UserSessionLoginData?> CheckUserSessionLoginActiveAsync(string usernameId)
        {
            UserSessionLoginData resultData = new UserSessionLoginData();

            #region /* Get User Info */

            var userData = await _unitOfWork.UserRepos.GetAsync(u => u.UserName == usernameId.Trim() && u.IsActive == true);

            if (userData == null)
            {
                return null;
            }

            var userInfo = new UserInfoData()
            {
                UserId = userData.UserId,
                UserName = userData.UserName,
                UsernameDisplay = userData.UsernameDisplay,
                UserEmail = userData.UserEmail,
                FirstName = userData.FirstName,
                LastName = userData.LastName,
                IsInternal = userData.IsInternal
            };

            resultData.userInfo = userInfo;

            #endregion /* Get User Info */

            #region /* Get Login Log */

            var loginResult = await _unitOfWork.TransUserLoginLogRepos.GetLoginLogActiveByUserIdAsync(userInfo.UserId, userData.DepartmentId);

            if(loginResult.Any())
            {
                resultData.transactionUserLoginLogs = loginResult.ToList();
                resultData.hasLoginActive = true;
            }
            
            #endregion /* Get Login Log */

            return resultData;
        }

        public async Task<UserSessionLoginData?> CheckUserSessionByMachineAsync(CheckUserSessionByMachineActiveRequest request)
        {
            UserSessionLoginData resultData = new UserSessionLoginData();

            #region /* Get User Info */

            var userData = await _unitOfWork.UserRepos.GetAsync(u => u.UserId == request.UserId && u.IsActive == true);

            if (userData == null)
            {
                return null;
            }

            var userInfo = new UserInfoData()
            {
                UserId = userData.UserId,
                UserName = userData.UserName,
                UsernameDisplay = userData.UsernameDisplay,
                UserEmail = userData.UserEmail,
                FirstName = userData.FirstName,
                LastName = userData.LastName,
                IsInternal = userData.IsInternal
            };

            resultData.userInfo = userInfo;

            #endregion /* Get User Info */

            #region /* Get Login Log */

            var loginResult = await _unitOfWork.TransUserLoginLogRepos.GetLoginLogActiveByMachineAsync(request);

            if (loginResult.Any())
            {
                resultData.transactionUserLoginLogs = loginResult.ToList();
                resultData.hasLoginActive = true;
            }

            #endregion /* Get Login Log */

            return resultData;
        }
    }
}
