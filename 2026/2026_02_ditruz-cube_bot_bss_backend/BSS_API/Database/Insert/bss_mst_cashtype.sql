INSERT INTO bss_mst_cashtype
   (
      cashtype_code   ,
      cashtype        ,
      cashtype_descrpt,
      is_active       ,
      created_by      ,
      created_date
   )
VALUES
(N'1',N'Fit',N'ธนบัตรปิดผนึก',1,1,CURRENT_TIMESTAMP),
(N'2',N'Unfit',N'ธนบัตรรอนับ',1,1,CURRENT_TIMESTAMP),
(N'3',N'Good',N'ธนบัตรดี ธปท.',1,1,CURRENT_TIMESTAMP),
(N'4',N'Unsort',N'ธนบัตรรอคัด',1,1,CURRENT_TIMESTAMP);