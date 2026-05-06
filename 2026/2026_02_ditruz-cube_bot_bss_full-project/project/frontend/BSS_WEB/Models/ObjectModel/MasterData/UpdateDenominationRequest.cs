using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateDenominationRequest :CreateDenominationRequest
    {
        public int denominationId { get; set; } = 0;
        

    }
}
