CREATE TABLE bss_mst_company_department (
    com_dept_id INT PRIMARY KEY IDENTITY(1,1),
    company_id INT NOT NULL,
    department_id INT NOT NULL,
        cb_bcd_code NVARCHAR (10) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL, 
    is_send_unsort_cc BIT NOT NULL DEFAULT 0,
    is_prepare_central BIT NOT NULL DEFAULT 0,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
    CONSTRAINT FK_BMSCD_Company FOREIGN KEY (company_id)
        REFERENCES bss_mst_company(company_id),
    CONSTRAINT FK_BMSCD_Department FOREIGN KEY (department_id)
        REFERENCES bss_mst_bn_operation_center(department_id)
);