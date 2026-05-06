using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office.CustomUI;

namespace BSS_API.Services
{
    public class TransactionContainerPrepareService : ITransactionContainerPrepareService
    {
        private readonly IUnitOfWork _unitOfWork;
        public TransactionContainerPrepareService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TransactionContainerPrepare>> GetAllContainerPrepare()
        {
            return await _unitOfWork.TransactionContainerPrepareRepos.GetAllAsync();
        }

        public async Task<TransactionContainerPrepareViewData> GetContainerPrepareById(long Id)
        {
            var result = new TransactionContainerPrepareViewData();
            var entity = await _unitOfWork.TransactionContainerPrepareRepos.GetAsync(item => item.ContainerPrepareId == Id);
            if (entity != null)
            {
                result = new TransactionContainerPrepareViewData
                {
                    ContainerPrepareId = entity.ContainerPrepareId,
                    DepartmentId = entity.DepartmentId,
                    MachineId = entity.MachineId,
                    ContainerCode = entity.ContainerCode,
                    BntypeId = entity.BntypeId,
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

        public async Task CreateContainerPrepare(CreateTransactionContainerPrepareRequest request)
        {
            
                var new_entity = new TransactionContainerPrepare
                {
                    DepartmentId = request.DepartmentId,
                    MachineId = request.MachineId,
                    ContainerCode = request.ContainerCode.Trim(),
                    ReceiveId = request.ReceiveId,
                    // RegisterUnsortId = request.RegisterUnsortId,
                    BntypeId = request.BntypeId,
                    CreatedBy = request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.TransactionContainerPrepareRepos.AddAsync(new_entity);
           

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateContainerPrepare(UpdateTransactionContainerPrepareRequest request)
        {

            var entity_row = await _unitOfWork.TransactionContainerPrepareRepos.GetAsync(item => item.ContainerPrepareId == request.ContainerPrepareId);
            entity_row.DepartmentId = request.DepartmentId;
            entity_row.MachineId = request.MachineId;
            entity_row.ContainerCode = request.ContainerCode.Trim();
            entity_row.ReceiveId = request.ReceiveId;
            // entity_row.RegisterUnsortId = request.RegisterUnsortId;
            entity_row.BntypeId = request.BntypeId;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.TransactionContainerPrepareRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteContainerPrepare(long Id)
        {
            var entity_row = await _unitOfWork.TransactionContainerPrepareRepos.GetAsync(item => item.ContainerPrepareId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                _unitOfWork.TransactionContainerPrepareRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<TransactionContainerPrepare>> GetContainerPrepareByUniqueOrKey(string containerCode)
        {
            return await _unitOfWork.TransactionContainerPrepareRepos.GetAllAsync(item => item.ContainerCode == containerCode);
        }

        public async Task<IEnumerable<TransactionContainerPrepareViewDisplay>> GetAllContainerPrepareAsync(int department)
        {
            return await _unitOfWork.TransactionContainerPrepareRepos.GetAllContainerPrepareAsync(department);
        }

        public async Task<TransactionContainerPrepare> GetContainerPrepareByIdAsync(long containerPrepareId)
        {
            return await _unitOfWork.TransactionContainerPrepareRepos
                .GetContainerPrepareByIdAsync(containerPrepareId);
        }

    }
}
