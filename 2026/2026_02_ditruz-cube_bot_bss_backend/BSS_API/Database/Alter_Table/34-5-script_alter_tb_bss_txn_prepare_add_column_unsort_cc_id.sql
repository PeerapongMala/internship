-- Modify Column Table bss_txn_prepare
ALTER TABLE bss_txn_prepare
Add unsort_cc_id BIGINT Null;


ALTER TABLE bss_txn_prepare
Add Constraint FK_bss_txn_prepare_unsort_cc_id_txn_unsort_cc 
Foreign Key (unsort_cc_id)
References bss_txn_unsort_cc (unsort_cc_id);
