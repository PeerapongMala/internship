namespace BSS_WEB.Models.ObjectModel
{
    public class SendrUnsortCCDataResponse
    {
        public long SendUnsortId { get; set; } // [send_unsort_id]
        public int? DepartmentId { get; set; } // [department_id]
        public string SendUnsortCode { get; set; } // [send_unsort_code]
        public string Remark { get; set; } // [remark]
        public string RefCode { get; set; } // [ref_code]
        public string OldRefCode { get; set; } // [old_ref_code]
        public int? StatusId { get; set; } // [status_id]
        public string StatusName { get; set; } // [status_id]
        public bool? IsActive { get; set; } // [is_active]
        public int? CreatedBy { get; set; } // [created_by]
        public string CreatedByName { get; set; }
        public DateTime? CreatedDate { get; set; } // [created_date]
        public int? UpdatedBy { get; set; } // [updated_by]
        public DateTime? UpdatedDate { get; set; } // [updated_date]
        public DateTime? SendDate { get; set; } // [send_date]
        public DateTime? ReceivedDate { get; set; } // [received_date]
        public bool CanEdit { get; set; } = false;
        public bool CanDelete { get; set; } = false;
        public bool CanReceived { get; set; } = false;

        public ICollection<ContainerBySendUnsortIdResponse> ContainerData { get; set; }
    }
}
