using BSS_WEB.Core.Constants;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.RegularExpressions;

namespace BSS_WEB.Helpers
{
    public class AppShare : IAppShare
    {
        private readonly IBssAuthenticationService _bssAuthenticationService;
        private readonly IHttpContextAccessor _ContextAccessor;
        private ClaimsPrincipal? currentUser;
        private UserAuthorizationData? infoData;
        public AppShare(IHttpContextAccessor accessor, IBssAuthenticationService bssAuthenticationService)
        {
            _ContextAccessor = accessor;
            _bssAuthenticationService = bssAuthenticationService;
        }

        #region /Get SessionID/

        private string? _SessionID;
        public string SessionID
        {
            get
            {
                if (string.IsNullOrEmpty(_SessionID))
                {
                    _SessionID = GetSessionID();
                }
                return _SessionID;
            }
        }

        private string GetSessionID()
        {
            return $"{_ContextAccessor.HttpContext?.TraceIdentifier}"; ;
        }

        #endregion /Get SessionID/

        #region /Get UserNameId/

        private string? _UserNameId;

        public string UserNameId
        {
            get
            {
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    _UserNameId = principal.FindFirst("UserRegisterID")?.Value ?? string.Empty;
                }
                else
                {
                    _UserNameId = string.Empty;
                }

                return _UserNameId;
            }
        }

        #endregion /Get UserNameId/

        #region /Get UserID/

        private int _UserID = 0;

