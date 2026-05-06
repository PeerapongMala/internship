using BSS_API.Core.Constants;

namespace BSS_API.Services
{
    using Interface;
    using Models.Entities;
    using Models.ModelHelper;
    using Models.SearchParameter;
    using BSS_API.Repositories.Interface;
    using BSS_API.Models.ObjectModels;

    public class MasterDropDownService(IUnitOfWork unitOfWork) : IMasterDropDownService
    {
        public async Task<ICollection<DropDownItemResponse<MasterZone>>> GetDropDownZoneItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterZone> masterZones =
                await unitOfWork.ZoneRepos.GetMasterZoneWithSearchRequestAsync(request);

            // Todo ถ้าไม่เจอ zone ให้ return default zone ของ department นั้นๆ คือ zone อื่นๆ ( code 99 )
            if (masterZones.Count == 0)
            {
                if (request.DepartmentId.HasValue)
                {
                    request.SearchCondition.Clear();
                    request.SearchCondition.Add(new SearchCondition
                    {
                        ColumnName = "DepartmentId",
                        FilterOperator = FilterOperatorConstants.EQUAL,
                        FilterValue = request.DepartmentId.Value
                    });
                }
            }

            masterZones = await unitOfWork.ZoneRepos.GetMasterZoneWithSearchRequestAsync(request);
            return masterZones.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterUser> masterUsers =
                await unitOfWork.UserRepos.GetMasterUserWithSearchRequestAsync(request);
            return masterUsers.ToDropDownItem(request.IncludeData);
        }

        // Todo add filter is otp = true
        public async Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserSupervisorItemAsync(
            SystemSearchRequest request)
        {
            List<MasterUserRole> masterUsers =
                await unitOfWork.UserRoleRepos.GetMasterUserRoleWithSearchRequestAsync(request);
            masterUsers.RemoveAll(rm => rm.MasterRoleGroup.MasterRole.All(a => a.IsGetOtpSupervisor == false));
            masterUsers = masterUsers.Take(request.SelectItemCount).ToList();
            return masterUsers.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterUser>>> GetDropDownUserPreparatorItemAsync(
            SystemSearchRequest request)
        {
            List<MasterUserRole> masterUsers =
                await unitOfWork.UserRoleRepos.GetMasterUserRoleWithSearchRequestAsync(request);
            masterUsers.RemoveAll(rm =>
                rm.MasterRoleGroup.MasterRole.All(a => a.RoleCode == BssRoleCodeConstants.OperatorPrepare));
            masterUsers = masterUsers.Take(request.SelectItemCount).ToList();
            return masterUsers.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterConfig>>> GetDropDownConfigItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterConfig> masterConfgis =
                await unitOfWork.ConfigRepos.GetMasterConfigWithSearchRequestAsync(request);
            return masterConfgis.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterMachine>>> GetDropDownMachineItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterMachine> masterMachine =
                await unitOfWork.MachineRepos.GetMasterMachineWithSearchRequestAsync(request);
            return masterMachine.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterCashPoint>>> GetDropDownCashPointItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterCashPoint> masterCashPoint =
                await unitOfWork.CashPointRepos.GetMasterCashPointWithSearchRequestAsync(request);
            return masterCashPoint.ToDropDownItem(request.IncludeData);
        }

        /// <summary>
        /// ทำ zone id ไปหา cashpoint id ในตาราง bss_mst_zone_cashpoint
        /// และนำ cashpoint ที่ทั้งหมดไปหาใน zone
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<ICollection<DropDownItemResponse<MasterCashPoint>>> GetDropDownCashPointWithZoneItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterZoneCashpoint> masterZoneCashPoint = await unitOfWork.ZoneCashpointRepos
                .GetMasterZoneCashpointWithSearchRequestAsync(request);

            if (masterZoneCashPoint.Count > 0)
            {
                SystemSearchRequest cashPointRequest = new SystemSearchRequest
                {
                    TableName = EntityNameConstants.MasterCashPoint,
                    Operator = OperatorConstants.OR,
                    SearchCondition = new List<SearchCondition>()
                };

                foreach (var zoneCashpoint in masterZoneCashPoint)
                {
                    cashPointRequest.SearchCondition.Add(new SearchCondition
                    {
                        ColumnName = "CashpointId",
                        FilterOperator = FilterOperatorConstants.EQUAL,
                        FilterValue = zoneCashpoint.CashpointId
                    });
                }

                ICollection<MasterCashPoint> masterCashPoint =
                    await unitOfWork.CashPointRepos.GetMasterCashPointWithSearchRequestAsync(cashPointRequest);
                return masterCashPoint.ToDropDownItem(request.IncludeData);
            }
            else
            {
                return new List<DropDownItemResponse<MasterCashPoint>>();
            }
        }

