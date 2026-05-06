namespace BSS_API.Models.ObjectModels
{
    public class UpdateUserOperationSettingDasta
    {
        public int UserId { get; set; } = 0;
        public int RoleId { get; set; } = 0;
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public int MachineId { get; set; } = 0;
        public int SorterUserId { get; set; } = 0;
    }
}
