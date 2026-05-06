using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterMSevenOutputService : IMasterMSevenOutputService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterMSevenOutputService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateMSevenOutput(CreateMSevenOutputRequest request)
        {
           
                var entity_row = await _unitOfWork.MSevenOutputRepos.GetAsync(item => item.MSevenOutputCode == request.MSevenOutputCode.Trim());
                if (entity_row == null)
                {
                     var new_entity = new MasterMSevenOutput
                     {
                         MSevenOutputCode = request.MSevenOutputCode.Trim(),
                         MSevenOutputDescrpt = request.MSevenOutputDescrpt != null ? request.MSevenOutputDescrpt.Trim() : string.Empty,
                         IsActive = request.IsActive,
                         CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                         CreatedDate = DateTime.Now
                     };

                    await _unitOfWork.MSevenOutputRepos.AddAsync(new_entity);
                }
                else
                {
                    entity_row.IsActive = true;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.MSevenOutputRepos.Update(entity_row);
                }

                await _unitOfWork.SaveChangeAsync();
          
        }

        public async Task DeleteMSevenOutput(int Id)
        {
               var entity_row = await _unitOfWork.MSevenOutputRepos.GetAsync(item => item.MSevenOutputId == Id);

                if (entity_row != null)
                {
                entity_row.IsActive = false;
                    _unitOfWork.MSevenOutputRepos.Update(entity_row);
                    await _unitOfWork.SaveChangeAsync();
                }
            
        }

        public async Task<IEnumerable<MasterMSevenOutput>> GetAllMSevenOutput()
        {

            return await _unitOfWork.MSevenOutputRepos.GetAllAsync();

        }
        public async Task<IEnumerable<MasterMSevenOutput>> GetMSevenOutputByUniqueOrKey(string mSevenOutputCode)
        {
            return await _unitOfWork.MSevenOutputRepos.GetAllAsync(item => item.MSevenOutputCode == mSevenOutputCode);
        }

        public async Task<MasterMSevenOutput> GetMSevenOutputById(int Id)
        {
            
                var result = new MasterMSevenOutput();

                var queryData = await _unitOfWork.MSevenOutputRepos.GetAsync(item => item.MSevenOutputId == Id);
                if (queryData != null)
                {
                    result = new MasterMSevenOutput()
                    {
                        MSevenOutputId = queryData.MSevenOutputId,
                        MSevenOutputCode = queryData.MSevenOutputCode,
                        MSevenOutputDescrpt = queryData.MSevenOutputDescrpt,
                        IsActive = queryData.IsActive,
                        CreatedBy = queryData.CreatedBy,
                        CreatedDate = queryData.CreatedDate,
                        UpdatedBy = queryData.UpdatedBy,
                        UpdatedDate = queryData.UpdatedDate
                    };
                }
                else
                {
                    result = null;
                }

                return result;

           
        }

        public async Task UpdateMSevenOutput(UpdateMSevenOutputRequest request)
        {
            var row_entity = await _unitOfWork.MSevenOutputRepos.GetAsync(item => item.MSevenOutputId == request.MSevenOutputId);

            row_entity.MSevenOutputCode = request.MSevenOutputCode.Trim();
            row_entity.MSevenOutputDescrpt = request.MSevenOutputDescrpt != null ? request.MSevenOutputDescrpt.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.MSevenOutputRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        public async Task<PagedData<MasterMSevenOutput>> SearchMSevenOutput(PagedRequest<MasterMSevenOutputRequest> request)
        {
            var pageData = await _unitOfWork.MSevenOutputRepos.SearchMasterMSevenOutput(request);
            return pageData;
        }
    }
}
