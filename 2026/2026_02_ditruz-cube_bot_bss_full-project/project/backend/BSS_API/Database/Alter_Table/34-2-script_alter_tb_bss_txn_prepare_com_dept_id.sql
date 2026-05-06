-- alter table bss_txn_prepare
alter table bss_txn_prepare
add com_dept_id integer null;

alter table bss_txn_prepare
add constraint FK_bss_txn_prepare_company_dept FOREIGN KEY (com_dept_id) REFERENCES bss_mst_company_department (com_dept_id);
