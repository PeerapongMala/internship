using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2019.Word.Cid;
using DocumentFormat.OpenXml.Vml;
using System.Globalization;

namespace BSS_API.Services
{
    public class MasterCompanyDepartmentService : IMasterCompanyDepartmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterCompanyDepartmentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterCompanyDepartment>> GetAllCompanyDepartment()
        {
            return await _unitOfWork.CompanyDepartmentRepos.GetAllAsync();
        }

        public async Task<MasterCompanyDepartmentViewData> GetCompanyDepartmentById(int Id)
        {
            var result = new MasterCompanyDepartmentViewData();
            var entity = await _unitOfWork.CompanyDepartmentRepos.GetAsync(c => c.ComdeptId == Id);
            if (entity != null)
            {
                result = new MasterCompanyDepartmentViewData()
                {
                    ComdeptId = entity.ComdeptId,
                    CompanyId = entity.CompanyId,
                    DepartmentId = entity.DepartmentId,
                    CbBcdCode = entity.CbBcdCode,
                    StartDate = entity.StartDate,
                    EndDate = entity.EndDate,
                    IsSendUnsortCC = entity.IsSendUnsortCC,
                    IsPrepareCentral = entity.IsPrepareCentral,
                    IsActive = entity.IsActive,
                    CreatedBy = entity.CreatedBy,
                    CreatedDate = entity.CreatedDate,
                    UpdatedBy = entity.UpdatedBy,
                    UpdatedDate = entity.UpdatedDate
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<MasterCompanyDepartmentViewData> GetCompanyDepartmentByDepartmentId(int departmentId)
        {
            var result = new MasterCompanyDepartmentViewData();
            var entity = await _unitOfWork.CompanyDepartmentRepos.GetAsync(c => c.DepartmentId == departmentId && c.IsActive == true);
            if (entity != null)
            {
                result = new MasterCompanyDepartmentViewData()
                {
                    ComdeptId = entity.ComdeptId,
                    CompanyId = entity.CompanyId,
                    DepartmentId = entity.DepartmentId,
                    CbBcdCode = entity.CbBcdCode,
                    StartDate = entity.StartDate,
                    EndDate = entity.EndDate,
                    IsSendUnsortCC = entity.IsSendUnsortCC,
                    IsPrepareCentral = entity.IsPrepareCentral,
                    IsActive = entity.IsActive,
                    CreatedBy = entity.CreatedBy,
                    CreatedDate = entity.CreatedDate,
                    UpdatedBy = entity.UpdatedBy,
                    UpdatedDate = entity.UpdatedDate
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterCompanyDepartment>> GetCompanyDepartmentByUniqueOrKey(int companyId, int departmentId)
        {
            return await _unitOfWork.CompanyDepartmentRepos.GetAllAsync(item => item.CompanyId == companyId && item.DepartmentId == departmentId);
        }

        public async Task CreateCompanyDepartment(CreateCompanyDepartment request)
        {

            var entity_row = await _unitOfWork.CompanyDepartmentRepos.GetAsync(item => item.DepartmentId == request.DepartmentId &&
                                                                                       item.CompanyId == request.CompanyId);

            if (entity_row == null)
            {
                var new_entity = new MasterCompanyDepartment
                {
                    CompanyId = request.CompanyId,
                    DepartmentId = request.DepartmentId,
                    CbBcdCode = request.CbBcdCode,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    IsSendUnsortCC = request.IsSendUnsortCC,
                    IsPrepareCentral = request.IsPrepareCentral,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.CompanyDepartmentRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyDepartmentRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateCompanyDepartment(UpdateCompanyDepartment request)
        {
            var entity_row = await _unitOfWork.CompanyDepartmentRepos.GetAsync(item => item.ComdeptId == request.ComdeptId);

            entity_row.CompanyId = request.CompanyId;
            entity_row.DepartmentId = request.DepartmentId;
            entity_row.CbBcdCode = request.CbBcdCode;
            entity_row.StartDate = request.StartDate;
            entity_row.EndDate = request.EndDate;
            entity_row.IsSendUnsortCC = request.IsSendUnsortCC;
            entity_row.IsPrepareCentral = request.IsPrepareCentral;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();//request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.CompanyDepartmentRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteCompanyDepartment(int id)
        {
            var entity_row = await _unitOfWork.CompanyDepartmentRepos.GetAsync(item => item.ComdeptId == id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyDepartmentRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<UserCompanyDepartmentInfoData> GetCompanyDepartmentInfo(int departmentId)
        {
            var resultData = new UserCompanyDepartmentInfoData();

            var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(d => d.DepartmentId == departmentId);
            if (departmentData != null)
            {
                resultData.DepartmentId = departmentData.DepartmentId;
                resultData.DepartmentCode = departmentData.DepartmentCode;
                resultData.DepartmentName = departmentData.DepartmentName;
                resultData.DepartmentShortName = departmentData.DepartmentShortName;

                var compDeptData = await _unitOfWork.CompanyDepartmentRepos.GetAsync(cd => cd.DepartmentId == departmentId);
                if (compDeptData != null)
                {
                    resultData.CbBcdCode = compDeptData.CbBcdCode;
                    resultData.IsSendUnsortCc = compDeptData.IsSendUnsortCC;
                    resultData.IsPrepareCentral = compDeptData.IsPrepareCentral;
                    resultData.StartDate = compDeptData.StartDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));
                    resultData.EndDate = compDeptData.EndDate.ToString("yyyy-MM-dd", new CultureInfo("en-US"));

                    var companyData = await _unitOfWork.CompanyRepos.GetAsync(c => c.CompanyId == compDeptData.CompanyId);
                    if (companyData != null)
                    {
                        resultData.CompanyId = companyData.CompanyId;
                        resultData.CompanyCode = companyData.CompanyCode;
                        resultData.CompanyName = companyData.CompanyName;
                    }
                }
            }

            return resultData;
        }


        public async Task<PagedData<MasterCompanyDepartmentViewData>> SearchCompanyDepartment(PagedRequest<MasterCompanyDepartmentRequest> request)
        {
            var pageData = await _unitOfWork.CompanyDepartmentRepos.SearchMasterCompanyDepartment(request);
            return pageData.Map(x => new MasterCompanyDepartmentViewData
            {
                ComdeptId = x.ComdeptId,
                CompanyId = x.CompanyId,
                CompanyCode = x.MasterCompany.CompanyCode,
                CompanyName = x.MasterCompany.CompanyName,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName,
                DepartmentShortName = x.MasterDepartment?.DepartmentShortName,
                CbBcdCode = x.CbBcdCode,
                IsPrepareCentral = x.IsPrepareCentral,
                IsSendUnsortCC = x.IsSendUnsortCC,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });

        }

        public Task<string> GetCbBcdCode(int companyId)
        {
            return _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(companyId);
        }

        public Task<string> GetCbBcdCode(int departmentId, int institutionId)
        {
            return _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(departmentId,institutionId);
        }
    }
}
