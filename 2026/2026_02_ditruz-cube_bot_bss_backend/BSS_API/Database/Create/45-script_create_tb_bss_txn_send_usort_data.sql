CREATE TABLE bss_txn_send_unsort_data (
    send_data_id BIGINT PRIMARY KEY IDENTITY(1,1),
    send_unsort_id BIGINT NOT NULL,
    register_unsort_id BIGINT NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_send_unsort_id FOREIGN KEY (send_unsort_id) REFERENCES bss_txn_send_unsort_cc(send_unsort_id),
    CONSTRAINT FK_register_unsort_id FOREIGN KEY (register_unsort_id) REFERENCES bss_txn_register_unsort(register_unsort_id)
);