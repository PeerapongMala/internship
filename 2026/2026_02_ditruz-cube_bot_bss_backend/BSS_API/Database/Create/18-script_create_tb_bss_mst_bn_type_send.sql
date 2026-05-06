CREATE TABLE bss_mst_bn_type_send (
    bntype_send_id INT IDENTITY(1,1) PRIMARY KEY,  
    bss_bntype_code NVARCHAR(10) NOT NULL UNIQUE,  
    bntype_send_code NVARCHAR(10) NOT NULL UNIQUE,  
    bntype_send_descrpt NVARCHAR(50),                               
    is_active BIT,                                      
    created_by INT,                                     
    created_date DATETIME NOT NULL DEFAULT GETDATE(),   
    updated_by INT,                                     
    updated_date DATETIME                              
);