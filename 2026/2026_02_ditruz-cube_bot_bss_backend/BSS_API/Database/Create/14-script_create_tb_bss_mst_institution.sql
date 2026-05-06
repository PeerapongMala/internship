CREATE TABLE bss_mst_institution (
    inst_id INTEGER IDENTITY(1,1) PRIMARY KEY, 
    
    inst_code NVARCHAR(10) NOT NULL,
    
    bank_code NVARCHAR(10) NOT NULL,
    
    inst_short_name NVARCHAR(100) NOT NULL,
    
    inst_name_th NVARCHAR(150) NOT NULL,
    
    inst_name_en NVARCHAR(100) NULL,
    
    is_active BIT NULL, 
    
    created_by INTEGER NULL, 
   
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    
    updated_by INTEGER NULL, 
    
    updated_date DATETIME NULL,
        
    -- *** การแก้ไข: กำหนด Composite Unique Constraint (UK คู่กัน) ***
    -- ทั้ง inst_code และ bank_code รวมกันต้องไม่ซ้ำกัน
    CONSTRAINT UK_bss_mst_inst_bank_code UNIQUE (inst_code, bank_code)
);