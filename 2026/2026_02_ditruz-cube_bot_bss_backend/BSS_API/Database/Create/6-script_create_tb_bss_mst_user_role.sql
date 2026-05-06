CREATE TABLE bss_mst_user_role(
    user_role_id INT PRIMARY KEY IDENTITY(1,1) ,
    user_id INT NOT NULL,
    role_group_id INT NOT NULL,
    assigned_date DATETIME NOT NULL DEFAULT GETDATE(),
    is_active BIT NOT NULL DEFAULT 1,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    
    CONSTRAINT FK_UserRoles_Roles_Group FOREIGN KEY (role_group_id) REFERENCES bss_mst_role_group (role_group_id),
    CONSTRAINT UQ_UserRoles UNIQUE (user_id, role_group_id)
);