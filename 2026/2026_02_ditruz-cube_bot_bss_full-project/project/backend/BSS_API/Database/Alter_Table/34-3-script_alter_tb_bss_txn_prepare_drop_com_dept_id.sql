-- alter table bss_txn_prepare
alter table bss_txn_prepare
drop constraint FK_bss_txn_prepare_company_dept;

alter table bss_txn_prepare
drop column com_dept_id;

