INSERT INTO [dbo].[bss_mst_menu]
   (
      [menu_name]      ,
      [menu_path]      ,
      [display_order]  ,
      [controller_name],
      [action_name]    ,
      [parent_menu_id] ,
      [is_active]      ,
      [created_by]     ,
      [created_date]   ,
      [updated_by]     ,
      [updated_date]
   )
VALUES
-- ===== Parent Menu =====
(N'Pre-Preparation Unsort', N'/PrePreparationUnsort/Index', 1, N'PrePreparationUnsort', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Preparation', N'/Preparation/Index', 2, N'Preparation', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Reconciliation', N'/Reconciliation/Index', 3, N'Reconciliation', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Auto Selling', N'/AutoSelling/Index', 4, N'AutoSelling', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Revoke', N'/Revoke/Index', 5, N'Revoke', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Approve Manual Key-in', N'/ApproveManualKeyIn/Index', 6, N'ApproveManualKeyIn', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'ฉุกเฉิน', N'/Emergency/Index', 7, N'Emergency', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'รายงาน', N'/Report/Index', 8, N'Report', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'User and Access', N'/MasterData/Index', 9, N'MasterData', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Machine', N'/MasterData/Index', 10, N'MasterData', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Institution and Banknote', N'/MasterData/Index', 11, N'MasterData', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Setting', N'/MasterData/Index', 12, N'MasterData', N'Index', NULL, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== Pre-Preparation Unsort SUB-MENU (Parent = 1) =====
(N'ลงทะเบียนธนบัตร Unsort', N'/PrePreparationUnsort/RegisterUnsort', 13, N'PrePreparationUnsort', N'RegisterUnsort', 1, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'ส่งมอบ Unsort CC', N'/PrePreparationUnsort/RegisterUnsortDeliver', 14, N'PrePreparationUnsort', N'RegisterUnsortDeliver', 1, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'รับมอบ Unsort CC', N'/PrePreparationUnsort/RegisterUnsortReceive', 15, N'PrePreparationUnsort', N'RegisterUnsortReceive', 1, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== Preparation SUB-MENU (Parent = 2) =====
(N'Preparation Unfit', N'/Preparation/PreparationUnfit', 16, N'Preparation', N'PreparationUnfit', 2, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Preparation Unsort CA Non Member', N'/Preparation/PreparationUnsortCANonMember', 17, N'Preparation', N'PreparationUnsortCANonMember', 2, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Preparation Unsort CA Member', N'/Preparation/PreparationUnsortCAMember', 18, N'Preparation', N'PreparationUnsortCAMember', 2, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Operation Prepare Setting', N'/Main/OperationSetting', 19, N'Main', N'OperationSetting', 2, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== Reconciliation SUB-MENU (Parent = 3) =====
(N'Reconciliation Transaction', N'/Reconciliation/ReconciliationTransaction', 20, N'Reconciliation', N'ReconciliationTransaction', 3, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Operation Reconciliation Setting', N'/Main/OperationSetting', 21, N'Main', N'OperationSetting', 3, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== Auto Selling SUB-MENU (Parent = 4) =====
(N'Auto Selling', N'/AutoSelling/AutoSelling', 22, N'AutoSelling', N'AutoSelling', 4, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Operation Verify Setting', N'/Main/VerifySetting', 23, N'Main', N'VerifySetting', 4, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== Auto Selling SUB-MENU (Parent = 7) =====
(N'Import Emergency Data', N'/Emergency/ImportEmergencyData', 24, N'Emergency', N'ImportEmergencyData', 7, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== REPORT SUB-MENU (Parent = 8) =====
(N'Single Header Card Report', N'/Report/SingleHeaderCard', 25, N'Report', N'SingleHeaderCard', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Multi Header Card Report', N'/Report/MultiHeaderCard', 26, N'Report', N'MultiHeaderCard', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Container Report', N'/Report/Container', 27, N'Report', N'Container', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Monthly Report (คิดค่าใช้จ่าย)', N'/Report/Monthly', 28, N'Report', N'Monthly', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Abnormal Report', N'/Report/Abnormal', 29, N'Report', N'Abnormal', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Machine Data Report', N'/Report/MachineData', 30, N'Report', N'MachineData', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Bank Summary Report', N'/Report/BankSummary', 31, N'Report', N'BankSummary', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Cashpoint/Cashcenter Report', N'/Report/CashPointCenter', 32, N'Report', N'CashPointCenter', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Out of Balance Report', N'/Report/OutOfBalance', 33, N'Report', N'OutOfBalance', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Multi Header Card by Machine Data Report', N'/Report/MultiHeaderByMachine', 34, N'Report', N'MultiHeaderByMachine', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Multi Machine Report', N'/Report/MultiMachine', 35, N'Report', N'MultiMachine', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Analytics Report', N'/Report/Analytics', 36, N'Report', N'Analytics', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Application Log Report', N'/Report/ApplicationLog', 37, N'Report', N'ApplicationLog', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Operation Log Report', N'/Report/OperationLog', 38, N'Report', N'OperationLog', 8, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== USER AND ACCESS SUB-MENU(Parent = 9) =====
(N'Master Company', N'/MasterCompany/Index', 39, N'MasterCompany', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Company Department', N'/MasterCompanyDepartment/Index', 40, N'MasterCompanyDepartment', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Department', N'/MasterDepartment/Index', 41, N'MasterDepartment', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Menu', N'/MasterMenu/Index', 42, N'MasterMenu', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Role Group', N'/MasterRoleGroup/Index', 43, N'MasterRoleGroup', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Role', N'/MasterRole/Index', 44, N'MasterRole', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Role Permission', N'/MasterRolePermission/Index', 45, N'MasterRolePermission', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master User', N'/MasterUser/Index', 46, N'MasterUser', N'Index', 9, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== MACHINE SUB-MENU (Parent = 10) =====
(N'Master Machine Type', N'/MasterMachineType/Index', 47, N'MasterMachineType', N'Index', 10, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master M7 Output Data', N'/MasterMachineSevenOutput/Index', 48, N'MasterMachineSevenOutput', N'Index', 10, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master M7 Quality', N'/MasterM7Quality/Index', 49, N'MasterM7Quality', N'Index', 10, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Machine', N'/MasterMachine/Index', 50, N'MasterMachine', N'Index', 10, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== INSTITUTION & BANKNOTE (Parent = 11) =====
(N'Master Institution', N'/MasterInstitution/Index', 51, N'MasterInstitution', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Company Institution', N'/MasterCompanyInstitution/Index', 52, N'MasterCompanyInstitution', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Cash Center', N'/MasterCashCenter/Index', 53, N'MasterCashCenter', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Cash Point', N'/MasterCashPoint/Index', 54, N'MasterCashPoint', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Series Denom', N'/MasterSeriesDenom/Index', 55, N'MasterSeriesDenom', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master M7Denom Series', N'/MasterM7DenomSeries/Index', 56, N'MasterM7DenomSeries', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Denomination', N'/MasterDenomination/Index', 57, N'MasterDenomination', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Banknote Type', N'/MasterBanknoteType/Index', 58, N'MasterBanknoteType', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Banknote Type Send', N'/MasterBanknoteTypeSend/Index', 59, N'MasterBanknoteTypeSend', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Denom Reconcile', N'/MasterDenomReconcile/Index', 60, N'MasterDenomReconcile', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master M7 Denomination', N'/MasterM7Denomination/Index', 61, N'MasterM7Denomination', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Zone', N'/MasterZone/Index', 62, N'MasterZone', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Zone Cash Point', N'/MasterZoneCashPoint/Index', 63, N'MasterZoneCashPoint', N'Index', 11, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),

-- ===== SETTING (Parent = 12) =====
(N'Master Cash Type', N'/MasterCashType/Index', 64, N'MasterCashType', N'Index', 12, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Config Type', N'/MasterConfigType/Index', 65, N'MasterConfigType', N'Index', 12, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Config', N'/MasterConfig/Index', 66, N'MasterConfig', N'Index', 12, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Status', N'/MasterStatus/Index', 67, N'MasterStatus', N'Index', 12, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Master Shift', N'/MasterShift/Index', 68, N'MasterShift', N'Index', 12, 1, 1, CURRENT_TIMESTAMP, NULL, NULL);