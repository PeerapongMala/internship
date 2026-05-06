using BSS_WEB.Models.DisplayModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_WEB.Models.ServiceModel
{
    public class UnsortCashTransaction
    {
        public int UnsortCCId { get; set; } // Primary Key ปกติไม่เป็น Null
        public int? RegisterUnsortId { get; set; } // เติม ?
        public int? InstId { get; set; } // เติม ?

        public object? MasterInstitution { get; set; }

        public int? DenoId { get; set; } // เติม ?

        public object? MasterDenomination { get; set; }

        public int? BanknoteQty { get; set; } // เติม ?
        public int? RemainingQty { get; set; } // เติม ?

        public int? AdjustQty { get; set; }

        public bool? IsActive { get; set; } // เติม ?
        public int? CreatedBy { get; set; } // เติม ? (จากข้อมูล DB พบว่าเป็น NULL)
        public DateTime? CreatedDate { get; set; } // เติม ?
        public int? UpdatedBy { get; set; } // เติม ?
        public DateTime? UpdatedDate { get; set; } // เติม ?

        public object? TransactionPreparation { get; set; }
    }
    public class CheckValidateTransactionUnSortCcResult
    {
        public int? RegisterUnsortId { get; set; }
        public string? ContainerCode { get; set; }
        public int? DepartmentId { get; set; }
        public MasterDepartmentDisplay MasterDepartment { get; set; }
        public bool? IsActive { get; set; }
        public int? StatusId { get; set; }
        public MasterStatusDisplay MasterStatus { get; set; }
        public int? SupervisorReceived { get; set; }
        public DateTime? ReceivedDate { get; set; } = DateTime.Now;
        public string? Remark { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public List<UnsortCashTransaction> TransactionUnsortCCs { get; set; }
    }
}