        public async Task<ICollection<DropDownItemResponse<MasterInstitution>>> GetDropDownInstitutionItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterInstitution> masterInstitutions =
                await unitOfWork.InstitutionRepos.GetMasterInstitutionWithSearchRequestAsync(request);
            return masterInstitutions.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterInstitution>>>
            GetDropDownInstitutionWithCompanyItemAsync(
                SystemSearchRequest request)
        {
            if (!request.CompanyId.HasValue)
            {
                return new List<DropDownItemResponse<MasterInstitution>>();
            }

            IEnumerable<MasterCompanyInstitution> masterCompanyInstitutions =
                await unitOfWork.CompanyInstitutionRepos.GetAllAsync(w => w.CompanyId == request.CompanyId.Value,
                    tracked: false);

            if (masterCompanyInstitutions != null && masterCompanyInstitutions.Count() > 0)
            {
                SystemSearchRequest institutionRequest = new SystemSearchRequest
                {
                    TableName = EntityNameConstants.MasterInstitution,
                    Operator = OperatorConstants.OR,
                    SearchCondition = new List<SearchCondition>()
                };

                foreach (var masterCompanyInstitution in masterCompanyInstitutions)
                {
                    institutionRequest.SearchCondition.Add(new SearchCondition
                    {
                        ColumnName = "InstitutionId",
                        FilterOperator = FilterOperatorConstants.EQUAL,
                        FilterValue = masterCompanyInstitution.InstId
                    });
                }

                ICollection<MasterInstitution> masterInstitutions =
                    await unitOfWork.InstitutionRepos.GetMasterInstitutionWithSearchRequestAsync(institutionRequest);
                return masterInstitutions.ToDropDownItem(institutionRequest.IncludeData);
            }
            else
            {
                return new List<DropDownItemResponse<MasterInstitution>>();
            }
        }

        public async Task<ICollection<DropDownItemResponse<MasterCashCenter>>> GetDropDownCashCenterItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterCashCenter> masterCashCenters =
                await unitOfWork.CashCenterRepos.GetMasterCashCenterWithSearchRequestAsync(request);
            return masterCashCenters.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterDenomination>>> GetDropDownDenominationItemAsync(
            SystemSearchRequest request)
        {
            ICollection<MasterDenomination> masterDenominations =
                await unitOfWork.DenominationRepos.GetMasterDenominationWithSearchRequestAsync(request);
            return masterDenominations.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterCashPointUnsortCcViewData>>> GetDropDownCashPointUnsortCcItemAsync(SystemSearchRequest request)
        {
            ICollection<MasterCashPointUnsortCcViewData> masterUnsortCcCashPoint =
                await unitOfWork.CashPointRepos.GetMasterCashPointUnsortCcRequestAsync(request);

            return masterUnsortCcCashPoint.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterZoneUnsortCcViewData>>> GetDropDownZoneUnsortCcItemAsync(SystemSearchRequest request)
        {
            ICollection<MasterZoneUnsortCcViewData> masterUnsortCcZone =
                await unitOfWork.ZoneRepos.GetMasterZoneUnsortCcRequestAsync(request);

            return masterUnsortCcZone.ToDropDownItem(request.IncludeData);
        }

        public async Task<ICollection<DropDownItemResponse<MasterDenoUnsortCcViewData>>> GetDropDownDenomenationUnsortCcItemAsync(SystemSearchRequest request)
        {
            ICollection<MasterDenoUnsortCcViewData> masterUnsortCcDenomination =
                await unitOfWork.DenominationRepos.GetDenominationUnsortCcRequestAsync(request);

            return masterUnsortCcDenomination.ToDropDownItem(request.IncludeData);
        }
    }
}