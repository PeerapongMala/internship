CREATE TABLE bss_txn_receive_cbms_data (
    receive_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    department_id INT NOT NULL,
    bn_type_input NVARCHAR(3),
    barcode NVARCHAR(20),
    container_id NVARCHAR(20),
    send_date DATETIME,
    inst_id INT NOT NULL,
    deno_id INT NOT NULL,
    qty INT,
        remaining_qty INTEGER,
    cb_bdc_code NVARCHAR(5),
    created_by INT NOT NULL,
    created_date DATETIME NOT NULL,
    updated_by INT NULL,
    updated_date DATETIME,
    CONSTRAINT FK_receive_department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center (department_id),
    CONSTRAINT FK_receive_institution FOREIGN KEY (inst_id)
        REFERENCES bss_mst_institution (inst_id),
    CONSTRAINT FK_receive_denomination FOREIGN KEY (deno_id)
        REFERENCES bss_mst_denomination (deno_id)
);