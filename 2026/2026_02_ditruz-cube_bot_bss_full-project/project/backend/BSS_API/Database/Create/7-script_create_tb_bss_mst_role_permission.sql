CREATE TABLE bss_mst_role_permission(
    role_permission_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    menu_id INT NOT NULL,
    assigned_date DATETIME NOT NULL DEFAULT GETDATE(),
    is_active BIT NOT NULL DEFAULT 1,
    created_by INT,
    created_date DATETIME NOT NULL DEFAULT GETDATE(),
    updated_by INT,
    updated_date DATETIME,
    CONSTRAINT FK_RoleMenuPermissions_Roles FOREIGN KEY (role_id) REFERENCES bss_mst_role(role_id) ON DELETE CASCADE,
    CONSTRAINT FK_RoleMenuPermissions_Menus FOREIGN KEY (menu_id) REFERENCES bss_mst_menu(menu_id) ON DELETE CASCADE,
    CONSTRAINT UQ_RoleMenuPermissions UNIQUE (role_id, menu_id)
);