namespace BSS_API.Services
{
    using Core.Constants;
    using Helpers;
    using Interface;
    using Models.Entities;
    using Models.ResponseModels;
    using Repositories.Interface;

    public class MachineDataImportService(
        IUnitOfWork unitOfWork,
        IFtpService ftpService,
        IBpsXmlParserService xmlParser,
        ILogger<MachineDataImportService> logger) : IMachineDataImportService
    {
        public async Task<RefreshResponse> RefreshAsync(int machineId, int userId)
        {
            var response = new RefreshResponse();

            // ตรวจสอบ machine และดึง path จาก DB
            var machine = unitOfWork.MachineRepos.Get(x => x.MachineId == machineId && x.IsActive == true);
            if (machine == null)
                throw new InvalidOperationException($"Machine with id {machineId} not found or inactive.");

            if (string.IsNullOrWhiteSpace(machine.PathnameBss))
                throw new InvalidOperationException($"Machine {machineId} has no PathnameBss configured.");

            var remotePath = machine.PathnameBss;
            var successPath = $"{remotePath}/{AppConfig.FtpSuccessFolder}";
            var errorPath = $"{remotePath}/{AppConfig.FtpErrorFolder}";

            // โหลด master data สำหรับ validate denomination / quality / output
            var activeQualityCodes = await unitOfWork.MSevenQualityRepos.GetActiveQualityCodesAsync();
            var activeOutputCodes = await unitOfWork.MSevenOutputRepos.GetActiveOutputCodesAsync();
            var qualityOutputMappings = await LoadQualityOutputConfigAsync();

            // รายการไฟล์ XML จาก FTP
            var xmlFiles = await ftpService.ListXmlFilesAsync(remotePath);
            response.TotalFilesFound = xmlFiles.Count;

            if (xmlFiles.Count == 0)
                return response;

            // 3. Ensure success/error subdirectories exist
            await ftpService.EnsureDirectoryExistsAsync(successPath);
            await ftpService.EnsureDirectoryExistsAsync(errorPath);

            // Cutoff for duplicate detection (e.g. same header card within last 24 hours)
            var duplicateCutoff = DateTime.Now.AddHours(-24);

            // 4. Process each file
            foreach (var filePath in xmlFiles)
            {
                var fileName = Path.GetFileName(filePath);

                try
                {
                    // ข้ามไฟล์ที่เคย import แล้ว
                    var isDuplicate = await unitOfWork.TransactionSourceFileRepos
                        .IsDuplicateFileAsync(fileName, machineId);
                    if (isDuplicate)
                    {
                        response.TotalFilesSkipped++;
                        await SafeMoveFileAsync(filePath, BuildRenamedDestPath(filePath, successPath));
                        continue;
                    }

                    // ดาวน์โหลด XML
                    var xmlContent = await ftpService.DownloadFileContentAsync(filePath);

                    // ตรวจสอบ: ไฟล์ว่างเปล่า
                    if (string.IsNullOrWhiteSpace(xmlContent))
                    {
                        var errorFile = new TransactionSourceFile
                        {
                            MachineId = machineId,
                            FileName = fileName,
                            IsError = true,
                            Remark = "ไม่มีข้อมูลจากเครื่องจักร",
                            IsActive = true,
                            CreatedBy = userId,
                            CreatedDate = DateTime.Now
                        };
                        await unitOfWork.TransactionSourceFileRepos.AddAsync(errorFile);
                        await unitOfWork.SaveChangeAsync();

                        response.TotalFilesError++;
                        response.Errors.Add(new FileErrorResponse
                        {
                            FileName = fileName,
                            ErrorMessage = "ไม่มีข้อมูลจากเครื่องจักร"
                        });
                        await SafeMoveFileAsync(filePath, BuildRenamedDestPath(filePath, errorPath));
                        continue;
                    }

                    // แปลง XML
                    var bpsData = xmlParser.ParseXml(xmlContent);
                    var serialNumber = bpsData.Machine.SerialNumber;

                    // ตรวจสอบ: SerialNumber ไม่ตรงกับ DB
                    if (!string.IsNullOrEmpty(serialNumber)
                        && serialNumber != machine.MachineCode)
                    {
                        var errorFile = new TransactionSourceFile
                        {
                            MachineId = machineId,
                            FileName = fileName,
                            IsError = true,
                            Remark = $"ชื่อเครื่องจักรไม่ตรง (XML: {serialNumber}, DB: {machine.MachineCode})",
                            IsActive = true,
                            CreatedBy = userId,
                            CreatedDate = DateTime.Now
                        };
                        await unitOfWork.TransactionSourceFileRepos.AddAsync(errorFile);
                        await unitOfWork.SaveChangeAsync();

                        response.TotalFilesError++;
                        response.Errors.Add(new FileErrorResponse
                        {
                            FileName = fileName,
                            ErrorMessage = $"ชื่อเครื่องจักรไม่ตรง (XML: {serialNumber}, DB: {machine.MachineCode})"
                        });
                        await SafeMoveFileAsync(filePath, BuildRenamedDestPath(filePath, errorPath));
                        continue;
                    }

                    // ดึง department_id จาก serial number ของเครื่อง
                    var sourceMachine = unitOfWork.MachineRepos
                        .Get(x => x.MachineCode == serialNumber && x.IsActive == true);
                    var sourceDepartmentId = sourceMachine?.DepartmentId ?? 0;

                    // บันทึกข้อมูลลง DB ภายใน transaction
                    var importedHeaders = await unitOfWork.ExecuteInTransactionAsync(async () =>
                    {
                        var headers = new List<MachineHdImportResponse>();

                        var sourceFile = new TransactionSourceFile
                        {
                            MachineId = machineId,
                            FileName = fileName,
                            IsActive = true,
                            CreatedBy = userId,
                            CreatedDate = DateTime.Now
                        };
                        await unitOfWork.TransactionSourceFileRepos.AddAsync(sourceFile);
                        await unitOfWork.SaveChangeAsync();

                        var seqNo = 1;

                        foreach (var section in bpsData.Machine.ParameterSections)
                        {
                            foreach (var hcUnit in section.HeadercardUnits)
                            {
                                // ประมวลผล Header Card: ว่าง → "N/A", มีค่า → pad 10 หลัก
                                var isHcEmpty = string.IsNullOrEmpty(hcUnit.HeaderCardID);
                                var headerCardCode = isHcEmpty
                                    ? "N/A"
                                    : hcUnit.HeaderCardID.PadLeft(10, '0');

                                var machineQty = hcUnit.Counters.Sum(c => c.Number);

                                var machineHd = new TransactionMachineHd
                                {
                                    SourceFileId = sourceFile.SourceFileId,
                                    DepartmentId = sourceDepartmentId,
                                    MachineId = machineId,
                                    HeaderCardCode = headerCardCode,
                                    DepositId = hcUnit.DepositID,
                                    StartTime = ParseDateTime(hcUnit.StartTime),
                                    EndTime = ParseDateTime(hcUnit.EndTime),
                                    IsReject = hcUnit.Rejects,
                                    MachineQty = machineQty,
                                    SeqNo = seqNo++,
                                    IsError = isHcEmpty,
                                    Remark = isHcEmpty ? "Header Card Code ไม่มีค่า" : null,
                                    IsActive = true,
                                    IsReconciled = false,
                                    CreatedBy = userId,
                                    CreatedDate = DateTime.Now
                                };
                                await unitOfWork.TransactionMachineHdRepos.AddAsync(machineHd);
                                await unitOfWork.SaveChangeAsync();

                                // บันทึก HC ลง tmp table สำหรับตรวจ duplicate ข้ามรอบ
                                var hcTmp = new TransactionImportHcTmp
                                {
                                    DepartmentId = sourceDepartmentId,
                                    MachineId = machineId,
                                    MachineHdId = machineHd.MachineHdId,
                                    HeaderCardCode = headerCardCode,
                                    IsActive = true,
                                    CreatedBy = userId,
                                    CreatedDate = DateTime.Now
                                };
                                await unitOfWork.TransactionImportHcTmpRepos.AddAsync(hcTmp);

                                // ตรวจสอบ denomination / quality / output ของแต่ละ counter
                                int? primaryDenoId = null;
                                var totalQty = 0;
                                var unknownDenoms = new HashSet<string>();
                                var unknownQualities = new HashSet<string>();
                                var unknownOutputs = new HashSet<string>();
                                var unknownMappings = new HashSet<string>();

                                foreach (var counter in hcUnit.Counters)
                                {
                                    var denomValue = (int)decimal.Parse(counter.Value);
                                    var hdData = new TransactionMachineHdData
                                    {
                                        MachineHdId = machineHd.MachineHdId,
                                        DenomId = counter.DenomID,
                                        DenomName = counter.DenomName,
                                        DenomCurrency = counter.Currency,
                                        DenomValue = denomValue,
                                        DenomQuality = counter.Quality,
                                        DenomOutput = counter.Output,
                                        DenomNum = counter.Number,
                                        IsActive = true,
                                        CreatedBy = userId,
                                        CreatedDate = DateTime.Now
                                    };

                                    totalQty += counter.Number;

                                    // หา deno_id และ series_code จาก bss_mst_m7_denom
                                    var denomLookup = await unitOfWork.MSevenDenomRepos
                                        .LookupDenomAsync(counter.DenomID, counter.DenomName, denomValue);

                                    if (denomLookup.DenoId == null)
                                    {
                                        hdData.IsNotFound = true;
                                        machineHd.IsError = true;
                                        unknownDenoms.Add(counter.DenomID);
                                    }
                                    else
                                    {
                                        hdData.SeriesCode = denomLookup.SeriesCode;
                                        primaryDenoId = denomLookup.DenoId;
                                    }

                                    // ตรวจสอบ Quality code
                                    if (!activeQualityCodes.Contains(counter.Quality))
                                    {
                                        hdData.IsUnknow = true;
                                        machineHd.IsError = true;
                                        unknownQualities.Add(counter.Quality);
                                    }

                                    // ตรวจสอบ Output code
                                    if (!activeOutputCodes.Contains(counter.Output))
                                    {
                                        hdData.IsUnknow = true;
                                        machineHd.IsError = true;
                                        unknownOutputs.Add(counter.Output);
                                    }

                                    // แปลง Quality + Output เป็น BnType (G/B/D)
                                    var bnType = ResolveQualityOutputMapping(
                                        counter.Quality, counter.Output, qualityOutputMappings);
                                    if (bnType != null)
                                    {
                                        hdData.BnType = bnType;
                                    }
                                    else if (hdData.IsUnknow != true)
                                    {
                                        hdData.IsUnknow = true;
                                        machineHd.IsError = true;
                                        unknownMappings.Add($"{counter.Quality}/{counter.Output}");
                                    }

                                    await unitOfWork.TransactionMachineHdDataRepos.AddAsync(hdData);
                                }

                                // สร้าง remark สรุป (ไม่ซ้ำ) หลัง loop counter ครบ
                                if (machineHd.IsError == true)
                                {
                                    var parts = new List<string>();
                                    var hc = headerCardCode;

                                    if (unknownDenoms.Count > 0)
                                        parts.Add($"มี Denomination ที่ระบบไม่รู้จัก [{string.Join(", ", unknownDenoms)}]");
                                    if (unknownQualities.Count > 0)
                                        parts.Add($"มี Quality ที่ระบบไม่รู้จัก [{string.Join(", ", unknownQualities)}]");
                                    if (unknownOutputs.Count > 0)
                                        parts.Add($"มี Output ที่ระบบไม่รู้จัก [{string.Join(", ", unknownOutputs)}]");
                                    if (unknownMappings.Count > 0)
                                        parts.Add($"มี Quality/Output mapping ที่ระบบไม่รู้จัก [{string.Join(", ", unknownMappings)}]");

                                    machineHd.Remark = $"มีข้อผิดพลาดในข้อมูลของ Header Card {hc}: "
                                        + string.Join(", ", parts)
                                        + " หากมีข้อผิดพลาดจริงให้ลบข้อมูล Header Card นี้ออกจากระบบ แล้ว Manual Key-in เข้าระบบแทน";
                                }

                                // อัปเดต machine qty และ deno_id หลัง loop counter ครบ
                                machineHd.MachineQty = totalQty;
                                machineHd.DenoId = primaryDenoId;
                                unitOfWork.TransactionMachineHdRepos.Update(machineHd);
                                await unitOfWork.SaveChangeAsync();

                                headers.Add(new MachineHdImportResponse
                                {
                                    MachineHdId = machineHd.MachineHdId,
                                    HeaderCardCode = machineHd.HeaderCardCode,
                                    DepositId = machineHd.DepositId,
                                    MachineQty = machineHd.MachineQty,
                                    StartTime = machineHd.StartTime,
                                    EndTime = machineHd.EndTime,
                                    IsReject = machineHd.IsReject
                                });
                            }
                        }

                        return headers;
                    });

                    response.ImportedHeaders.AddRange(importedHeaders);
                    response.TotalFilesImported++;

                    await SafeMoveFileAsync(filePath, BuildRenamedDestPath(filePath, successPath));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to import file {FileName} for machine {MachineId}", fileName, machineId);
                    response.TotalFilesError++;
                    // Dig deepest inner exception for root cause
                    var deepEx = ex;
                    while (deepEx.InnerException != null) deepEx = deepEx.InnerException;
                    var errorMsg = deepEx == ex
                        ? ex.Message
                        : $"{ex.Message} -> {deepEx.Message}";
                    response.Errors.Add(new FileErrorResponse
                    {
                        FileName = fileName,
                        ErrorMessage = errorMsg
                    });

                    await SafeMoveFileAsync(filePath, BuildRenamedDestPath(filePath, errorPath));
                }
            }

            // ตรวจสอบ Header Card ซ้ำข้ามรอบ import (หลัง import ครบทุกไฟล์)
            var departmentId = machine.DepartmentId;
            await DuplicateHeaderCardCheckAsync(departmentId, machineId, userId);

            // จับคู่ prepare กับ machine HC
            response.TotalMatched = await MatchPrepareWithMachineAsync(departmentId, machineId, userId);

            return response;
        }

        public async Task<List<MachineHeaderCardResponse>> GetMachineHeaderCardsAsync(int machineId)
        {
            var entities = await unitOfWork.TransactionMachineHdRepos.GetByMachineIdAsync(machineId);

            return entities.Select(hd =>
            {
                // ใช้ราคาของ denomination ที่มีจำนวนธนบัตรมากที่สุด
                int? denomPrice = null;
                if (hd.TransactionMachineHdDatas != null && hd.TransactionMachineHdDatas.Any())
                {
                    denomPrice = hd.TransactionMachineHdDatas
                        .OrderByDescending(d => d.DenomNum)
                        .First()
                        .DenomValue;
                }

                return new MachineHeaderCardResponse
                {
                    MachineHdId = hd.MachineHdId,
                    HeaderCardCode = hd.HeaderCardCode,
                    CreatedDate = hd.CreatedDate,
                    DenominationPrice = denomPrice,
                    MachineQty = hd.MachineQty,
                    DepositId = hd.DepositId,
                    IsReject = hd.IsReject,
                    StartTime = hd.StartTime,
                    EndTime = hd.EndTime,
                    IsWarning = false,
                    HasAlert = hd.IsError == true,
                    AlertMessage = hd.Remark ?? string.Empty
                };
            }).ToList();
        }

        public async Task<List<PrepareHeaderCardResponse>> GetPrepareHeaderCardsAsync(
            int departmentId, int? machineId, string? bnTypeCode = null)
        {
            if (!machineId.HasValue)
            {
                var companyDept = await unitOfWork.CompanyDepartmentRepos
                    .GetAsync(cd => cd.DepartmentId == departmentId && cd.IsActive == true);

                if (companyDept?.IsPrepareCentral != true)
                    throw new InvalidOperationException("Department is not configured as prepare_central");
            }

            return await unitOfWork.TransactionPreparationRepos
                .GetUnmatchedPrepareAsync(departmentId, machineId, bnTypeCode);
        }

        #region Duplicate Check

        private async Task DuplicateHeaderCardCheckAsync(int departmentId, int machineId, int userId)
        {
            // ดึง config ช่วงเวลาที่ใช้ตรวจ duplicate
            var matchDayConfigs = await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync("BSS_MATCH_DAY");
            var matchStartConfigs = await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync("BSS_MATCH_START_TIME");

            var matchDays = 2;
            if (matchDayConfigs.Any())
            {
                if (int.TryParse(matchDayConfigs.First().ConfigValue, out var days))
                    matchDays = days;
            }

            var matchStartTime = new TimeSpan(8, 0, 0);
            if (matchStartConfigs.Any())
            {
                if (TimeSpan.TryParse(matchStartConfigs.First().ConfigValue, out var startTime))
                    matchStartTime = startTime;
            }

            var now = DateTime.Now;
            var startDate = now.Date.AddDays(-matchDays).Add(matchStartTime);
            var endDate = now;

            // ดึง HC ที่ยังไม่ reconcile ออกมาเปรียบเทียบ
            var existingHcs = await unitOfWork.TransactionMachineHdRepos
                .GetUnreconciledAsync(departmentId, machineId);

            // ดึง HC ที่เพิ่ง import ในรอบนี้จาก tmp table
            var newHcTmps = await unitOfWork.TransactionImportHcTmpRepos
                .GetByDepartmentAndDateAsync(departmentId, machineId, userId, startDate, endDate);

            var hasChanges = false;
            foreach (var hcTmp in newHcTmps)
            {
                if (hcTmp.HeaderCardCode == "N/A") continue;

                // หา HC เก่าที่มี header_card_code เดียวกันแต่คนละ record
                var duplicateHcs = existingHcs
                    .Where(hc => hc.HeaderCardCode == hcTmp.HeaderCardCode
                              && hc.MachineHdId != hcTmp.MachineHdId)
                    .ToList();

                if (!duplicateHcs.Any()) continue;

                // mark HC ใหม่ว่าซ้ำ
                var newHc = existingHcs.FirstOrDefault(hc => hc.MachineHdId == hcTmp.MachineHdId);
                if (newHc != null)
                {
                    newHc.IsDuplicated = true;
                    newHc.IsMatchPrepare = false;
                    newHc.UpdatedBy = userId;
                    newHc.UpdatedDate = DateTime.Now;
                    unitOfWork.TransactionMachineHdRepos.Update(newHc);
                    hasChanges = true;
                }

                // mark HC เก่าว่าซ้ำ และยกเลิก match ที่มีอยู่ถ้ามี
                foreach (var dupHc in duplicateHcs)
                {
                    if (dupHc.IsDuplicated == true) continue;

                    dupHc.IsDuplicated = true;
                    dupHc.UpdatedBy = userId;
                    dupHc.UpdatedDate = DateTime.Now;
                    unitOfWork.TransactionMachineHdRepos.Update(dupHc);
                    hasChanges = true;

                    if (dupHc.IsMatchPrepare == true)
                    {
                        dupHc.IsMatchPrepare = false;

                        // ปิด reconcile_tran ที่เชื่อมกับ HC เก่า
                        var existingReconcile = await unitOfWork.TransactionReconcileTranRepos
                            .GetAsync(r => r.MachineHdId == dupHc.MachineHdId && r.IsActive == true);
                        if (existingReconcile != null)
                        {
                            existingReconcile.IsActive = false;
                            existingReconcile.UpdatedBy = userId;
                            existingReconcile.UpdatedDate = DateTime.Now;
                            unitOfWork.TransactionReconcileTranRepos.Update(existingReconcile);

                            // คืน flag ของ prepare ให้รอ match ใหม่
                            var prepare = await unitOfWork.TransactionPreparationRepos
                                .GetAsync(p => p.PrepareId == existingReconcile.PrepareId);
                            if (prepare != null)
                            {
                                prepare.IsMatchMachine = false;
                                prepare.UpdatedBy = userId;
                                prepare.UpdatedDate = DateTime.Now;
                                unitOfWork.TransactionPreparationRepos.Update(prepare);
                            }
                        }
                    }
                }
            }

            // ปิด tmp records รอบนี้หลัง check เสร็จ
            await unitOfWork.TransactionImportHcTmpRepos
                .DeactivateOldRecordsAsync(departmentId, machineId, userId);

            if (hasChanges)
                await unitOfWork.SaveChangeAsync();
        }

        #endregion

        #region Matching

        private async Task<int> MatchPrepareWithMachineAsync(
            int departmentId, int? machineId, int userId)
        {
            // ดึง prepare ที่ยังไม่ match
            var prepareList = await unitOfWork.TransactionPreparationRepos
                .GetUnmatchedPrepareAsync(departmentId, machineId);

            // ดึง machine HC ที่ยังไม่ match และไม่ซ้ำ
            var machineList = await unitOfWork.TransactionMachineHdRepos
                .GetUnmatchedByDepartmentAsync(departmentId, machineId);

            int matchCount = 0;
            foreach (var prepare in prepareList)
            {
                // เงื่อนไขการจับคู่: header_card_code และ deno_id ต้องตรงกัน
                var matchedMachine = machineList.FirstOrDefault(m =>
                    m.HeaderCardCode == prepare.HeaderCardCode
                    && m.DenoId == prepare.DenoId);
                if (matchedMachine == null) continue;

                machineList.Remove(matchedMachine);

                var mqty = matchedMachine.MachineQty ?? 0;

                // คำนวณจำนวนมัด
                int bundle;
                if (mqty < 1100)
                    bundle = 1;
                else
                    bundle = Math.Min((mqty - 100) / 1000 + 1, 6);

                // หา shift จาก start time ของ machine
                var machineStartTimeOfDay = matchedMachine.StartTime.TimeOfDay;
                var shiftId = await unitOfWork.ShiftRepos.GetShiftByTimeAsync(machineStartTimeOfDay) ?? 0;

                // กำหนด flag warning / error
                var isExcessMachine = mqty > 1000;
                var isWarning = bundle >= 2 && bundle <= 5;
                var isNotReconcile = matchedMachine.IsError == true || bundle > 5;

                string? alertRemark = null;
                if (isWarning)
                    alertRemark = "HeaderCard นี้ข้อมูลมีมากกว่า 1 มัด (กรณีมัดรวม)";

                var reconcileTran = new TransactionReconcileTran
                {
                    DepartmentId = departmentId,
                    PrepareId = prepare.PrepareId,
                    MachineHdId = matchedMachine.MachineHdId,
                    HeaderCardCode = prepare.HeaderCardCode,
                    M7Qty = matchedMachine.MachineQty,
                    BundleNumber = bundle,
                    StatusId = BssStatusConstants.Reconciliation,
                    ShiftId = shiftId,
                    IsActive = true,
                    IsExcessMachine = isExcessMachine,
                    IsWarning = isWarning,
                    IsNotReconcile = isNotReconcile,
                    AlertRemark = alertRemark,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                };
                await unitOfWork.TransactionReconcileTranRepos.AddAsync(reconcileTran);

                // อัปเดต prepare ว่า match แล้ว
                var prepareEntity = await unitOfWork.TransactionPreparationRepos
                    .GetAsync(p => p.PrepareId == prepare.PrepareId);
                if (prepareEntity != null)
                {
                    prepareEntity.IsMatchMachine = true;
                    prepareEntity.UpdatedBy = userId;
                    prepareEntity.UpdatedDate = DateTime.Now;
                    unitOfWork.TransactionPreparationRepos.Update(prepareEntity);
                }

                // อัปเดต machine HC ว่า match แล้ว
                matchedMachine.IsMatchPrepare = true;
                matchedMachine.UpdatedBy = userId;
                matchedMachine.UpdatedDate = DateTime.Now;
                unitOfWork.TransactionMachineHdRepos.Update(matchedMachine);

                matchCount++;
            }

            if (matchCount > 0)
                await unitOfWork.SaveChangeAsync();

            return matchCount;
        }

        #endregion

        #region Quality/Output Mapping

        private async Task<List<(string Quality, string Output, string BnType)>> LoadQualityOutputConfigAsync()
        {
            var configs = await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync("BSS_QUALITY_OUTPUT");
            var mappings = new List<(string Quality, string Output, string BnType)>();

            foreach (var config in configs)
            {
                if (string.IsNullOrEmpty(config.ConfigValue)) continue;

                // รูปแบบ: ConfigCode = Quality, ConfigValue = "Output,BnType"
                var parts = config.ConfigValue.Split(',');
                if (parts.Length >= 2)
                {
                    mappings.Add((config.ConfigCode, parts[0].Trim(), parts[1].Trim()));
                }
            }

            return mappings;
        }

        private static string? ResolveQualityOutputMapping(
            string quality, string output,
            List<(string Quality, string Output, string BnType)> mappings)
        {
            var match = mappings.FirstOrDefault(m =>
                string.Equals(m.Quality, quality, StringComparison.OrdinalIgnoreCase)
                && string.Equals(m.Output, output, StringComparison.OrdinalIgnoreCase));

            return match.BnType;
        }

        #endregion

        #region Helpers

        private async Task SafeMoveFileAsync(string source, string dest)
        {
            try
            {
                var destDir = Path.GetDirectoryName(dest)?.Replace('\\', '/');
                if (!string.IsNullOrEmpty(destDir))
                {
                    await ftpService.EnsureDirectoryExistsAsync(destDir);
                }

                await ftpService.MoveFileAsync(source, dest);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to move file from {Source} to {Dest}", source, dest);
            }
        }

        private static string BuildRenamedDestPath(string sourceFilePath, string destBaseDir)
        {
            var fileName = Path.GetFileNameWithoutExtension(sourceFilePath);
            var ext = Path.GetExtension(sourceFilePath);
            var now = DateTime.Now;
            var monthFolder = now.ToString("yyyy-MM");
            var stamp = now.ToString("yyyyMMddHHmmss");
            var newName = $"{fileName}-{stamp}{ext}";
            return $"{destBaseDir.TrimEnd('/')}/{monthFolder}/{newName}";
        }

        private static readonly DateTime duplicateCutoff = DateTime.Now.AddDays(-7);

        private static DateTime ParseDateTime(string value)
        {
            if (DateTime.TryParse(value, out var result))
                return result;
            return DateTime.MinValue;
        }

        private static string? AppendRemark(string? existing, string newRemark)
        {
            if (string.IsNullOrEmpty(existing))
                return newRemark;
            return $"{existing}; {newRemark}";
        }

        #endregion
    }
}
