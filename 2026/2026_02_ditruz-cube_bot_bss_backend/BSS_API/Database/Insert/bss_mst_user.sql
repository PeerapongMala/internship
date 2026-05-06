INSERT INTO [bss_mst_user]
   (
      [department_id]   ,
      [username]        ,
      [username_display],
      [id_no]           ,
      [user_mail]       ,
      [first_name]      ,
      [last_name]       ,
      [is_internal]     ,
      [start_date]      ,
      [end_date]        ,
      [is_active]       ,
      [created_by]      ,
      [created_date]
   )
VALUES
  (1,N'765c4180-cd37-4a7d-97ff-25bcbb68facb',N'WIRACHAR',NULL,'WIRACHAR@bot.or.th',N'Wiracha',N'Ratanapairojkul',1 ,'2025-05-01 00:01:00','2025-12-31 23:59:00',1,999,CURRENT_TIMESTAMP),
  (3,N'19751',N'BSSTestByWattana',1411800089999,'wattana.kon@cubeofnine.com',N'Wattana',N'Kongkaew',0,'2025-05-01 00:01:00','2025-12-31 23:59:00',1,999,CURRENT_TIMESTAMP);