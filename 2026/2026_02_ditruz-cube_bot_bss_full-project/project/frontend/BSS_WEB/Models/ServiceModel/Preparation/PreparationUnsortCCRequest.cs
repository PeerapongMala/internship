using BSS_WEB.Core.Constants;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class PreparationUnsortCCRequest
    {
        public int DepartmentId { get; set; }
        public int? MachineId { get; set; }
        public bool IsReconcile { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public int StatusId { get; set; } = BssStatusConstants.Prepared;
        public int BnTypeId { get; set; } = BNTypeConstants.UnsortCC;
    }
}
