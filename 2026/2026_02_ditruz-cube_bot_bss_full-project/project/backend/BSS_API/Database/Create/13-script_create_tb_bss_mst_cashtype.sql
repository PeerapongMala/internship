CREATE TABLE bss_mst_cashtype (
    cashtype_id INT IDENTITY(1,1) PRIMARY KEY, 
    cashtype_code NVARCHAR(10) NOT NULL UNIQUE,       
    cashtype NVARCHAR(10) NOT NULL,            
    cashtype_descrpt NVARCHAR(30),             
    is_active BIT,                             
    created_by INT,                            
    created_date DATETIME NOT NULL DEFAULT GETDATE(), 
    updated_by INT,                            
    updated_date DATETIME                      
);