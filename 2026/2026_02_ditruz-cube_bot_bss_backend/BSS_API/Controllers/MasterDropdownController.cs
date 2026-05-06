namespace BSS_API.Controllers
{
    using Helpers;
    using Services;
    using Core.Constants;
    using Services.Interface;
    using Models.SearchParameter;
    using Repositories.Interface;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/[controller]")]
    public class MasterDropdownController(
        IUnitOfWork unitOfWork,
        ILogger<MasterDropdownController> logger,
        IAppShare share)
        : BaseController(share)
    {
        private readonly IAppShare _share = share;
        private readonly ILogger<MasterDropdownController> _logger = logger;

        [HttpPost("GetDropDown")]
        public async Task<IActionResult> GetMasterDropDown(SystemSearchRequest request)
        {
            IMasterDropDownService masterDropDownService = new MasterDropDownService(unitOfWork);
            switch (request.TableName)
            {
                case EntityNameConstants.MasterZone:
                    return ApiSuccess(await masterDropDownService.GetDropDownZoneItemAsync(request));
                case EntityNameConstants.MasterUser:
                    return ApiSuccess(await masterDropDownService.GetDropDownUserItemAsync(request));
                case EntityNameConstants.MasterConfig:
                    return ApiSuccess(await masterDropDownService.GetDropDownConfigItemAsync(request));
                case EntityNameConstants.MasterMachine:
                    return ApiSuccess(await masterDropDownService.GetDropDownMachineItemAsync(request));
                case EntityNameConstants.MasterCashPoint:
                    return ApiSuccess(await masterDropDownService.GetDropDownCashPointItemAsync(request));
                case EntityNameConstants.MasterCashPointWithZone:
                    return ApiSuccess(await masterDropDownService.GetDropDownCashPointWithZoneItemAsync(request));
                case EntityNameConstants.MasterUserSuperVisor:
                    return ApiSuccess(await masterDropDownService.GetDropDownUserSupervisorItemAsync(request));
                case EntityNameConstants.MasterUserPreparator:
                    return ApiSuccess(await masterDropDownService.GetDropDownUserPreparatorItemAsync(request));
                case EntityNameConstants.MasterInstitution:
                    return ApiSuccess(await masterDropDownService.GetDropDownInstitutionItemAsync(request));
                case EntityNameConstants.MasterInstitutionWithCompany:
                    return ApiSuccess(await masterDropDownService.GetDropDownInstitutionWithCompanyItemAsync(request));
                case EntityNameConstants.MasterCashCenter:
                    return ApiSuccess(await masterDropDownService.GetDropDownCashCenterItemAsync(request));
                case EntityNameConstants.MasterDenomination:
                    return ApiSuccess(await masterDropDownService.GetDropDownDenominationItemAsync(request));
                case EntityNameConstants.MasterCashPointUnsortCc:
                    return ApiSuccess(await masterDropDownService.GetDropDownCashPointUnsortCcItemAsync(request));
                case EntityNameConstants.MasterZoneUnsortCc:
                    return ApiSuccess(await masterDropDownService.GetDropDownZoneUnsortCcItemAsync(request));
                case EntityNameConstants.MasterDenoUnsortCc:
                    return ApiSuccess(await masterDropDownService.GetDropDownDenomenationUnsortCcItemAsync(request));

                default:
                    return ApiDataNotFound($"Table {request.TableName} not found");
            }
        }
    }
}