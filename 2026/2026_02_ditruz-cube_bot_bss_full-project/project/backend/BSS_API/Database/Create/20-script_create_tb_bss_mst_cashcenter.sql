CREATE TABLE bss_mst_cashcenter (
    cashcenter_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    department_id INT NOT NULL,
    inst_id INT NOT NULL,
    cashcenter_code NVARCHAR(10) NOT NULL,
    cashcenter_name NVARCHAR(100) NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL,
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_mst_cashcenter_department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center (department_id),
    CONSTRAINT FK_bss_mst_cashcenter_institution FOREIGN KEY (inst_id)
        REFERENCES bss_mst_institution (inst_id),
   CONSTRAINT UQ_inst_cashcenter_code UNIQUE (inst_id, cashcenter_code)

);