        public int UserID
        {
            get
            {
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    string idValue = principal.FindFirst("UserID")?.Value ?? "0";
                    _UserID = Convert.ToInt32(idValue);
                }
                else { _UserID = 0; }

                return _UserID;
            }
        }

        #endregion /Get UserID/

        #region /Get UserNameDisplay/

        private string? _UserNameDisplay;

        public string UserNameDisplay
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _UserNameDisplay = string.Empty;
                }
                else
                {
                    _UserNameDisplay = data?.Result?.userInfo.usernameDisplay ?? string.Empty;
                }

                return _UserNameDisplay;
            }
        }

        #endregion /Get UserNameDisplay/

        #region /Get FirstName/

        private string? _FirstName;

        public string FirstName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _FirstName = string.Empty;
                }
                else
                {

                    _FirstName = data?.Result?.userInfo.firstName ?? string.Empty;
                }


                return _FirstName;
            }
        }

        #endregion /Get FirstName/

        #region /Get LastName/

        private string? _LastName;

        public string LastName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _LastName = string.Empty;
                }
                else
                {

                    _LastName = data?.Result?.userInfo.lastName ?? string.Empty;
                }
                return _LastName;
            }
        }

        #endregion /Get LastName/

        #region /Get UserEmail/

        private string? _UserEmail;

        public string UserEmail
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _UserEmail = string.Empty;
                }
                else
                {

                    _UserEmail = data?.Result?.userInfo.userEmail ?? string.Empty;
                }

                return _UserEmail;
            }
        }

        #endregion /Get UserEmail/

        #region /Get IsExternalUser/

        private string? _IsExternalUser;

        public string IsExternalUser
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _IsExternalUser = string.Empty;
                }
                else
                {

                    _IsExternalUser = data?.Result?.userInfo.isInternal == true ? "YES" : "NO";
                }

                return _IsExternalUser;
            }
        }

        #endregion /Get IsExternalUser/

        #region /Get RoleGroupId/

        private int _RoleGroupId = 0;

        public int RoleGroupId
        {
            get
            {
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    string idValue = principal.FindFirst("RoleGroupID")?.Value ?? "0";
                    _RoleGroupId = Convert.ToInt32(idValue);
                }
                else
                {
                    _RoleGroupId = 0;
                }

                return _RoleGroupId;
            }
        }

        #endregion /Get RoleGroupId/

        #region /Get RoleGroupCode/

        private string? _RoleGroupCode;

        public string RoleGroupCode
        {
            get
            {
                _RoleGroupCode = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.OperationSettingGroup] ?? string.Empty;
                return _RoleGroupCode;
            }
        }

        #endregion /Get RoleGroupCode/

        #region /Get RoleGroupName/

        private string? _RoleGroupName;

        public string RoleGroupName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _RoleGroupName = string.Empty;
                }
                else
                {
                    _RoleGroupName = data?.Result?.roleGroupInfo.roleGroupName ?? string.Empty;
                }


                return _RoleGroupName;
            }
        }

        #endregion /Get RoleGroupName/

        #region /Get RoleId/

        private int _RoleId = 0;

        public int RoleId
        {
            get
            {
                var roleString = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.OperationSettingId] ?? "0";
                _RoleId = Convert.ToInt32(roleString);
                return _RoleId;
            }
        }

        #endregion /Get RoleId/

        #region /Get RoleCode/

        private string? _RoleCode;

        public string RoleCode
        {
            get
            {
                _RoleCode = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.OperationSettingCode] ?? string.Empty;
                return _RoleCode;
            }
        }


        #endregion /Get RoleCode/

        #region /Get RoleName/

        private string? _RoleName;

        public string RoleName
        {
            get
            {
                _RoleName = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.OperationSettingName] ?? string.Empty;
                return _RoleName;
            }
        }

        #endregion /Get RoleName/

        #region /Get DepartmentId/

        private int _DepartmentId = 0;

        public int DepartmentId
        {
            get
            {
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    string idValue = principal.FindFirst("DepartmentID")?.Value ?? "0";
                    _DepartmentId = Convert.ToInt32(idValue);
                }
                else
                {
                    _DepartmentId = 0;
                }

                return _DepartmentId;
            }
        }

        #endregion /Get DepartmentId/

        #region /Get DepartmentCode/

        private string? _DepartmentCode;

        public string DepartmentCode
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _DepartmentCode = string.Empty;
                }
                else
                {
                    _DepartmentCode = data?.Result?.userCompanyDepartmentInfo.departmentCode ?? string.Empty;
                }

                return _DepartmentCode;
            }
        }

        #endregion /Get DepartmentCode/

        #region /Get DepartmentName/

        private string? _DepartmentName;

        public string DepartmentName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _DepartmentName = string.Empty;
                }
                else
                {
                    _DepartmentName = data?.Result?.userCompanyDepartmentInfo.departmentName ?? string.Empty;
                }

                return _DepartmentName;
            }
        }

        #endregion /Get DepartmentName/

        #region /Get DepartmentShortName/

        private string? _DepartmentShortName;

        public string DepartmentShortName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _DepartmentShortName = string.Empty;
                }
                else
                {
                    _DepartmentShortName = data?.Result?.userCompanyDepartmentInfo.departmentShortName ?? string.Empty;
                }

                return _DepartmentShortName;
            }
        }

        #endregion /Get DepartmentShortName/

        #region /Get CbBcdCode/

        private string? _CbBcdCode;

        public string CbBcdCode
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _CbBcdCode = string.Empty;
                }
                else
                {

                    _CbBcdCode = data?.Result?.userCompanyDepartmentInfo.cbBcdCode ?? string.Empty;
                }


                return _CbBcdCode;
            }
        }

        #endregion /Get CbBcdCode/

        #region /Get IsSendUnsortCc/

        private string? _IsSendUnsortCc;

        public string IsSendUnsortCc
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _IsSendUnsortCc = string.Empty;
                }
                else
                {
                    _IsSendUnsortCc = data?.Result?.userCompanyDepartmentInfo.isSendUnsortCc == true ? "YES" : "NO";
                }

                return _IsSendUnsortCc;
            }
        }

        #endregion /Get IsSendUnsortCc/

        #region /Get IsPrepareCentral/

        private string? _IsPrepareCentral;

        public string IsPrepareCentral
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _IsPrepareCentral = string.Empty;
                }
                else
                {
                    _IsPrepareCentral = data?.Result?.userCompanyDepartmentInfo.isPrepareCentral == true ? "YES" : "NO";
                }

                return _IsPrepareCentral;
            }
        }

        #endregion /Get IsPrepareCentral/

        #region /Get StartDate/

        private DateTime? _StartDate = null;

        public DateTime? StartDate
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _StartDate = null;
                }
                else
                {
                    var startDate = data?.Result?.userCompanyDepartmentInfo.startDate ?? string.Empty;
                    _StartDate = string.IsNullOrEmpty(startDate) ? null : Convert.ToDateTime(startDate);
                }

                return _StartDate;
            }
        }

        #endregion /Get StartDate/

        #region /Get EndDate/

        private DateTime? _EndDate = null;

        public DateTime? EndDate
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _EndDate = null;
                }
                else
                {
                    var endDate = data?.Result?.userCompanyDepartmentInfo.endDate ?? string.Empty;
                    _EndDate = string.IsNullOrEmpty(endDate) ? null : Convert.ToDateTime(endDate);
                }

                return _EndDate;
            }
        }

        #endregion /Get EndDate/

        #region /Get CompanyId/

        private int _CompanyId = 0;

        public int CompanyId
        {
            get
            {
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    string idValue = principal.FindFirst("CompanyID")?.Value ?? "0";
                    _CompanyId = Convert.ToInt32(idValue);
                }
                else
                {
                    _CompanyId = 0;
                }

                return _CompanyId;
            }
        }

        #endregion /Get CompanyId/

        #region /Get CompanyCode/

        private string? _CompanyCode;

        public string CompanyCode
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _CompanyCode = "";
                }
                else
                {
                    _CompanyCode = data?.Result?.userCompanyDepartmentInfo.companyCode ?? string.Empty;
                }

                return _CompanyCode;
            }
        }

        #endregion /Get CompanyCode/

        #region /Get CompanyName/

        private string? _CompanyName;

        public string CompanyName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _CompanyName = "";
                }
                else
                {
                    _CompanyName = data?.Result?.userCompanyDepartmentInfo.companyName ?? string.Empty;
                }

                return _CompanyName;
            }
        }

        #endregion /Get CompanyName/

        #region /Get ConfigBssUnfitQty/

        private int _ConfigBssUnfitQty = 0;

        public int ConfigBssUnfitQty
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssUnfitQty = 0;
                }
                else
                {
                    var bssUnfitQty = data?.Result?.configInfo.bssUnfitQty ?? string.Empty;
                    _ConfigBssUnfitQty = string.IsNullOrEmpty(bssUnfitQty) ? 0 : Convert.ToInt32(bssUnfitQty);
                }

                return _ConfigBssUnfitQty;
            }
        }

        #endregion /Get ConfigBssUnfitQty/

        #region /Get ConfigBssStartTime/

        private TimeSpan? _ConfigBssStartTime = null;

        public TimeSpan? ConfigBssStartTime
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssStartTime = null;
                }
                else
                {
                    var bssStartTime = data?.Result?.configInfo.bssStartTime ?? string.Empty;
                    _ConfigBssStartTime = string.IsNullOrEmpty(bssStartTime) ? null : TimeSpan.Parse(bssStartTime);
                }

                return _ConfigBssStartTime;
            }
        }


        #endregion /Get ConfigBssStartTime/

        #region /Get ConfigBssEndTime/

        private TimeSpan? _ConfigBssEndTime = null;

        public TimeSpan? ConfigBssEndTime
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssEndTime = null;
                }
                else
                {
                    var bssEndTime = data?.Result?.configInfo.bssEndTime ?? string.Empty;
                    _ConfigBssEndTime = string.IsNullOrEmpty(bssEndTime) ? null : TimeSpan.Parse(bssEndTime);
                }

                return _ConfigBssEndTime;
            }
        }

        #endregion /Get ConfigBssEndTime/

        #region /Get ConfigBssWorkDay/

        private int _ConfigBssWorkDay = 0;

        public int ConfigBssWorkDay
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssWorkDay = 0;
                }
                else
                {
                    var bssWorkDay = data?.Result?.configInfo.bssWorkDay ?? string.Empty;
                    _ConfigBssWorkDay = string.IsNullOrEmpty(bssWorkDay) ? 0 : Convert.ToInt32(bssWorkDay);
                }

                return _ConfigBssWorkDay;
            }
        }

        #endregion /Get ConfigBssWorkDay/

        #region /Get ConfigBssAlertShift/

        private int _ConfigBssAlertShift = 0;

        public int ConfigBssAlertShift
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssAlertShift = 0;
                }
                else
                {
                    var bssAlertShift = data?.Result?.configInfo.bssAlertShift ?? string.Empty;
                    _ConfigBssAlertShift = string.IsNullOrEmpty(bssAlertShift) ? 0 : Convert.ToInt32(bssAlertShift);
                }

                return _ConfigBssAlertShift;
            }
        }

        #endregion /Get ConfigBssAlertShift/

        #region /Get ConfigBssBundle/

        private int _ConfigBssBundle = 0;

        public int ConfigBssBundle
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ConfigBssBundle = 0;
                }
                else
                {
                    var bssBundle = data?.Result?.configInfo.bssBundle ?? string.Empty;
                    _ConfigBssBundle = string.IsNullOrEmpty(bssBundle) ? 0 : Convert.ToInt32(bssBundle);
                }

                return _ConfigBssBundle;
            }
        }

        #endregion /Get ConfigBssBundle/

        #region /Get ShiftCode/

        private string? _ShiftCode;

        public string ShiftCode
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ShiftCode = string.Empty;
                }
                else
                {
                    _ShiftCode = data?.Result?.shiftInfo.shiftCode ?? string.Empty;
                }

                return _ShiftCode;
            }
        }

        #endregion /Get ShiftCode/

        #region /Get ShiftName /

        private string? _ShiftName;

        public string ShiftName
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ShiftName = string.Empty;
                }
                else
                {
                    _ShiftName = data?.Result?.shiftInfo.shiftName ?? string.Empty;
                }

                return _ShiftName;
            }
        }

        #endregion /Get ShiftName /

        #region /Get ShiftStartTime/

        private TimeSpan? _ShiftStartTime = null;

        public TimeSpan? ShiftStartTime
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ShiftStartTime = null;
                }
                else
                {
                    var shiftStartTimeText = data?.Result?.shiftInfo.shiftStartTimeText ?? string.Empty;
                    _ShiftStartTime = string.IsNullOrEmpty(shiftStartTimeText) ? null : TimeSpan.Parse(shiftStartTimeText);
                }

                return _ShiftStartTime;
            }
        }

        #endregion /Get ShiftStartTime/

        #region /Get ShiftEndTime/

        private TimeSpan? _ShiftEndTime = null;

        public TimeSpan? ShiftEndTime
        {
            get
            {
                var data = GetUserInformationData();
                if (data == null)
                {
                    _ShiftEndTime = null;
                }
                else
                {
                    var shiftEndTimeText = data?.Result?.shiftInfo.shiftEndTimeText ?? string.Empty;
                    _ShiftEndTime = string.IsNullOrEmpty(shiftEndTimeText) ? null : TimeSpan.Parse(shiftEndTimeText);
                }

                return _ShiftEndTime;
            }
        }

        #endregion /Get ShiftEndTime/

        #region /Get BnType /

        private string? _BnType;

        public string BnType
        {
            get
            {
                _BnType = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.BanknoteTypeSetting] ?? string.Empty;
                return _BnType;
            }
        }

        #endregion /Get BnType /

        #region /Get ExpireDateTime /

        //private DateTime? _ExpireDateTime = null;

        //public DateTime? ExpireDateTime
        //{
        //    get
        //    {
        //        _ExpireDateTime = string.IsNullOrEmpty(GetClaimsValues("ExpireDateTime")) ? null : Convert.ToDateTime(GetClaimsValues("ExpireDateTime"));
        //        return _ExpireDateTime;
        //    }
        //}

        #endregion /Get ExpireDateTime /

        #region /Get MachineId/

        private int _MachineId = 0;

        public int MachineId
        {
            get
            {
                var strMachineId = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.MachineSetting] ?? string.Empty;
                _MachineId = string.IsNullOrEmpty(strMachineId) ? 0 : Convert.ToInt32(strMachineId);

                return _MachineId;
            }
        }

        #endregion /Get MachineId/

        #region /Get SorterUserId/

        private int _SorterUserId = 0;

        public int SorterUserId
        {
            get
            {
                var strSorter = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.SorterSetting] ?? string.Empty;
                _SorterUserId = string.IsNullOrEmpty(strSorter) ? 0 : Convert.ToInt32(strSorter);
                return _SorterUserId;
            }
        }
        #endregion /Get SorterUserId/

        #region /Get AccessToken /

        private string? _AccessToken;

        public string AccessToken
        {
            get
            {
                _AccessToken = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.AccessToken] ?? string.Empty;
                return _AccessToken;
            }
        }

        #endregion /Get AccessToken /

        private async Task<UserAuthorizationData?> GetUserInformationData()
        {
            if (infoData == null)
            {
                var principal = GetUserDataFromPrincipal();
                if (principal == null)
                {
                    infoData = null;
                    return await Task.FromResult(infoData);
                }

                string userRegisterID = principal.FindFirst("UserRegisterID")?.Value;

                var resultData = await _bssAuthenticationService.GetUserInformationDataAsync(userRegisterID);
                if (resultData != null && resultData.is_success == true)
                {
                    infoData = resultData.data;
                }
            }

            return await Task.FromResult(infoData);
        }

        private ClaimsPrincipal? GetUserDataFromPrincipal()
        {
            var token = _ContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.AccessToken] ?? string.Empty;
            if (string.IsNullOrEmpty(token))
                return null;

            var principal = TokenHelper.ValidateJwtToken(token);
            return principal;
        }
    }
}
