-- alter table bss_txn_prepare
alter table bss_txn_prepare
add is_reconcile bit default 0;

-- alter table bss_txn_prepare
alter table bss_txn_prepare
add is_match_machine bit default 0;
