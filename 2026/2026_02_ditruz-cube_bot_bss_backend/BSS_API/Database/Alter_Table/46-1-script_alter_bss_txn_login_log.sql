Alter Table bss_txn_login_log
    Add Constraint FK_bss_txn_login_log_user FOREIGN KEY (user_id) REFERENCES  bss_mst_user(user_id);