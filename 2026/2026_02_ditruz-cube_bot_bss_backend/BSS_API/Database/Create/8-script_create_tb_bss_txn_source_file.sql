CREATE TABLE bss_txn_source_file (
    source_file_id BIGINT PRIMARY KEY IDENTITY(1,1),
    machine_id INT NOT NULL,
    file_name NVARCHAR(150),
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_bss_txn_source_file_machine_id
    FOREIGN KEY (machine_id)
    REFERENCES bss_mst_machine(machine_id)
);