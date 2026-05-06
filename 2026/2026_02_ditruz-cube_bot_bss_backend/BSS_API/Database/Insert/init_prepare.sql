/* Unfit */
/* insert into cbms  */
/* cash type = 2  */

/* การสร้าง Barcode ห่อ 18 หลัก
• หลักที่ 1-3: รหัสธนาคาร
หลักที่ 4-6: รหัส ศูนย์เงินสด (CCC) ของ Bardcode ห่อมันคือ code ของศูนย์เงินสดที่จัดการธนบัตร หรือ เขาเรียก CCC ให้เอา company_id , department_id 
	ไปค้นที่ตาราง mst_company_department เอา column  cb_bcd_code ที่ is_active =  1 มา gen barcode
• หลักที่ 7: รหัสประเภทธนบัตร
• หลักที่ 8: รหัสชนิด */

INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'U', N'002001220000001025', N'BK22525', N'2026-01-25 10:00:00.000', 3, 3, 0, 5, N'4435', 1, N'2026-01-25 10:00:00.000', 4, N'2026-01-25 10:00:00.000', 5);

    INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'U', N'001002230000001225', N'BK22525', N'2026-01-25 10:00:00.000', 2, 4, 0, 5, N'4435', 1, N'2026-01-25 10:00:00.000', 4, N'2026-01-25 10:00:00.000', 5);
/*--------------------------------------------------------*/
/* Ca non member */
/* insert into cbms  */
/* cash type = 3  */
/* cb_bdc_code = 155 308 */

    INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'A', null, N'BK69111', N'2026-02-09 10:00:00.000', 3, 2, 15000, 15000, N'155', 1, N'2026-02-09 10:00:00.000', 4, N'2026-02-09 10:00:00.000', 0);

INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'A', null, N'BK69111', N'2026-02-09 10:00:00.000', 4, 3, 15000, 15000, N'308', 1, N'2026-02-09 10:00:00.000', 4, N'2026-02-09 10:00:00.000', 0);

/*--------------------------------------------------------*/
/* Ca member */
/* insert into cbms  */
/* cash type = 3  */
/* cb_bdc_code = 401 403 */

INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'A', null, N'BK22001', N'2026-01-07 10:00:00.000', 3, 4, 5000, 5000, N'401', 1, N'2026-01-07 10:00:00.000', 4, N'2026-01-07 10:00:00.000', 0);

INSERT INTO BSSDEVDB.dbo.bss_txn_receive_cbms_data
(department_id, bn_type_input, barcode, container_id, send_date, inst_id, deno_id, qty, remaining_qty, cb_bdc_code, created_by, created_date, updated_by, updated_date, unfit_qty)
VALUES (1, N'A', null, N'BK22001', N'2026-01-07 10:00:00.000', 4, 5, 10000, 10000, N'403', 1, N'2026-01-07 10:00:00.000', 4, N'2026-01-07 10:00:00.000', 0);

/*--------------------------------------------------------*/

/* insert into register unsort and unsort cc  */
/* insert bss_txn_register_unsort ค่อย insert unsort cc  */
INSERT INTO BSSDEVDB.dbo.bss_txn_register_unsort (container_code, department_id, is_active, status_id, supervisor_received, received_date, remark, created_by, created_date, updated_by, updated_date) VALUES (N'PP03333', 1, 1, 1, null, N'2026-01-13 10:00:00.000', null, 999, N'2026-01-13 10:00:00.000', null, null);

/* register id 5 */
/* นำ id ของ register id มาใส่ที่ register_unsort_id  */
INSERT INTO BSSDEVDB.dbo.bss_txn_unsort_cc (register_unsort_id, inst_id, deno_id, banknote_qty, remaining_qty, is_active, created_by, created_date, updated_by, updated_date) VALUES (10027, 3, 3, 10, 10, 1, 1, N'2026-01-13 10:00:00.000', 1, N'2026-01-13 10:00:00.000');
INSERT INTO BSSDEVDB.dbo.bss_txn_unsort_cc (register_unsort_id, inst_id, deno_id, banknote_qty, remaining_qty, is_active, created_by, created_date, updated_by, updated_date) VALUES (10027, 4, 4, 5, 5, 1, 1, N'2026-01-13 10:00:00.000', 1, N'2026-01-13 10:00:00.000');