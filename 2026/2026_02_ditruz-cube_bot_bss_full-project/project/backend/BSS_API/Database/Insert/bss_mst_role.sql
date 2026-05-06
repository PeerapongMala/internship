INSERT INTO [bss_mst_role]
   (
      role_group_id ,
      role_code     ,
      role_name     ,
      role_descript ,
      seq_no        ,
      is_get_otp_sup,
      is_get_otp_man,
      is_active     ,
      created_by    ,
      created_date
   )
VALUES
(1, N'ROL01', N'Operator-Prepare', N'Operator-Prepare', 1, 0, 0, 1,1,CURRENT_TIMESTAMP),
(1, N'ROL02', N'Operator-Reconcile', N'Operator-Reconcile', 2, 0, 0, 1,1,CURRENT_TIMESTAMP),
(2, N'ROL03', N'Supervisor', N'Supervisor', 3, 1, 0, 1,1,CURRENT_TIMESTAMP),
(3, N'ROL04', N'Manager', N'Manager', 4, 0, 1, 1,1,CURRENT_TIMESTAMP),
(4, N'ROL05', N'Administrator', N'Administrator', 5, 0, 0, 1,1,CURRENT_TIMESTAMP),
(5, N'ROL06', N'Administrator CCC', N'Administrator CCC', 6, 0, 0, 1,1,CURRENT_TIMESTAMP),
(6, N'ROL07', N'Technician', N'Technician', 7, 0, 0, 1,1,CURRENT_TIMESTAMP),
(7, N'ROL08', N'Analyst', N'Analyst', 8, 0, 0, 1,1,CURRENT_TIMESTAMP),
(8, N'ROL09', N'Banknote Staff', N'Banknote Staff', 9, 0, 0, 1,1,CURRENT_TIMESTAMP);