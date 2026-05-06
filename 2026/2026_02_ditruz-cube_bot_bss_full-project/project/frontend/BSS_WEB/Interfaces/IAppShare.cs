

namespace BSS_WEB.Interfaces
{
    public interface IAppShare
    {
        string SessionID { get; }
        string UserNameId { get; }
        int UserID { get; }
        string UserNameDisplay { get; }
        string FirstName { get; }
        string LastName { get; }
        string UserEmail { get; }
        string IsExternalUser { get; } // YES Or NO
        int RoleGroupId { get; }
        string RoleGroupCode { get; }
        string RoleGroupName { get; }
        int RoleId { get; }
        string RoleCode { get; }
        string RoleName { get; }
        int DepartmentId { get; }
        string DepartmentCode { get; }
        string DepartmentShortName { get; }
        string CbBcdCode { get; }
        string IsSendUnsortCc { get; } // YES Or NO
        string IsPrepareCentral { get; } // YES Or NO
        DateTime? StartDate { get; }
        DateTime? EndDate { get; }
        int CompanyId { get; }
        string CompanyCode { get; }
        string CompanyName { get; }
        int ConfigBssUnfitQty { get; }
        TimeSpan? ConfigBssStartTime { get; }
        TimeSpan? ConfigBssEndTime { get; }
        int ConfigBssWorkDay { get; }
        int ConfigBssAlertShift { get; }
        int ConfigBssBundle { get; }
        string ShiftCode { get; }
        string ShiftName { get; }
        TimeSpan? ShiftStartTime { get; }
        TimeSpan? ShiftEndTime { get; }
        string BnType { get; }
        //DateTime? ExpireDateTime { get; }
        int MachineId { get; }
        int SorterUserId { get; }
        string AccessToken { get; }
    }
}
