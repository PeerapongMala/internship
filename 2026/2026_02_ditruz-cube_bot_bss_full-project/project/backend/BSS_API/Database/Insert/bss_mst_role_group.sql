INSERT INTO [bss_mst_role_group]
   (
      role_group_code,
      role_group_name,
      is_active      ,
      created_by     ,
      created_date
   )
VALUES
  (N'RG01',N'Operator', 1, 1, CURRENT_TIMESTAMP),
  (N'RG02',N'Supervisor', 1, 1, CURRENT_TIMESTAMP),
  (N'RG03',N'Manager', 1, 1, CURRENT_TIMESTAMP),
  (N'RG04',N'Administrator', 1, 1, CURRENT_TIMESTAMP),
  (N'RG05',N'Administrator (CCC)', 1, 1, CURRENT_TIMESTAMP),
  (N'RG06',N'Technician', 1, 1, CURRENT_TIMESTAMP),
  (N'RG07',N'Analyst', 1, 1, CURRENT_TIMESTAMP),
  (N'RG08',N'Banknote Staff', 1, 1, CURRENT_TIMESTAMP);