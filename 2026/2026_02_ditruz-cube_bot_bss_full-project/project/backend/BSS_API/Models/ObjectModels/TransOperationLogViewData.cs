using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class TransOperationLogViewData
    {
        public int OperationLogId { get; set; }

        public int UserId { get; set; }
        
        public string OperationPage { get; set; }

        public string OperationController { get; set; }

        public string OperationAction { get; set; }

        public string OperationParam { get; set; }

        public string OperationResult { get; set; }

        public string? Remark { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
