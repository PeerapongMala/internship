-- Modify Column Table bss_txn_container_prepare
ALTER TABLE bss_txn_container_prepare
Drop Constraint FK_bss_txn_package_prepare_reg_unsort;

ALTER TABLE bss_txn_container_prepare
Drop column register_unsort_id;
