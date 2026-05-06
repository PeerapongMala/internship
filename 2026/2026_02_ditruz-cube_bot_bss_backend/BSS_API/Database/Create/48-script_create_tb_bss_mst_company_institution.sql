CREATE TABLE bss_mst_company_institution (
    company_inst_id INT PRIMARY KEY IDENTITY(1,1),
    company_id INT NOT NULL,
    inst_id INT NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
    CONSTRAINT FK_Com_Inst_Company FOREIGN KEY (company_id)
        REFERENCES bss_mst_company(company_id),
    CONSTRAINT FK_Com_Inst_Institution FOREIGN KEY (inst_id)
        REFERENCES bss_mst_institution(inst_id)
);