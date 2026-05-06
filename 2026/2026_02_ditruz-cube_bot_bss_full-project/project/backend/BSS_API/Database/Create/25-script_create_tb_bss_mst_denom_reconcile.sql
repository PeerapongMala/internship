CREATE TABLE bss_mst_denom_reconcile (
    denom_reconcile_id INT IDENTITY(1,1) PRIMARY KEY,
    deno_id INT NOT NULL,
    department_id INT NOT NULL,
    series_denom_id INT NOT NULL,
    seq_no INT NULL,
    is_default BIT NULL,
    is_display BIT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
	
	CONSTRAINT FK_bss_mst_denom_reconcile_deno FOREIGN KEY (deno_id)
	REFERENCES bss_mst_denomination (deno_id),
	CONSTRAINT FK_bss_mst_denom_reconcile_dept FOREIGN KEY (department_id)
	REFERENCES bss_mst_bn_operation_center (department_id),
	CONSTRAINT FK_bss_mst_denom_reconcile_series FOREIGN KEY (series_denom_id)
	REFERENCES bss_mst_series_denom (series_denom_id),
	CONSTRAINT UQ_deno_department_series_denom UNIQUE (deno_id,department_id,series_denom_id)

);