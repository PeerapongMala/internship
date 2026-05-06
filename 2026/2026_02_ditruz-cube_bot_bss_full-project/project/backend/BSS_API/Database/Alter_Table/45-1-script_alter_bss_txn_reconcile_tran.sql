ALTER TABLE bss_txn_reconcile_tran
Drop column created_by;

ALTER TABLE bss_txn_reconcile_tran
    ADD created_by int not null;