using BSS_API.Core.CustomException;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace BSS_API.Services
{
    public class MasterCashPointService : IMasterCashPointService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterCashPointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCashPoint(CreateCashPointRequest request)
        {
            string cbBcdCode = await _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(request.DepartmentId, request.InstitutionId);
            if (string.IsNullOrEmpty(request.CbBcdCode) || request.CbBcdCode != cbBcdCode)
            {
                throw new BusinessException($"รหัสสัญญา:{request.CbBcdCode} ไม่ถูกต้อง");
            }

            //from requirement UQ key เป็น ( inst_id,branch_code,cb_bcd_code) 
            MasterCashPoint? entity_row = await _unitOfWork.CashPointRepos.GetAsync(item => item.InstitutionId == request.InstitutionId                                                                
                                                                && item.BranchCode == request.BranchCode
                                                                 && item.CbBcdCode == request.CbBcdCode
                                                                ); 
            if (entity_row == null)
            {
                var new_entity = new MasterCashPoint
                {
                    InstitutionId = request.InstitutionId,
                    DepartmentId = request.DepartmentId,
                    CashpointName = request.CashpointName != null ? request.CashpointName.Trim() : string.Empty,
                    BranchCode = request.BranchCode.Trim(),
                    CbBcdCode=request.CbBcdCode,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                await _unitOfWork.CashPointRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CashPointRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
           
        }

        public async Task DeleteCashPoint(int Id)
        {

            var entity_row = await _unitOfWork.CashPointRepos.GetAsync(item => item.CashpointId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CashPointRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }

        }

        public async Task<IEnumerable<MasterCashPoint>> GetAllCashPoint()
        {

            return await _unitOfWork.CashPointRepos.GetAllAsync();

        }

        public async Task<IEnumerable<MasterCashPoint>> GetCashPointByUniqueOrKey(string branchCode, int institutionId, string cbBcdCode)
        {
            return await _unitOfWork.CashPointRepos.GetAllAsync(item => item.BranchCode == branchCode && item.InstitutionId == institutionId && item.CbBcdCode ==cbBcdCode);
        }

        public async Task<IEnumerable<MasterCashPointViewData>> GetCashPointByFilter(CashPointFilterRequest request)
        {
            
            throw new NotImplementedException();
            //Fix this or remove if not use
            /*
            var cashPointLists = (from cp in await _unitOfWork.CashPointRepos.GetAllAsync()
                                   join dm in await _unitOfWork.DepartmentRepos.GetAllAsync() on cp.DepartmentId equals dm.DepartmentId into departmentJoin
                                   join ins in await _unitOfWork.InstitutionRepos.GetAllAsync() on cp.InstitutionId equals ins.InstitutionId into institutionJoin
                                   from dm in departmentJoin.DefaultIfEmpty()
                                   from ins in institutionJoin.DefaultIfEmpty()
                                   select new MasterCashPointViewData
                                   {
                                       CashpointId = cp.CashpointId,
                                       DepartmentId = dm.DepartmentId,
                                       DepartmentName = dm.DepartmentName,
                                       InstitutionId = ins.InstitutionId,
                                       InstitutionNameTh = ins.InstitutionNameTh,
                                       InstitutionNameEn = ins.InstitutionNameEn,
                                       CashpointName = cp.CashpointName,
                                       BranchCode = cp.BranchCode,
                                       CbBcdCode = cp.CbBcdCode,
                                       IsActive = cp.IsActive,
                                       CreatedBy = cp.CreatedBy,
                                       CreatedDate = cp.CreatedDate,
                                       UpdatedBy = cp.UpdatedBy,
                                       UpdatedDate = cp.UpdatedDate

                                   }).ToList();

                if (!string.IsNullOrEmpty(request.DepartmentFilter) || !string.IsNullOrEmpty(request.InstitutionFilter) || !string.IsNullOrEmpty(request.StatusFilter))
                {
                    if (!string.IsNullOrEmpty(request.InstitutionFilter))
                    {
                        cashPointLists = cashPointLists.Where(x => x.InstitutionId == request.InstitutionFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(request.DepartmentFilter))
                    {
                        cashPointLists = cashPointLists.Where(x => x.DepartmentId == request.DepartmentFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(request.StatusFilter))
                    {
                        cashPointLists = cashPointLists.Where(x => x.IsActive == (request.StatusFilter == "1" ? true : false)).ToList();
                    }

                }
                return cashPointLists;
           */
        }

        public async Task<MasterCashPointViewData> GetCashPointById(int Id)
        {

            var result = new MasterCashPointViewData();

            var cashPointData = await _unitOfWork.CashPointRepos.GetAsync(cp => cp.CashpointId == Id);
            if (cashPointData != null)
            {
                
                result.CashpointId = cashPointData.CashpointId;
                result.CashpointName = cashPointData.CashpointName;
                result.BranchCode = cashPointData.BranchCode;
                result.IsActive = cashPointData.IsActive;
                result.CreatedBy = cashPointData.CreatedBy;
                result.CreatedDate = cashPointData.CreatedDate;
                result.UpdatedBy = cashPointData.UpdatedBy;
                result.UpdatedDate = cashPointData.UpdatedDate;

                var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(dm => dm.DepartmentId == cashPointData.DepartmentId);
                result.DepartmentId = departmentData.DepartmentId;
                result.DepartmentName = departmentData.DepartmentName;

                var institutionData = await _unitOfWork.InstitutionRepos.GetAsync(ins => ins.InstitutionId == cashPointData.InstitutionId);
                result.InstitutionId = institutionData.InstitutionId;
                result.InstitutionNameTh = institutionData.InstitutionNameTh;
                result.InstitutionNameEn = institutionData.InstitutionNameEn;

                result.CbBcdCode = cashPointData.CbBcdCode;
            }
            else
            {
                result = null;
            }

            return result;

        }

        public async Task UpdateCashPoint(UpdateCashPointRequest request)
        {
            var entity_row = await _unitOfWork.CashPointRepos.GetAsync(item => item.CashpointId == request.CashpointId);

            entity_row.InstitutionId = request.InstitutionId;
            entity_row.DepartmentId = request.DepartmentId;
            entity_row.CashpointName = request.CashpointName != null ? request.CashpointName.Trim() : string.Empty;
            entity_row.BranchCode = request.BranchCode.Trim();
            //CbBcdCode is not updateable
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();//request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;


            _unitOfWork.CashPointRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
            
        }

        public async Task<PagedData<MasterCashPointViewData>> SearchCashPoint(PagedRequest<MasterCashPointRequest> request)
        {
            var pageData = await _unitOfWork.CashPointRepos.SearchMasterCashPoint(request);
            return pageData.Map(x => new MasterCashPointViewData
            {
                CashpointId = x.CashpointId,  
                CashpointName = x.CashpointName,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName,
                InstitutionId = x.InstitutionId,
                InstitutionNameEn = x.MasterInstitution?.InstitutionNameEn,
                InstitutionNameTh = x.MasterInstitution?.InstitutionNameTh,
                BranchCode=x.BranchCode,
                CbBcdCode = x.CbBcdCode,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
