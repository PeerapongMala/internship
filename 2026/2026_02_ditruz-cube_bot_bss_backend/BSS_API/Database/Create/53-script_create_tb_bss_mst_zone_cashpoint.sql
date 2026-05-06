CREATE TABLE bss_mst_zone_cashpoint (
    zone_cashpoint_id INT IDENTITY(1,1) PRIMARY KEY,
    zone_id INT NOT NULL,
    cashpoint_id INT NOT NULL,
    is_active BIT NULL,
    created_by INT NULL,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT NULL,
    updated_date DATETIME NULL,
    
	CONSTRAINT FK_bss_mst_zone_cashpoint_zone FOREIGN KEY (zone_id)
	REFERENCES bss_mst_zone (zone_id),
	CONSTRAINT FK_bss_mst_zone_cashpoint_cp FOREIGN KEY (cashpoint_id)
	REFERENCES bss_mst_cashpoint (cashpoint_id),
	CONSTRAINT UQ_zone_cashpoint UNIQUE(zone_id,cashpoint_id)

);