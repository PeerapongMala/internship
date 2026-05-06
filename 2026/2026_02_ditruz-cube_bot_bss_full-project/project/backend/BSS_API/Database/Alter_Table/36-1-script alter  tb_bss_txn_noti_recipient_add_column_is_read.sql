-- Modify Column Table bss_txn_noti_recipient
ALTER TABLE bss_txn_noti_recipient
Add is_read bit not null default 0;

ALTER TABLE bss_txn_noti_recipient
Drop column sent_status;