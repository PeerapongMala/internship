using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterDenomReconcileService : IMasterDenomReconcileService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterDenomReconcileService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task CreateDenomReconcile(CreateDenomReconcileRequest request)
        {
            
                var entity_row = await _unitOfWork.DenomReconcileRepos.GetAsync(item => item.DenoId == request.DenoId &&
                                                                     item.DepartmentId == request.DepartmentId &&
                                                                     item.SeriesDenomId == request.SeriesDenomId);
                if (entity_row == null)
                {
                    
                    //var maxSeq = _unitOfWork.DenomReconcileRepos.GetAll().Max(p => p.SeqNo);
                    
                    var new_entity = new MasterDenomReconcile
                    {
                        DenoId = request.DenoId,
                        DepartmentId = request.DepartmentId,
                        SeriesDenomId = request.SeriesDenomId, 
                        IsDefault = request.IsDefault,
                        IsDisplay = request.IsDisplay,
                        IsActive = request.IsActive,
                        CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                        CreatedDate = DateTime.Now,
                        SeqNo = request.SeqNo
                        //SeqNo = (maxSeq ?? 0) + 1 
                    };
                     await _unitOfWork.DenomReconcileRepos.AddAsync(new_entity);
                }
                else
                {
                    entity_row.IsActive = true;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.DenomReconcileRepos.Update(entity_row);
                }

            await  _unitOfWork.SaveChangeAsync();
           
        }

        public async Task DeleteDenomReconcile(int Id)
        {

            var entity_row = await _unitOfWork.DenomReconcileRepos.GetAsync(item => item.DenomReconcileId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.DenomReconcileRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }

        }

        
        public async Task<IEnumerable<MasterDenomReconcile>> GetAllDenomReconcile()
        {

           return await _unitOfWork.DenomReconcileRepos.GetAllAsync();
            
        } 

        public async Task<IEnumerable<MasterDenomReconcile>> GetDenomReconcileByUniqueOrKey(int denoId, int departmentId,int seriesDenomId)
        {
            return await _unitOfWork.DenomReconcileRepos.GetAllAsync(item => item.DenoId == denoId && item.DepartmentId == departmentId && item.SeriesDenomId == seriesDenomId);
        }

        public async Task<MasterDenomReconcileViewData> GetDenomReconcileById(int Id)
        {
           
                var result = new MasterDenomReconcileViewData();

                var denomRecData = await _unitOfWork.DenomReconcileRepos.GetAsync(dr => dr.DenomReconcileId == Id);
                if (denomRecData != null)
                {
                   
                        result.DenomReconcileId = denomRecData.DenomReconcileId;
                        result.SeqNo = denomRecData.SeqNo;
                        result.IsDefault = denomRecData.IsDefault;
                        result.IsDisplay = denomRecData.IsDisplay;
                        result.IsActive = denomRecData.IsActive;
                        result.CreatedBy = denomRecData.CreatedBy;
                        result.CreatedDate = denomRecData.CreatedDate;
                        result.UpdatedBy = denomRecData.UpdatedBy;
                        result.UpdatedDate = denomRecData.UpdatedDate;

                    var denominationData = await _unitOfWork.DenominationRepos.GetAsync(dt => dt.DenominationId == denomRecData.DenoId);
                     result.DenoId = denominationData.DenominationId;
                     result.DenominationDesc = denominationData.DenominationDesc;

                     var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(dm => dm.DepartmentId == denomRecData.DepartmentId);
                     result.DepartmentId = departmentData.DepartmentId;
                     result.DepartmentName = departmentData.DepartmentName;

                     var seriesDenomData = await _unitOfWork.SeriesDenomRepos.GetAsync(sd => sd.SeriesDenomId == denomRecData.SeriesDenomId);
                     result.SeriesDenomId = seriesDenomData.SeriesDenomId;
                     result.SerieDescrpt = seriesDenomData.SerieDescrpt;
            }
                else
                {
                    result = null;
                }

                return result;

        }

        public async Task UpdateDenomReconcile(UpdateDenomReconcileRequest request)
        {
            var row_entity = await _unitOfWork.DenomReconcileRepos.GetAsync(item => item.DenomReconcileId == request.DenomReconcileId);

            row_entity.DenoId = request.DenoId;
            row_entity.DepartmentId = request.DepartmentId;
            row_entity.SeriesDenomId = request.SeriesDenomId;
            row_entity.SeqNo = request.SeqNo;
            row_entity.IsDefault = request.IsDefault;
            row_entity.IsDisplay = request.IsDisplay;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.DenomReconcileRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        /*
        public async Task<IEnumerable<MasterDenomReconcileViewData>> GetDenomReconcileByFilter(DenomReconcileFilterRequest request)
        {

            var denomReconcileLists = (from dr in await _unitOfWork.DenomReconcileRepos.GetAllAsync()
                                  join d in await _unitOfWork.DenominationRepos.GetAllAsync() on dr.DenoId equals d.DenominationId into denominationJoin
                                  join dm in await _unitOfWork.DepartmentRepos.GetAllAsync() on dr.DepartmentId equals dm.DepartmentId into departmentJoin
                                       join sd in await _unitOfWork.SeriesDenomRepos.GetAllAsync() on dr.SeriesDenomId equals sd.SeriesDenomId into seriesDenomJoin
                                       from d in denominationJoin.DefaultIfEmpty()
                                       from dm in departmentJoin.DefaultIfEmpty()
                                       from sd in seriesDenomJoin.DefaultIfEmpty()
                                  select new MasterDenomReconcileViewData
                                  {
                                      DenoId = d.DenominationId,
                                      DenominationDesc = d.DenominationDesc,
                                      DepartmentId = dm.DepartmentId,
                                      DepartmentName = dm.DepartmentName,
                                      SeriesDenomId = sd.SeriesDenomId,
                                      SerieDescrpt = sd.SerieDescrpt,
                                      SeqNo = dr.SeqNo,
                                      IsDefault = dr.IsDefault,
                                      IsDisplay = dr.IsDisplay,
                                      IsActive = dr.IsActive,
                                      CreatedBy = dr.CreatedBy,
                                      CreatedDate = dr.CreatedDate,
                                      UpdatedBy = dr.UpdatedBy,
                                      UpdatedDate = dr.UpdatedDate
                                  }).ToList();


                if (!string.IsNullOrEmpty(request.DepartmentFilter) || !string.IsNullOrEmpty(request.DenominationFilter) || !string.IsNullOrEmpty(request.StatusFilter))
                {
                    if (!string.IsNullOrEmpty(request.DenominationFilter))
                    {
                        denomReconcileLists = denomReconcileLists.Where(x => x.DenoId == request.DenominationFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(request.DepartmentFilter))
                    {
                        denomReconcileLists = denomReconcileLists.Where(x => x.DepartmentId == request.DepartmentFilter.AsInt()).ToList();
                    }

                    if (!string.IsNullOrEmpty(request.StatusFilter))
                    {
                        denomReconcileLists = denomReconcileLists.Where(x => x.IsActive == (request.StatusFilter == "1" ? true : false)).ToList();
                    }

                }
                return denomReconcileLists;
            
        }
        */
        public async Task<PagedData<MasterDenomReconcileViewData>> SearchDenomReconcile(PagedRequest<MasterDenomReconcileRequest> request)
        {
            var pageData = await _unitOfWork.DenomReconcileRepos.SearchMasterDenomReconcile(request);
            return pageData.Map(x => new MasterDenomReconcileViewData
            {
                DenomReconcileId = x.DenomReconcileId,
                DenoId = x.DenoId,
                DenominationCode = x.MasterDenomination.DenominationCode,
                DenominationDesc = x.MasterDenomination.DenominationDesc,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName,
                SeriesCode = x.MasterSeriesDenom?.SeriesCode,
                SerieDescrpt = x.MasterSeriesDenom?.SerieDescrpt,
                SeqNo = x.SeqNo,
                IsDefault= x.IsDefault,
                IsDisplay = x.IsDisplay,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
