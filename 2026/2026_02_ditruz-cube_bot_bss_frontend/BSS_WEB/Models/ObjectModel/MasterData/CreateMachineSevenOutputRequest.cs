using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateMachineSevenOutputRequest
    {
      
        public string mSevenOutputCode { get; set; } = string.Empty;
        public string mSevenOutputDescrpt { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;

    }
}
