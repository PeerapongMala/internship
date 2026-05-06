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
    public class MasterSeriesDenomService : IMasterSeriesDenomService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterSeriesDenomService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterSeriesDenom>> GetAllSeriesDenom()
        {
            return await _unitOfWork.SeriesDenomRepos.GetAllAsync();
        }

        public async Task<MasterSeriesDenomViewData> GetMasterSeriesDenomById(int Id)
        {
            var result = new MasterSeriesDenomViewData();
            var entity = await _unitOfWork.SeriesDenomRepos.GetAsync(item => item.SeriesDenomId == Id);
            if (entity != null)
            {
                result = new MasterSeriesDenomViewData()
                {
                    SeriesDenomId = entity.SeriesDenomId,
                    SeriesCode = entity.SeriesCode,
                    SerieDescrpt = entity.SerieDescrpt,
                    IsActive = entity.IsActive,
                    CreatedBy = entity.CreatedBy,
                    CreatedDate = entity.CreatedDate,
                    UpdatedBy = entity.UpdatedBy,
                    UpdatedDate = entity.UpdatedDate
                };
            }
            else
            {
                return null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterSeriesDenom>> GetSeriesDenomByUniqueOrKey(string seriesCode)
        {
            return await _unitOfWork.SeriesDenomRepos.GetAllAsync(item => item.SeriesCode == seriesCode.Trim());
        }

        public async Task CreateSeriesDenom(CreateSeriesDenom requst)
        {
            var row_entity = await _unitOfWork.SeriesDenomRepos.GetAsync(item => item.SeriesCode == requst.SeriesCode.Trim());
            if (row_entity == null)
            {
                var new_entity = new MasterSeriesDenom
                {
                    SeriesCode = requst.SeriesCode.Trim(),
                    SerieDescrpt = requst.SerieDescrpt.Trim(),
                    IsActive = requst.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//requst.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.SeriesDenomRepos.AddAsync(new_entity);
            }
            else
            {
                row_entity.IsActive = true;
                row_entity.UpdatedBy = RequestContextHelper.GetUserId();
                row_entity.UpdatedDate = DateTime.Now;

                _unitOfWork.SeriesDenomRepos.Update(row_entity);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateSeriesDenom(UpdateSeriesDenom request)
        {
            var entity_row = await _unitOfWork.SeriesDenomRepos.GetAsync(item => item.SeriesDenomId == request.SeriesDenomId);

            entity_row.SeriesCode = request.SeriesCode.Trim();
            entity_row.SerieDescrpt = request.SerieDescrpt.Trim();
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.SeriesDenomRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteSeriesDenom(int Id)
        {
            var entity_row = await _unitOfWork.SeriesDenomRepos.GetAsync(item => item.SeriesDenomId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.SeriesDenomRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterSeriesDenom>> SearchSeriesDenom(PagedRequest<MasterSeriesDenomRequest> request)
        {
            var pageData = await _unitOfWork.SeriesDenomRepos.SearchMasterSeriesDenom(request);
            return pageData;
        }
    }
}
