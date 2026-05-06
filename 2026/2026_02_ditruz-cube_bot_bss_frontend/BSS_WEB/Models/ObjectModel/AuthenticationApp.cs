namespace BSS_WEB.Models.ObjectModel
{
    public class AuthenticationApp
    {
        public string SystemName { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
        public string UserNameID { get; set; } = string.Empty;
        public string UserNameDisplay { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string IsExternalUser { get; set; } = string.Empty;
        public string RoleGroupId { get; set; } = string.Empty;
        public string RoleGroupCode { get; set; } = string.Empty; // New
        public string RoleGroupName { get; set; } = string.Empty;
        public string RoleId { get; set; } = string.Empty;
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string DepartmentId { get; set; } = string.Empty;
        public string DepartmentCode { get; set; } = string.Empty; // New
        public string DepartmentShortName { get; set; } = string.Empty; // New
        public string DepartmentName { get; set; } = string.Empty;
        public string CbBcdCode { get; set; } = string.Empty; // New
        public string IsSendUnsortCc { get; set; } = string.Empty;
        public string IsPrepareCentral { get; set; } = string.Empty;
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string CompanyId { get; set; } = string.Empty; // New
        public string CompanyCode { get; set; } = string.Empty; // New
        public string CompanyName { get; set; } = string.Empty; // New
        public string ConfigBssUnfitQty { get; set; } = string.Empty; // New
        public string ConfigBssStartTime { get; set; } = string.Empty; // New
        public string ConfigBssEndTime { get; set; } = string.Empty; // New
        public string ConfigBssWorkDay { get; set; } = string.Empty; // New
        public string ConfigBssAlertShift { get; set; } = string.Empty; // New
        public string ConfigBssBundle { get; set; } = string.Empty; // New
        public string ShiftCode { get; set; } = string.Empty; // New
        public string ShiftName { get; set; } = string.Empty; // New
        public string ShiftStartTime { get; set; } = string.Empty; // New
        public string ShiftEndTime { get; set; } = string.Empty; // New
        public string BnType { get; set; } = string.Empty; // New
        public string Machine { get; set; } = string.Empty;
        public string SorterUserId { get; set; } = string.Empty;
        public string ExpireDateTime { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}
