
CREATE TABLE bss_mst_menu(
    menu_id INT PRIMARY KEY IDENTITY(1,1),
    menu_name NVARCHAR(100) NOT NULL, 
    menu_path NVARCHAR(500) NOT NULL, 
    display_order INT NOT NULL DEFAULT 0,
    controller_name NVARCHAR(100),
    action_name NVARCHAR(100),
    parent_menu_id INT,
    is_active BIT NOT NULL DEFAULT 1,
    created_by INT,
    created_date  DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME
   
);