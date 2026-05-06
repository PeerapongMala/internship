CREATE TABLE bss_txn_noti_recipient (
    recipient_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    notification_id BIGINT NOT NULL,
    user_id INTEGER NOT NULL,
    sent_status BIT,
    created_by INTEGER,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER,
    updated_date DATETIME,
    CONSTRAINT FK_NotiRecipient_Notification FOREIGN KEY (notification_id) REFERENCES bss_txn_notification(notification_id)
    );