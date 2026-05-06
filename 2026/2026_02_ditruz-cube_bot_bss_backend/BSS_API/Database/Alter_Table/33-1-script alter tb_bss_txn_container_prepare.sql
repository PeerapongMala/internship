-- Add Column  Table bss_txn_container_prepare
Alter Table bss_txn_container_prepare
Add receive_id BIGINT null,
register_unsort_id BIGINT null;

-- Add Constraint table bss_txn_container_prepare;
Alter Table bss_txn_container_prepare
Add Constraint FK_bss_txn_package_prepare_receive_cbms FOREIGN KEY (receive_id) REFERENCES  bss_txn_receive_cbms_data(receive_id);

Alter Table bss_txn_container_prepare
Add Constraint FK_bss_txn_package_prepare_reg_unsort FOREIGN KEY (register_unsort_id) REFERENCES bss_txn_register_unsort (register_unsort_id);