using BSS_API.Models.Entities;

namespace BSS_API.Services.Interface
{
    using BSS_API.Models.ObjectModels;
    using Models.SearchParameter;

    public interface IMasterDropDownService
    {
        Task<ICollection<DropDownItemResponse<MasterZone>>> GetDropDownZoneItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserSupervisorItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserPreparatorItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterConfig>>> GetDropDownConfigItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterMachine>>> GetDropDownMachineItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterCashPoint>>> GetDropDownCashPointItemAsync(SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterCashPoint>>> GetDropDownCashPointWithZoneItemAsync(SystemSearchRequest request);

        Task<ICollection<DropDownItemResponse<MasterInstitution>>> GetDropDownInstitutionItemAsync(
            SystemSearchRequest request);
        
        Task<ICollection<DropDownItemResponse<MasterInstitution>>> GetDropDownInstitutionWithCompanyItemAsync(
            SystemSearchRequest request);

        Task<ICollection<DropDownItemResponse<MasterCashCenter>>> GetDropDownCashCenterItemAsync(
            SystemSearchRequest request);

        Task<ICollection<DropDownItemResponse<MasterDenomination>>> GetDropDownDenominationItemAsync(
            SystemSearchRequest request);

        Task<ICollection<DropDownItemResponse<MasterCashPointUnsortCcViewData>>> GetDropDownCashPointUnsortCcItemAsync(SystemSearchRequest request);
        Task<ICollection<DropDownItemResponse<MasterZoneUnsortCcViewData>>> GetDropDownZoneUnsortCcItemAsync(SystemSearchRequest request);
        Task<ICollection<DropDownItemResponse<MasterDenoUnsortCcViewData>>> GetDropDownDenomenationUnsortCcItemAsync(SystemSearchRequest request);
    }
}