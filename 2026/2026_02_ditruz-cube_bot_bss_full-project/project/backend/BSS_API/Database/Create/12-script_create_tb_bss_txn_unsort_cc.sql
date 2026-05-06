CREATE TABLE bss_txn_unsort_cc (
    unsort_cc_id BIGINT PRIMARY KEY IDENTITY(1,1), 
    register_unsort_id BIGINT NOT NULL,
    inst_id INT NOT NULL,
    deno_id INTEGER NOT NULL,
    banknote_qty INTEGER NOT NULL,
    remaining_qty INTEGER NOT NULL,
    is_active BIT NULL, 
    created_by INTEGER NULL, 
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INTEGER NULL, 
    updated_date DATETIME NULL,
    
	CONSTRAINT FK_unsortcc_register FOREIGN KEY (register_unsort_id)
	REFERENCES bss_txn_register_unsort (register_unsort_id),
	CONSTRAINT FK_unsortcc_institution FOREIGN KEY (inst_id)
	REFERENCES bss_mst_institution (inst_id),
	CONSTRAINT FK_unsortcc_denomination_id FOREIGN KEY (deno_id)
	REFERENCES bss_mst_denomination (deno_id)

);

