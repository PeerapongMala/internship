using Azure.Core;
using BSS_API.Core.CustomException;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using System.Text.RegularExpressions;

namespace BSS_API.Services
{
    public class MasterZoneService : IMasterZoneService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterZoneService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterZone>> GetAllZone()
        {
            return await _unitOfWork.ZoneRepos.GetAllAsync();
        }

        public async Task<MasterZoneViewData> GetMasterZoneById(int Id)
        {
            var result = new MasterZoneViewData();
            var entity = await _unitOfWork.ZoneRepos.GetAsync(item => item.ZoneId == Id);
            if (entity != null)
            {
                result = new MasterZoneViewData
                {
                    ZoneId = entity.ZoneId,
                    DepartmentId = entity.DepartmentId,
                    InstId = entity.InstId,
                    ZoneCode = entity.ZoneCode,
                    ZoneName = entity.ZoneName,
                    CbBcdCode = entity.CbBcdCode,
                    IsActive = entity.IsActive,
                    CreatedBy = entity.CreatedBy,
                    CreatedDate = entity.CreatedDate,
                    UpdatedBy = entity.UpdatedBy,
                    UpdatedDate = entity.UpdatedDate,
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterZoneViewData>> GetZoneByFilter(ZoneFilterRequest filter)
        {
            var query = (await _unitOfWork.ZoneRepos.GetAllAsync()).AsQueryable();

            if (!string.IsNullOrEmpty(filter.departmentFilter))
            {
                int departmentId = filter.departmentFilter.AsInt();
                query = query.Where(x => x.DepartmentId == departmentId);
            }

            if (!string.IsNullOrEmpty(filter.instFilter))
            {
                int instId = filter.instFilter.AsInt();
                query = query.Where(x => x.InstId == instId);
            }

            if (!string.IsNullOrEmpty(filter.StatusFilter))
            {
                bool isActive = filter.StatusFilter == "1";
                query = query.Where(x => x.IsActive == isActive);
            }

            var resultData = query.ToList();

            var result = resultData.Select(item => new MasterZoneViewData
            {
                ZoneId = item.ZoneId,
                DepartmentId = item.DepartmentId,
                InstId = item.InstId,
                ZoneCode = item.ZoneCode,
                ZoneName = item.ZoneName,
                CbBcdCode = item.CbBcdCode,
                IsActive = item.IsActive,
                CreatedBy = item.CreatedBy,
                CreatedDate = item.CreatedDate,
                UpdatedBy = item.UpdatedBy,
                UpdatedDate = item.UpdatedDate
            });

            return result;
        }


        public async Task<IEnumerable<MasterZone>> GetZoneByUniqueOrKey(string zoneCode, int departmentId, int? instId)
        {
            return await _unitOfWork.ZoneRepos.GetAllAsync(item => item.ZoneCode == zoneCode && item.DepartmentId == departmentId && (item.InstId == instId || instId == null));
        }

        public async Task CreateZone(CreateMasterZoneRequest request)
        {

            ValidateZoneCode(request.ZoneCode);
            await ValidateCbBcdCode(request.CbBcdCode, request.DepartmentId, request.InstId ?? 0);

            var entity_row = await _unitOfWork.ZoneRepos.GetAsync(item => item.DepartmentId == request.DepartmentId &&
                                                          (item.InstId == request.InstId) &&
                                                          item.ZoneCode == request.ZoneCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterZone
                {
                    DepartmentId = request.DepartmentId,
                    InstId = request.InstId,
                    ZoneCode = request.ZoneCode.Trim(),
                    ZoneName = request.ZoneName.Trim(),
                    CbBcdCode = request.CbBcdCode,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.ZoneRepos.AddAsync(new_entity);
            }
            else
            {
              
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.ZoneRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        private void ValidateZoneCode(string zoneCode) {
            // Validate ZoneCode 01–99
            if (!Regex.IsMatch(zoneCode, @"^(0[1-9]|[1-9][0-9])$"))
            {
                throw new BusinessException($"ZoneCode ต้องเป็นตัวเลข 01 ถึง 99 เท่านั้น");
            }
        }

        private async Task  ValidateCbBcdCode(string cbBcdCode,int departmentId,int institutionId)
        {
            if (string.IsNullOrEmpty(cbBcdCode)){
                throw new BusinessException("โปรดระบุรหัสสัญญา");
            }
            string validCode = await _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(departmentId,institutionId);
            if (cbBcdCode != validCode)
            {
                throw new BusinessException($"รหัสสัญญา:{cbBcdCode} ไม่ถูกต้อง");
            }
        }
        public async Task UpdateZone(UpdateMasterZoneRequest request)
        {
            ValidateZoneCode(request.ZoneCode);

            var row_entity = await _unitOfWork.ZoneRepos.GetAsync(item => item.ZoneId == request.ZoneId);
            //row_entity.DepartmentId = request.DepartmentId;
            //row_entity.InstId = request.InstId;
            //row_entity.ZoneCode = request.ZoneCode.Trim();
            row_entity.ZoneName = request.ZoneName.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.ZoneRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteZone(int Id)
        {
            var row_entity = await _unitOfWork.ZoneRepos.GetAsync(item => item.ZoneId == Id);

            if (row_entity != null)
            {
                row_entity.IsActive = false;
                row_entity.UpdatedBy = RequestContextHelper.GetUserId();
                row_entity.UpdatedDate = DateTime.Now;
                _unitOfWork.ZoneRepos.Update(row_entity);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterZoneViewData>> SearchZone(PagedRequest<MasterZoneRequest> request)
        {
            var pageData = await _unitOfWork.ZoneRepos.SearchMasterZone(request);
            return pageData.Map(x => new MasterZoneViewData
            {
                ZoneId = x.ZoneId,
                ZoneCode = x.ZoneCode,
                ZoneName = x.ZoneName,
                DepartmentId= x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName,
                InstId = x.InstId,
                InstitutionNameEn = x.MasterInstitution?.InstitutionNameEn,
                InstitutionNameTh = x.MasterInstitution?.InstitutionNameTh, 
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
