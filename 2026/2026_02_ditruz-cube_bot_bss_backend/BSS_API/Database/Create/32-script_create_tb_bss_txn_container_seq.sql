CREATE TABLE bss_txn_container_seq (
    container_seq_id INT PRIMARY KEY IDENTITY(1,1),
    department_id INT NOT NULL,
    inst_id INT NOT NULL,
    cashcenter_id INT NULL,
    zone_id INT NULL,
    cashpoint_id INT NULL,
    deno_id INT NOT NULL,
    container_type NVARCHAR(100) NULL,
    seq_no INT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
    CONSTRAINT FK_bss_mst_package_seq_department FOREIGN KEY (department_id) REFERENCES bss_mst_bn_operation_center(department_id),
    CONSTRAINT FK_bss_mst_package_seq_institution FOREIGN KEY (inst_id) REFERENCES bss_mst_institution(inst_id),
    CONSTRAINT FK_bss_mst_package_seq_cashcenter FOREIGN KEY (cashcenter_id) REFERENCES bss_mst_cashcenter(cashcenter_id),
    CONSTRAINT FK_bss_mst_package_seq_cashpoint FOREIGN KEY (cashpoint_id) REFERENCES bss_mst_cashpoint(cashpoint_id),
    CONSTRAINT FK_bss_mst_package_seq_denomination FOREIGN KEY (deno_id) REFERENCES bss_mst_denomination(deno_id),
    CONSTRAINT FK_bss_mst_package_seq_zone FOREIGN KEY (zone_id) REFERENCES bss_mst_zone(zone_id)

);