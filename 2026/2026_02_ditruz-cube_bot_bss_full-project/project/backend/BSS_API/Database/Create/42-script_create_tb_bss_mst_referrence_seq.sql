CREATE TABLE bss_mst_referrence_seq (
    referrence_seq_id INTEGER IDENTITY(1,1) PRIMARY KEY,
    department_id INTEGER NOT NULL,
    seq_no INTEGER NULL,
    is_active BIT NULL,
    created_by INTEGER NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL,
    updated_date DATETIME NULL,
        
    CONSTRAINT FK_department_id_ref_seq FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id)
);