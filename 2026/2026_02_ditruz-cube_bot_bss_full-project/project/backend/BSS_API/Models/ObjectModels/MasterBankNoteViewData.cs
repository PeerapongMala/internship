using BSS_API.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.ObjectModels
{
    public class MasterBankNoteTypeViewData
    { 
        public int BanknoteTypeId { get; set; } 
        public string BanknoteTypeCode { get; set; }
         
        public string BssBanknoteTypeCode { get; set; }
         
        public string BanknoteTypeName { get; set; }
         
        public string? BanknoteTypeDesc { get; set; }
         
        public bool? IsDisplay { get; set; } 
        public bool? IsActive { get; set; } 
        public int? CreatedBy { get; set; }
         
        public DateTime CreatedDate { get; set; } = DateTime.Now; 
        public int? UpdatedBy { get; set; }
         
        public DateTime? UpdatedDate { get; set; } 

    }
}
