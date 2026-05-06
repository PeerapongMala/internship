CREATE TABLE bss_txn_machine_hd_data (
    machine_data_id BIGINT PRIMARY KEY IDENTITY(1,1), 
    machine_hd_id BIGINT NOT NULL,                 
    denom_id NVARCHAR(8) NOT NULL,
    denom_name NVARCHAR(50) NOT NULL,
    denom_currency NVARCHAR(5),
    denom_value INT NOT NULL,
    denom_quality NVARCHAR(8) NOT NULL,
    denom_output NVARCHAR(10) NOT NULL,
    denom_num INT NOT NULL,
    is_active BIT,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
        
    CONSTRAINT FK_txn_machine_hd_data_txn_machine_hd FOREIGN KEY (machine_hd_id) REFERENCES bss_txn_machine_hd(machine_hd_id)
);