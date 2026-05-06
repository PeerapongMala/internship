using System.Data;
using BSS_API.Models;
using BSS_API.Repositories;
using BSS_API.Services.Interface;
using Microsoft.EntityFrameworkCore.Storage;

namespace BSS_API.Repositories.Interface
{
    public interface IUnitOfWork
    {
        #region SystemEmail

        IBssTransactionNotificationRepository BssTransactionNotificationRepository { get; }
        IBssTransactionNotiRecipientRepository BssTransactionNotiRecipientRepository { get; }

        #endregion SystemEmail

        IMasterRoleRepository RoleRepos { get; }
        IMasterUserRepository UserRepos { get; }
        IMasterMenuRepository MenuRepos { get; }
        IMasterUserRoleRepository UserRoleRepos { get; }
        IMasterRolePermissionRepository RolePermissionRepos { get; }
        ICbmsTransactionRepository CbmsTransactionRepos { get; }
        IMasterDepartmentRepository DepartmentRepos { get; }
        IMasterCashTypeRepository CashtypeRepos { get; }
        IMasterInstitutionRepository InstitutionRepos { get; }
        IMasterMachineRepository MachineRepos { get; }
        IMasterMachineTypeRepository MachineTypeRepos { get; }
        IMasterDenominationRepository DenominationRepos { get; }
        IMasterDenomReconcileRepository DenomReconcileRepos { get; }
        IMasterShiftRepository ShiftRepos { get; }
        IMasterConfigRepository ConfigRepos { get; }
        IMasterConfigTypeRepository ConfigTypeRepos { get; }
        IMasterBanknoteTypeRepository BanknoteTypeRepos { get; }
        IMasterBanknoteTypeSendRepository BanknoteTypeSendRepos { get; }
        IMasterMSevenOutputRepository MSevenOutputRepos { get; }
        IMasterCompanyRepository CompanyRepos { get; }
        IMasterCashCenterRepository CashCenterRepos { get; }
        IMasterStatusRepository StatusRepos { get; }
        IMasterCashPointRepository CashPointRepos { get; }
        IMasterMSevenQualityRepository MSevenQualityRepos { get; }
        IMasterMSevenDenomRepository MSevenDenomRepos { get; }
        ITransactionRegisterUnsortRepository TransactionRegisterUnsortRepos { get; }
        ITransactionUnsortCCRepository TransactionUnsortCCRepos { get; }
        IMasterRoleGroupRepository RoleGroupRepos { get; }
        IMasterUserHistoryRepository UserHistoryRepos { get; }
        ITransactionUserLoginLogRepository TransUserLoginLogRepos { get; }
        IMasterCompanyDepartmentRepository CompanyDepartmentRepos { get; }
        IMasterCompanyInstitutionRepository CompanyInstitutionRepos { get; }
        IMasterSeriesDenomRepository SeriesDenomRepos { get; }
        IMasterMSevendenomSeriesRepository MSevendenomSeriesRepos { get; }
        IMasterZoneRepository ZoneRepos { get; }
        IMasterZoneCashpointRepository ZoneCashpointRepos { get; }
        ITransactionApiLogRepository TransactionApiLogRepos { get; }
        ITransactionPreparationRepository TransactionPreparationRepos { get; }
        ITransactionContainerPrepareRepository TransactionContainerPrepareRepos { get; }
        ITransactionReconcileTranRepository TransactionReconcileTranRepos { get; }
        ITransactionApproveManualKeyInTranRepository TransactionApproveManualKeyInTranRepos { get; }
        ITransactionVerifyTranRepository TransactionVerifyTranRepos { get; }
        ITransactionRevokeTranRepository TransactionRevokeTranRepos { get; }
        ITransactionReconciliationTranRepository TransactionReconciliationTranRepos { get; }
        ITransactionReconciliationRepository TransactionReconciliationRepos { get; }
        ITransactionReconcileTmpRepository TransactionReconcileTmpRepos { get; }
        IMasterSendUnsortSequenceRepository MasterSendUnsortSequenceRepos { get; }
        IBssTransactionContainerSequenceRepository BssTransactionContainerSequenceRepos { get; }

        ITransactionSendUnsortDataRepository TransactionSendUnsortDataRepos { get; }
        ITransactionSendUnsortCCRepository TransactionSendUnsortCCRepos { get; }
        ITransactionSendUnsortCCHistoryRepository TransactionSendUnsortCCHistoryRepos { get; }
        ITransactionSendUnsortDataHistoryRepository TransactionSendUnsortDataHistoryRepos { get; }
        ITransactionUnsortCCHistoryRepository TransactionUnsortCCHistoryRepos { get; }
        IBssRefreshTokenRepository BssRefreshTokenRepos { get; }
        ITransactionSourceFileRepository TransactionSourceFileRepos { get; }
        ITransactionMachineHdRepository TransactionMachineHdRepos { get; }
        ITransactionMachineHdDataRepository TransactionMachineHdDataRepos { get; }
        IAutoSellingRepository AutoSellingRepos { get; }
        ITransactionImportHcTmpRepository TransactionImportHcTmpRepos { get; }

        #region Transaction

        IDbConnection GetDbConnection();

        IDbTransaction GetDbTransaction(IDbConnection connection,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);

        IDbContextTransaction ContextTransaction(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);

        void Commit(IDbTransaction transaction);

        void Commit(IDbContextTransaction transaction);

        Task CommitAsync(IDbContextTransaction transaction);

        void Rollback(IDbTransaction transaction);

        void Rollback(IDbContextTransaction transaction);

        Task RollbackAsync(IDbContextTransaction transaction);

        #endregion Transaction

        void SaveChange();
        Task SaveChangeAsync();

        void ClearChangeTracker();

        Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action);

        Task<T> ExecuteWithTransactionAsync<T>(Func<Task<T>> action);
    }
}