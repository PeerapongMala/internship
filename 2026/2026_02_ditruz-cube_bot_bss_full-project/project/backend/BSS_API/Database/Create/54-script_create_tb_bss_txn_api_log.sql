CREATE TABLE bss_txn_api_log (
    api_log_id      BIGINT IDENTITY(1,1) PRIMARY KEY,
    department_id   INT NOT NULL,
    system_code     NVARCHAR(10) NOT NULL,
    service_name    NVARCHAR(50) NOT NULL,
    api_request     NVARCHAR(MAX) NOT NULL,
    api_response    NVARCHAR(MAX) NOT NULL,
    api_result      BIT,
    remark          NVARCHAR(500),
    created_by      INT,
    created_date    DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by      INT,
    updated_date    DATETIME,

    CONSTRAINT FK_bss_txn_api_log_department 
    FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id)
);

