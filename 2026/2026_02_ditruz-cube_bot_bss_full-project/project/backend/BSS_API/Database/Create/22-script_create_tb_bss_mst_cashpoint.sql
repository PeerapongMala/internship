CREATE TABLE bss_mst_cashpoint (
    cashpoint_id INT IDENTITY(1,1) PRIMARY KEY,
    inst_id INT NOT NULL,
    department_id INT NOT NULL,
    cashpoint_name NVARCHAR(150) NOT NULL,
    branch_code NVARCHAR(10) NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_cashpoint_institution FOREIGN KEY (inst_id)
        REFERENCES bss_mst_institution (inst_id),
    CONSTRAINT FK_cashpoint_department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center (department_id),
   CONSTRAINT UQ_cashpoint_inst_id_branch_code UNIQUE (inst_id,branch_code)
);