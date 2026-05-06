namespace BSS_API.Services
{
    using Interface;
    using Models.Entities;
    using System.Globalization;
    using Models.Report.Preparation;
    using Models.Report.RegisterUnsort;
    using BSS_API.Repositories.Interface;

    public class BssReportService(IUnitOfWork unitOfWork) : IBssReportService
    {
        public async Task<bool> CheckSupervisorOnlineAsync(int departmentId)
        {
            try
            {
                bool isSupervisorOnline = false;
                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(departmentId);
                if (lastSupervisorActiveInSystem != null) isSupervisorOnline = true;
                return isSupervisorOnline;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<PreparationUnfitReportModel> GetPreparationUnfitReportAsync(
            PreparationUnfitReportRequest preparationUnfitReportRequest)
        {
            try
            {
                PreparationUnfitReportModel preparationUnfitReportModel = new PreparationUnfitReportModel();

                #region ReportHeader

                preparationUnfitReportModel.ReportHeader.RegisterDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(preparationUnfitReportRequest
                        .DepartmentId);

                if (lastSupervisorActiveInSystem != null)
                {
                    preparationUnfitReportModel.ReportHeader.SupervisorName =
                        lastSupervisorActiveInSystem.UserLogin != null
                            ? lastSupervisorActiveInSystem.UserLogin.FirstName + " " +
                              lastSupervisorActiveInSystem.UserLogin.LastName
                            : string.Empty;
                }
                else
                {
                    throw new Exception("Supervisor not found.");
                }

                if (preparationUnfitReportRequest.MachineId.HasValue)
                {
                    MasterMachine? masterMachine = await unitOfWork.MachineRepos.GetAsync(
                        m => m.MachineId == preparationUnfitReportRequest.MachineId && m.IsActive == true,
                        tracked: false);
                    preparationUnfitReportModel.ReportHeader.MachineName = masterMachine?.MachineName ?? string.Empty;
                }
                else
                {
                    preparationUnfitReportModel.ReportHeader.MachineName = string.Empty;
                }

                MasterDepartment? masterDepartment = await unitOfWork.DepartmentRepos.GetAsync(
                    d => d.DepartmentId == preparationUnfitReportRequest.DepartmentId && d.IsActive == true,
                    tracked: false);
                preparationUnfitReportModel.ReportHeader.DepartmentName =
                    masterDepartment?.DepartmentName ?? string.Empty;

                #endregion ReportHeader

                #region ReportDetail

                ICollection<TransactionPreparation> transactionPreparations =
                    await unitOfWork.TransactionPreparationRepos.GetAllTransactionPreparationWithPrepareIdAsync(
                        preparationUnfitReportRequest.PreparationIds, preparationUnfitReportRequest.DepartmentId,
                        preparationUnfitReportRequest.BssBnTypeCode);

                if (transactionPreparations.Count > 0)
                {
                    foreach (var transactionPreparation in transactionPreparations)
                    {
                        preparationUnfitReportModel.ReportDetail.Add(new PreparationUnfitReportDetail
                        {
                            BarcodeContainer = transactionPreparation.TransactionContainerPrepare != null
                                ? transactionPreparation.TransactionContainerPrepare.ContainerCode
                                : string.Empty,
                            BarcodeWrap = transactionPreparation.PackageCode,
                            BarcodeBundle = transactionPreparation.BundleCode,
                            HeaderCard = transactionPreparation.HeaderCardCode,
                            InstitutionCode = transactionPreparation.MasterInstitution != null
                                ? transactionPreparation.MasterInstitution.BankCode
                                : string.Empty,
                            CashCenterName = transactionPreparation.MasterCashCenter != null
                                ? transactionPreparation.MasterCashCenter.CashCenterName
                                : string.Empty,
                            DenominationPrice = transactionPreparation.MasterDenomination != null
                                ? transactionPreparation.MasterDenomination.DenominationPrice.ToString()
                                : string.Empty,
                            PreparaDateTime = transactionPreparation.PrepareDate != null
                                ? transactionPreparation.CreatedDate.ToString("dd/MM/yyyy HH:mm")
                                : string.Empty,
                            PreparatorName =
                                $"{transactionPreparation.CreatedByUser?.FirstName ?? string.Empty} {transactionPreparation.CreatedByUser?.LastName ?? string.Empty}"
                        });
                    }
                }

                #endregion ReportDetail

                #region ReportSummary

                var summaryDetails = preparationUnfitReportModel.ReportDetail
                    .GroupBy(x => x.BarcodeContainer)
                    .Select(g => new PreparationUnfitReportSummaryDetail
                    {
                        BarcodeContainer = g.Key,
                        TotalBundle = g.Count(),
                        TotalInstitution = g
                            .Select(x => x.InstitutionCode)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                preparationUnfitReportModel.ReportSummary.TotalAllBundle =
                    summaryDetails.Sum(x => x.TotalBundle);

                preparationUnfitReportModel.ReportSummary.TotalAllInstitution =
                    summaryDetails.Sum(x => x.TotalInstitution);

                preparationUnfitReportModel.ReportSummary.ReportSummaryDetail = summaryDetails;

                #endregion ReportSummary

                return preparationUnfitReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PreparationUnsortCAMemberReportModel> GetPreparationCAMemberReportAsync(
            PreparationUnsortCAMemberReportRequest preparationUnsortCaMemberReportRequest)
        {
            try
            {
                PreparationUnsortCAMemberReportModel preparationUnsortCaMemberReportModel =
                    new PreparationUnsortCAMemberReportModel();

                #region ReportHeader

                preparationUnsortCaMemberReportModel.ReportHeader.RegisterDate =
                    DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(
                        preparationUnsortCaMemberReportRequest
                            .DepartmentId);

                if (lastSupervisorActiveInSystem != null)
                {
                    preparationUnsortCaMemberReportModel.ReportHeader.SupervisorName =
                        lastSupervisorActiveInSystem.UserLogin != null
                            ? lastSupervisorActiveInSystem.UserLogin.FirstName + " " +
                              lastSupervisorActiveInSystem.UserLogin.LastName
                            : string.Empty;
                }
                else
                {
                    throw new Exception("Supervisor not found.");
                }

                if (preparationUnsortCaMemberReportRequest.MachineId.HasValue)
                {
                    MasterMachine? masterMachine = await unitOfWork.MachineRepos.GetAsync(
                        m => m.MachineId == preparationUnsortCaMemberReportRequest.MachineId && m.IsActive == true,
                        tracked: false);
                    preparationUnsortCaMemberReportModel.ReportHeader.MachineName =
                        masterMachine?.MachineName ?? string.Empty;
                }
                else
                {
                    preparationUnsortCaMemberReportModel.ReportHeader.MachineName = string.Empty;
                }

                MasterDepartment? masterDepartment = await unitOfWork.DepartmentRepos.GetAsync(
                    d => d.DepartmentId == preparationUnsortCaMemberReportRequest.DepartmentId && d.IsActive == true,
                    tracked: false);
                preparationUnsortCaMemberReportModel.ReportHeader.DepartmentName =
                    masterDepartment?.DepartmentName ?? string.Empty;

                #endregion ReportHeader

                #region ReportDetail

                ICollection<TransactionPreparation> transactionPreparations =
                    await unitOfWork.TransactionPreparationRepos.GetAllTransactionPreparationWithPrepareIdAsync(
                        preparationUnsortCaMemberReportRequest.PreparationIds,
                        preparationUnsortCaMemberReportRequest.DepartmentId,
                        preparationUnsortCaMemberReportRequest.BssBnTypeCode);

                if (transactionPreparations.Count > 0)
                {
                    foreach (var transactionPreparation in transactionPreparations)
                    {
                        preparationUnsortCaMemberReportModel.ReportDetail.Add(new PreparationUnsortCAMemberReportDetail
                        {
                            BarcodeContainer = transactionPreparation.TransactionContainerPrepare != null
                                ? transactionPreparation.TransactionContainerPrepare.ContainerCode
                                : string.Empty,
                            HeaderCard = transactionPreparation.HeaderCardCode,
                            InstitutionCode = transactionPreparation.MasterInstitution != null
                                ? transactionPreparation.MasterInstitution.BankCode
                                : string.Empty,
                            CashPointName = transactionPreparation.MasterCashPoint != null
                                ? transactionPreparation.MasterCashPoint?.CashpointName
                                : string.Empty,
                            DenominationPrice = transactionPreparation.MasterDenomination != null
                                ? transactionPreparation.MasterDenomination.DenominationPrice.ToString()
                                : string.Empty,
                            PreparaDateTime = transactionPreparation.PrepareDate != null
                                ? transactionPreparation.CreatedDate.ToString("dd/MM/yyyy HH:mm")
                                : string.Empty,
                            PreparatorName =
                                $"{transactionPreparation.CreatedByUser?.FirstName ?? string.Empty} {transactionPreparation.CreatedByUser?.LastName ?? string.Empty}"
                        });
                    }
                }

                #endregion ReportDetail

                #region ReportSummary

                var summaryDetails = preparationUnsortCaMemberReportModel.ReportDetail
                    .GroupBy(x => x.BarcodeContainer)
                    .Select(g => new PreparationUnsortCAMemberReportSummaryDetail
                    {
                        BarcodeContainer = g.Key,
                        TotalBundle = g.Count(),
                        TotalInstitution = g
                            .Select(x => x.InstitutionCode)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                preparationUnsortCaMemberReportModel.ReportSummary.TotalAllBundle =
                    summaryDetails.Sum(x => x.TotalBundle);

                preparationUnsortCaMemberReportModel.ReportSummary.TotalAllInstitution =
                    summaryDetails.Sum(x => x.TotalInstitution);

                preparationUnsortCaMemberReportModel.ReportSummary.ReportSummaryDetail = summaryDetails;

                #endregion ReportSummary

                return preparationUnsortCaMemberReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PreparationUnsortCANonMemberReportModel> GetPreparationCANonMemberReportAsync(
            PreparationUnsortCANonMemberReportRequest preparationUnsortCanNonMemberReportRequest)
        {
            try
            {
                PreparationUnsortCANonMemberReportModel preparationUnsortCanNonMemberReportModel =
                    new PreparationUnsortCANonMemberReportModel();

                #region ReportHeader

                preparationUnsortCanNonMemberReportModel.ReportHeader.RegisterDate =
                    DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(
                        preparationUnsortCanNonMemberReportRequest
                            .DepartmentId);

                if (lastSupervisorActiveInSystem != null)
                {
                    preparationUnsortCanNonMemberReportModel.ReportHeader.SupervisorName =
                        lastSupervisorActiveInSystem.UserLogin != null
                            ? lastSupervisorActiveInSystem.UserLogin.FirstName + " " +
                              lastSupervisorActiveInSystem.UserLogin.LastName
                            : string.Empty;
                }
                else
                {
                    throw new Exception("Supervisor not found.");
                }

                if (preparationUnsortCanNonMemberReportRequest.MachineId.HasValue)
                {
                    MasterMachine? masterMachine = await unitOfWork.MachineRepos.GetAsync(
                        m => m.MachineId == preparationUnsortCanNonMemberReportRequest.MachineId && m.IsActive == true,
                        tracked: false);
                    preparationUnsortCanNonMemberReportModel.ReportHeader.MachineName =
                        masterMachine?.MachineName ?? string.Empty;
                }
                else
                {
                    preparationUnsortCanNonMemberReportModel.ReportHeader.MachineName = string.Empty;
                }

                MasterDepartment? masterDepartment = await unitOfWork.DepartmentRepos.GetAsync(
                    d => d.DepartmentId == preparationUnsortCanNonMemberReportRequest.DepartmentId &&
                         d.IsActive == true,
                    tracked: false);
                preparationUnsortCanNonMemberReportModel.ReportHeader.DepartmentName =
                    masterDepartment?.DepartmentName ?? string.Empty;

                #endregion ReportHeader

                #region ReportDetail

                ICollection<TransactionPreparation> transactionPreparations =
                    await unitOfWork.TransactionPreparationRepos.GetAllTransactionPreparationWithPrepareIdAsync(
                        preparationUnsortCanNonMemberReportRequest.PreparationIds,
                        preparationUnsortCanNonMemberReportRequest.DepartmentId,
                        preparationUnsortCanNonMemberReportRequest.BssBnTypeCode);

                if (transactionPreparations.Count > 0)
                {
                    foreach (var transactionPreparation in transactionPreparations)
                    {
                        preparationUnsortCanNonMemberReportModel.ReportDetail.Add(
                            new PreparationUnsortCANonMemberReportDetail
                            {
                                BarcodeContainer = transactionPreparation.TransactionContainerPrepare != null
                                    ? transactionPreparation.TransactionContainerPrepare.ContainerCode
                                    : string.Empty,
                                HeaderCard = transactionPreparation.HeaderCardCode,
                                InstitutionCode = transactionPreparation.MasterInstitution != null
                                    ? transactionPreparation.MasterInstitution.BankCode
                                    : string.Empty,
                                CashCenterName = transactionPreparation.MasterCashCenter != null
                                    ? transactionPreparation.MasterCashCenter?.CashCenterName
                                    : string.Empty,
                                DenominationPrice =
                                    transactionPreparation.MasterDenomination != null
                                        ? transactionPreparation.MasterDenomination.DenominationPrice.ToString()
                                        : string.Empty,
                                PreparaDateTime = transactionPreparation.PrepareDate != null
                                    ? transactionPreparation.CreatedDate.ToString("dd/MM/yyyy HH:mm")
                                    : string.Empty,
                                PreparatorName =
                                    $"{transactionPreparation.CreatedByUser?.FirstName ?? string.Empty} {transactionPreparation.CreatedByUser?.LastName ?? string.Empty}"
                            });
                    }
                }

                #endregion ReportDetail

                #region ReportSummary

                var summaryDetails = preparationUnsortCanNonMemberReportModel.ReportDetail
                    .GroupBy(x => x.BarcodeContainer)
                    .Select(g => new PreparationUnsortCANonMemberReportSummaryDetail
                    {
                        BarcodeContainer = g.Key,
                        TotalBundle = g.Count(),
                        TotalInstitution = g
                            .Select(x => x.InstitutionCode)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                preparationUnsortCanNonMemberReportModel.ReportSummary.TotalAllBundle =
                    summaryDetails.Sum(x => x.TotalBundle);

                preparationUnsortCanNonMemberReportModel.ReportSummary.TotalAllInstitution =
                    summaryDetails.Sum(x => x.TotalInstitution);

                preparationUnsortCanNonMemberReportModel.ReportSummary.ReportSummaryDetail = summaryDetails;

                #endregion ReportSummary

                return preparationUnsortCanNonMemberReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PreparationUnsortCCReportModel> GetPreparationUnsortCCReportAsync(
            PreparationUnsortCCReportRequest preparationUnsortCcReportRequest)
        {
            try
            {
                PreparationUnsortCCReportModel preparationUnsortCcReportModel = new PreparationUnsortCCReportModel();

                #region ReportHeader

                preparationUnsortCcReportModel.ReportHeader.RegisterDate =
                    DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(
                        preparationUnsortCcReportRequest
                            .DepartmentId);

                if (lastSupervisorActiveInSystem != null)
                {
                    preparationUnsortCcReportModel.ReportHeader.SupervisorName =
                        lastSupervisorActiveInSystem.UserLogin != null
                            ? lastSupervisorActiveInSystem.UserLogin.FirstName + " " +
                              lastSupervisorActiveInSystem.UserLogin.LastName
                            : string.Empty;
                }
                else
                {
                    throw new Exception("Supervisor not found.");
                }

                if (preparationUnsortCcReportRequest.MachineId.HasValue)
                {
                    MasterMachine? masterMachine = await unitOfWork.MachineRepos.GetAsync(
                        m => m.MachineId == preparationUnsortCcReportRequest.MachineId && m.IsActive == true,
                        tracked: false);

                    preparationUnsortCcReportModel.ReportHeader.MachineName =
                        masterMachine?.MachineName ?? string.Empty;
                }
                else
                {
                    preparationUnsortCcReportModel.ReportHeader.MachineName = string.Empty;
                }

                MasterDepartment? masterDepartment = await unitOfWork.DepartmentRepos.GetAsync(
                    d => d.DepartmentId == preparationUnsortCcReportRequest.DepartmentId &&
                         d.IsActive == true,
                    tracked: false);
                preparationUnsortCcReportModel.ReportHeader.DepartmentName =
                    masterDepartment?.DepartmentName ?? string.Empty;

                #endregion ReportHeader

                #region ReportDetail

                ICollection<TransactionPreparation> transactionPreparations =
                    await unitOfWork.TransactionPreparationRepos.GetAllTransactionPreparationWithPrepareIdAsync(
                        preparationUnsortCcReportRequest.PreparationIds,
                        preparationUnsortCcReportRequest.DepartmentId,
                        preparationUnsortCcReportRequest.BssBnTypeCode);

                if (transactionPreparations.Count > 0)
                {
                    foreach (var transactionPreparation in transactionPreparations)
                    {
                        preparationUnsortCcReportModel.ReportDetail.Add(
                            new PreparationUnsortCCReportDetail
                            {
                                BarcodeContainer = transactionPreparation.TransactionContainerPrepare != null
                                    ? transactionPreparation.TransactionContainerPrepare.ContainerCode
                                    : string.Empty,
                                HeaderCard = transactionPreparation.HeaderCardCode,
                                InstitutionCode = transactionPreparation.MasterInstitution != null
                                    ? transactionPreparation.MasterInstitution.BankCode
                                    : string.Empty,
                                CashPointName = transactionPreparation.MasterCashPoint != null
                                    ? transactionPreparation.MasterCashPoint?.CashpointName
                                    : string.Empty,
                                DenominationPrice =
                                    transactionPreparation.MasterDenomination != null
                                        ? transactionPreparation.MasterDenomination.DenominationPrice.ToString()
                                        : string.Empty,
                                PreparaDateTime = transactionPreparation.PrepareDate != null
                                    ? transactionPreparation.CreatedDate.ToString("dd/MM/yyyy HH:mm")
                                    : string.Empty,
                                PreparatorName =
                                    $"{transactionPreparation.CreatedByUser?.FirstName ?? string.Empty} {transactionPreparation.CreatedByUser?.LastName ?? string.Empty}"
                            });
                    }
                }

                #endregion ReportDetail

                #region ReportSummary

                var summaryDetails = preparationUnsortCcReportModel.ReportDetail
                    .GroupBy(x => x.BarcodeContainer)
                    .Select(g => new PreparationUnsortCCReportSummaryDetail
                    {
                        BarcodeContainer = g.Key,
                        TotalBundle = g.Count(),
                        TotalInstitution = g
                            .Select(x => x.InstitutionCode)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                preparationUnsortCcReportModel.ReportSummary.TotalAllBundle =
                    summaryDetails.Sum(x => x.TotalBundle);

                preparationUnsortCcReportModel.ReportSummary.TotalAllInstitution =
                    summaryDetails.Sum(x => x.TotalInstitution);

                preparationUnsortCcReportModel.ReportSummary.ReportSummaryDetail = summaryDetails;

                #endregion ReportSummary

                return preparationUnsortCcReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<RegisterUnsortReportModel> GetRegisterUnsortReportModelAsync(
            RegisterUnsortReportRequest registerUnsortReportRequest)
        {
            try
            {
                RegisterUnsortReportModel registerUnsortReportModel = new RegisterUnsortReportModel();

                TransactionRegisterUnsort? transactionRegisterUnsort =
                    await unitOfWork.TransactionRegisterUnsortRepos.GetRegisterUnsortByRegisterUnsortIdForPrintAsync(
                        registerUnsortReportRequest.RegisterUnsortId);

                if (transactionRegisterUnsort == null)
                {
                    throw new Exception("Register Unsort not found.");
                }

                #region ReportHeader

                registerUnsortReportModel.ReportHeader.OperatorName =
                    $"{transactionRegisterUnsort.CreatedUser?.FirstName ?? string.Empty} {transactionRegisterUnsort.CreatedUser?.LastName ?? string.Empty}";
                registerUnsortReportModel.ReportHeader.BarcodeContainer = transactionRegisterUnsort.ContainerCode;
                registerUnsortReportModel.ReportHeader.DepartmentName =
                    transactionRegisterUnsort.MasterDepartment.DepartmentName;
                registerUnsortReportModel.ReportHeader.RegisterDate =
                    transactionRegisterUnsort.ReceivedDate.ToString("dd/MM/yyyy HH:mm");

                #endregion ReportHeader

                #region ReportDetail

                if (transactionRegisterUnsort.TransactionUnsortCCs.Count > 0)
                {
                    foreach (var unsortCC in transactionRegisterUnsort.TransactionUnsortCCs)
                    {
                        registerUnsortReportModel.ReportDetail.Add(new RegisterUnsortReportDetail
                        {
                            InstitutionName = unsortCC.MasterInstitution != null
                                ? unsortCC.MasterInstitution.InstitutionShortName
                                : string.Empty,
                            DenominationPrice = unsortCC.MasterDenomination != null
                                ? unsortCC.MasterDenomination.DenominationPrice.ToString()
                                : string.Empty,
                            TotalBundle = unsortCC.BanknoteQty,
                            CreatedDate = unsortCC.CreatedDate.ToString("dd/MM/yyyy HH:mm"),
                            CreatedName =
                                $"{unsortCC.CreatedByUser?.FirstName ?? string.Empty} {unsortCC.CreatedByUser?.LastName ?? string.Empty}"
                        });
                    }
                }

                #endregion ReportDetail

                #region ReportSummary

                registerUnsortReportModel.ReportSummary.BarcodeContainer = transactionRegisterUnsort.ContainerCode;
                registerUnsortReportModel.ReportSummary.TotalAllBundle =
                    registerUnsortReportModel.ReportDetail.Sum(x => x.TotalBundle);
                registerUnsortReportModel.ReportSummary.TotalAllInstitution =
                    registerUnsortReportModel.ReportDetail.Select(w => w.InstitutionName).Distinct().Count();

                #endregion ReportSummary

                return registerUnsortReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SendUnsortDeliveryReportModel> GetSendUnsortDeliveryReportAsync(
            SendUnsortDeliveryRequest sendUnsortDeliveryRequest)
        {
            try
            {
                SendUnsortDeliveryReportModel sendUnsortDeliveryReportModel = new SendUnsortDeliveryReportModel();

                CultureInfo thaiCultureInfo = new CultureInfo("th-TH");
                sendUnsortDeliveryReportModel.ReportHeader.PrintDate =
                    DateTime.Now.ToString("d MMMM yyyy", thaiCultureInfo);

                MasterDepartment? masterDepartment =
                    await unitOfWork.DepartmentRepos.GetAsync(
                        w => w.DepartmentId == sendUnsortDeliveryRequest.DepartmentId, tracked: false);

                if (masterDepartment == null)
                {
                    throw new Exception("Department not found.");
                }

                sendUnsortDeliveryReportModel.ReportHeader.DepartmentName = masterDepartment.DepartmentName;

                var lastSupervisorActiveInSystem =
                    await unitOfWork.TransUserLoginLogRepos.GetLastSupervisorLoginAsync(sendUnsortDeliveryRequest
                        .DepartmentId);

                if (lastSupervisorActiveInSystem != null)
                {
                    sendUnsortDeliveryReportModel.ReportHeader.SupervisorName =
                        lastSupervisorActiveInSystem.UserLogin != null
                            ? lastSupervisorActiveInSystem.UserLogin.FirstName + " " +
                              lastSupervisorActiveInSystem.UserLogin.LastName
                            : string.Empty;
                }
                else
                {
                    throw new Exception("Supervisor not found.");
                }

                if (sendUnsortDeliveryRequest.IsHistory)
                {
                    // Todo select data from history table

                    TransactionSendUnsortCCHistory? transactionSendUnsortCCHistory =
                        await unitOfWork.TransactionSendUnsortCCHistoryRepos
                            .GetTransactionSendUnsortCCHistoryBySendUnsortHistoryIdAsync(sendUnsortDeliveryRequest
                                .PrintId);

                    if (transactionSendUnsortCCHistory == null)
                    {
                        throw new Exception("Send Unsort not found.");
                    }

                    #region ReportHeader

                    sendUnsortDeliveryReportModel.ReportHeader.SendUnsortCode =
                        transactionSendUnsortCCHistory.SendUnsortCode;
                    sendUnsortDeliveryReportModel.ReportHeader.RefCode = transactionSendUnsortCCHistory.RefCode;

                    #endregion ReportHeader

                    #region ReportDetail

                    if (transactionSendUnsortCCHistory.TransactionSendUnsortDataHistory is { Count: > 0 })
                    {
                        foreach (var sendUnsortDataHistory in transactionSendUnsortCCHistory
                                     .TransactionSendUnsortDataHistory)
                        {
                            string containerCode = sendUnsortDataHistory.TransactionRegisterUnsort?.ContainerCode ??
                                                   string.Empty;

                            if (sendUnsortDataHistory.TransactionUnsortCCHistorys is { Count: > 0 })
                            {
                                foreach (var unsortCCHistory in sendUnsortDataHistory.TransactionUnsortCCHistorys)
                                {
                                    SendUnsortDeliveryReportDetail sendUnsortDeliveryReportDetail =
                                        new SendUnsortDeliveryReportDetail
                                        {
                                            ContainerCode = containerCode,
                                            InstitutionName = unsortCCHistory.MasterInstitution != null
                                                ? unsortCCHistory.MasterInstitution.InstitutionShortName
                                                : string.Empty,
                                            DenominationPrice = unsortCCHistory.MasterDenomination != null
                                                ? unsortCCHistory.MasterDenomination.DenominationPrice.ToString()
                                                : string.Empty,
                                            TotalBundle = unsortCCHistory.BanknoteQty
                                        };

                                    sendUnsortDeliveryReportModel.ReportDetail.Add(sendUnsortDeliveryReportDetail);
                                }
                            }
                        }
                    }

                    #endregion ReportDetail
                }
                else
                {
                    // Todo select data from send unsort table
                    TransactionSendUnsortCC? transactionSendUnsortCC = await unitOfWork.TransactionSendUnsortCCRepos
                        .GetTransactionSendUnsortCCAndIncludeDataForPrintReportBySendUnsortIdAsync(
                            sendUnsortDeliveryRequest.PrintId);

                    if (transactionSendUnsortCC == null)
                    {
                        throw new Exception("Send Unsort not found.");
                    }

                    #region ReportHeader

                    sendUnsortDeliveryReportModel.ReportHeader.SendUnsortCode = transactionSendUnsortCC.SendUnsortCode;
                    sendUnsortDeliveryReportModel.ReportHeader.RefCode = transactionSendUnsortCC.RefCode;

                    #endregion ReportHeader

                    #region ReportDetail

                    if (transactionSendUnsortCC.TransactionSendUnsortData is { Count: > 0 })
                    {
                        foreach (var transactionSendUnsortData in transactionSendUnsortCC.TransactionSendUnsortData)
                        {
                            string containerCode = transactionSendUnsortData.TransactionRegisterUnsort?.ContainerCode ??
                                                   string.Empty;

                            if (transactionSendUnsortData.TransactionRegisterUnsort is
                                { TransactionUnsortCCs.Count: > 0 })
                            {
                                foreach (var unsortCC in transactionSendUnsortData.TransactionRegisterUnsort
                                             .TransactionUnsortCCs)
                                {
                                    SendUnsortDeliveryReportDetail sendUnsortDeliveryReportDetail =
                                        new SendUnsortDeliveryReportDetail
                                        {
                                            ContainerCode = containerCode,
                                            InstitutionName = unsortCC.MasterInstitution != null
                                                ? unsortCC.MasterInstitution.InstitutionShortName
                                                : string.Empty,
                                            DenominationPrice = unsortCC.MasterDenomination != null
                                                ? unsortCC.MasterDenomination.DenominationPrice.ToString()
                                                : string.Empty,
                                            TotalBundle = unsortCC.BanknoteQty
                                        };

                                    sendUnsortDeliveryReportModel.ReportDetail.Add(sendUnsortDeliveryReportDetail);
                                }
                            }
                        }
                    }

                    #endregion ReportDetail
                }

                return sendUnsortDeliveryReportModel;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}