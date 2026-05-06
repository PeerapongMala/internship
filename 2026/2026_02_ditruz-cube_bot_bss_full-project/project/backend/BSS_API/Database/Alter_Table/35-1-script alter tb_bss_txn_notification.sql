-- Alter Table bss_txn_notification
alter table bss_txn_notification
add otp_code nvarchar(10) null,
otp_ref_code nvarchar(10) null,
otp_date datetime null;

ALTER COLUMN notification_type_code VARCHAR(255);