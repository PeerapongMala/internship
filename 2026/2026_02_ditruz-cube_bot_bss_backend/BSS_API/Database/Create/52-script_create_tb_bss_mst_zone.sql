CREATE TABLE bss_mst_zone (
    zone_id INT IDENTITY(1,1) PRIMARY KEY,
    department_id INT NOT NULL,
    inst_id INT NULL,
    zone_code NVARCHAR(5) NOT NULL,
    zone_name NVARCHAR(100) NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,

    CONSTRAINT FK_bss_mst_zone_dept FOREIGN KEY (department_id)
    REFERENCES bss_mst_bn_operation_center (department_id),
    CONSTRAINT FK_bss_mst_zone_inst FOREIGN KEY (inst_id)
    REFERENCES bss_mst_institution (inst_id),
    CONSTRAINT UQ_department_zone_code UNIQUE(department_id,zone_code)
    
);