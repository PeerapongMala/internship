using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;

namespace BSS_API.Services
{
    public class MasterCashCenterService : IMasterCashCenterService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterCashCenterService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCashCenter(CreateCashCenterRequest request)
        {
           
                var entity_row = await _unitOfWork.CashCenterRepos.GetAsync(item => item.CashCenterCode == request.CashCenterCode.Trim() &&
                                                                         item.InstitutionId == request.InstitutionId
                                                                        );

                if (entity_row == null)
                {
                    var new_entity = new MasterCashCenter
                    {
                        InstitutionId = request.InstitutionId,
                        DepartmentId = request.DepartmentId,
                        CashCenterCode = request.CashCenterCode.Trim(),
                        CashCenterName = request.CashCenterName.Trim(),
                        IsActive = request.IsActive,
                        CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };
                    await _unitOfWork.CashCenterRepos.AddAsync(new_entity);
                }
                else
                {
                    entity_row.IsActive = true;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.CashCenterRepos.Update(entity_row);
                }

            await _unitOfWork.SaveChangeAsync();
          
        }

        public async Task DeleteCashCenter(int Id)
        {
                var entity_row = await _unitOfWork.CashCenterRepos.GetAsync(item => item.CashCenterId == Id);

                if (entity_row != null)
                {
                    entity_row.IsActive = false;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.CashCenterRepos.Update(entity_row);
                     await _unitOfWork.SaveChangeAsync();
                }
        }

        public async Task<IEnumerable<MasterCashCenter>> GetAllCashCenter()
        {
            
            return await _unitOfWork.CashCenterRepos.GetAllAsync();
            
        }

        public async Task<IEnumerable<MasterCashCenter>> GetCashCenterByUniqueOrKey(string cashCenterCode)
        {
            return await _unitOfWork.CashCenterRepos.GetAllAsync(item => item.CashCenterCode == cashCenterCode);
        }

        public async Task<IEnumerable<MasterCashCenterViewData>> GetCashCenterByFilter(CashCenterFilterRequest filter)
        {
            
                var cashCenterLists = (from cc in await _unitOfWork.CashCenterRepos.GetAllAsync()
                                       join dm in await _unitOfWork.DepartmentRepos.GetAllAsync() on cc.DepartmentId equals dm.DepartmentId into departmentJoin
                                       join ins in await _unitOfWork.InstitutionRepos.GetAllAsync() on cc.InstitutionId equals ins.InstitutionId into institutionJoin
                                       from dm in departmentJoin.DefaultIfEmpty()
                                       from ins in institutionJoin.DefaultIfEmpty()
                                       select new MasterCashCenterViewData
                                       {
                                           CashCenterId = cc.CashCenterId,
                                           DepartmentId = dm.DepartmentId,
                                           DepartmentName = dm.DepartmentName,
                                           InstitutionId = ins.InstitutionId,
                                           InstitutionNameTh = ins.InstitutionNameTh,
                                           InstitutionNameEn = ins.InstitutionNameEn,
                                           CashCenterCode = cc.CashCenterCode,
                                           CashCenterName = cc.CashCenterName,
                                           IsActive = cc.IsActive,
                                           CreatedBy = cc.CreatedBy,
                                           CreatedDate = cc.CreatedDate,
                                           UpdatedBy = cc.UpdatedBy,
                                           UpdatedDate = cc.UpdatedDate

                                       }).ToList();


            if (!string.IsNullOrEmpty(filter.DepartmentFilter) || !string.IsNullOrEmpty(filter.InstitutionFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
                {
                    if (!string.IsNullOrEmpty(filter.InstitutionFilter))
                    {
                        cashCenterLists = cashCenterLists.Where(x => x.InstitutionId == filter.InstitutionFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(filter.DepartmentFilter))
                    {
                        cashCenterLists = cashCenterLists.Where(x => x.DepartmentId == filter.DepartmentFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(filter.StatusFilter))
                    {
                        cashCenterLists = cashCenterLists.Where(x => x.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
                    }

                }
                return cashCenterLists;
           
        }
        
        public async Task<MasterCashCenterViewData> GetCashCenterById(int Id)
        {
           
            var result = new MasterCashCenterViewData();

            var cashcenterData = await _unitOfWork.CashCenterRepos.GetAsync(item => item.CashCenterId == Id);
            if (cashcenterData != null)
            {

                result.CashCenterId = cashcenterData.CashCenterId;
                result.CashCenterCode = cashcenterData.CashCenterCode;
                result.CashCenterName = cashcenterData.CashCenterName;
                result.IsActive = cashcenterData.IsActive;
                result.CreatedBy = cashcenterData.CreatedBy;
                result.CreatedDate = cashcenterData.CreatedDate;
                result.UpdatedBy = cashcenterData.UpdatedBy;
                result.UpdatedDate = cashcenterData.UpdatedDate;

                var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(dm => dm.DepartmentId == cashcenterData.DepartmentId);
                result.DepartmentId = departmentData.DepartmentId;
                result.DepartmentName = departmentData.DepartmentName;

                var institutionData = await _unitOfWork.InstitutionRepos.GetAsync(ins => ins.InstitutionId == cashcenterData.InstitutionId);
                result.InstitutionId = institutionData.InstitutionId;
                result.InstitutionNameTh = institutionData.InstitutionNameTh;
                result.InstitutionNameEn = institutionData.InstitutionNameEn;
            }
            else
            {
                result = null;
            }

                return result;
        }

        public async Task UpdateCashCenter(UpdateCashCenterRequest request)
        {

            var row_entity = await _unitOfWork.CashCenterRepos.GetAsync(item => item.CashCenterId == request.CashCenterId);
            
            row_entity.DepartmentId = request.DepartmentId;
            row_entity.InstitutionId = request.InstitutionId;
            row_entity.CashCenterCode = request.CashCenterCode.Trim();
            row_entity.CashCenterName = request.CashCenterName.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();//request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.CashCenterRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        public async Task<PagedData<MasterCashCenterViewData>> SearchCashCenter(PagedRequest<MasterCashCenterRequest> request)
        {
            var pageData = await _unitOfWork.CashCenterRepos.SearchCashCenter(request);
            return pageData.Map(x => new MasterCashCenterViewData
            {
                CashCenterId = x.CashCenterId,
                CashCenterCode = x.CashCenterCode,
                CashCenterName = x.CashCenterName,
                DepartmentId=x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName, 
                InstitutionId=x.InstitutionId,
                InstitutionNameEn = x.MasterInstitution?.InstitutionNameEn,
                InstitutionNameTh = x.MasterInstitution?.InstitutionNameTh,

                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
