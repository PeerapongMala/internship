CREATE TABLE bss_mst_machine (
    machine_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    department_id INT NOT NULL,
    machine_type_id INT NOT NULL,
    machine_code NVARCHAR(20) NOT NULL UNIQUE,
    machine_name NVARCHAR(30) NOT NULL,
    hc_length INT,
    pathname_bss NVARCHAR(300),
    is_emergency BIT DEFAULT 0,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_mst_machine_department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center (department_id),
    CONSTRAINT FK_bss_mst_machine_machine_type FOREIGN KEY (machine_type_id)
        REFERENCES bss_mst_machine_type (machine_type_id)
);