USE [BSSDEVDB]
GO
/****** Object:  Table [dbo].[bss_mst_bn_operation_center]    Script Date: 12/01/2569 18:59:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bss_mst_bn_operation_center](
    [department_id] [int] IDENTITY(1,1) NOT NULL,
    [department_code] [nvarchar](20) NOT NULL,
    [dept_short_name] [nvarchar](20) NOT NULL,
    [department_name] [nvarchar](100) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[department_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_bn_type]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_bn_type](
    [bntype_id] [int] IDENTITY(1,1) NOT NULL,
    [bntype_name] [nvarchar](30) NOT NULL,
    [bntype_descrpt] [nvarchar](50) NULL,
    [is_display] [bit] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [bntype_code] [nvarchar](3) NOT NULL,
    [bss_bntype_code] [nvarchar](3) NOT NULL,
    PRIMARY KEY CLUSTERED
(
[bntype_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[bntype_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_bn_type_send]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_bn_type_send](
    [bntype_send_id] [int] IDENTITY(1,1) NOT NULL,
    [bss_bntype_code] [nvarchar](10) NOT NULL,
    [bntype_send_code] [nvarchar](10) NOT NULL,
    [bntype_send_descrpt] [nvarchar](50) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[bntype_send_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[bss_bntype_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[bntype_send_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_cashcenter]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_cashcenter](
    [cashcenter_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [inst_id] [int] NOT NULL,
    [cashcenter_code] [nvarchar](10) NOT NULL,
    [cashcenter_name] [nvarchar](100) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[cashcenter_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_inst_cashcenter_code] UNIQUE NONCLUSTERED
(
    [inst_id] ASC,
[cashcenter_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_cashpoint]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_cashpoint](
    [cashpoint_id] [int] IDENTITY(1,1) NOT NULL,
    [inst_id] [int] NOT NULL,
    [department_id] [int] NOT NULL,
    [cashpoint_name] [nvarchar](150) NOT NULL,
    [branch_code] [nvarchar](10) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[cashpoint_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_cashpoint_inst_id_branch_code] UNIQUE NONCLUSTERED
(
    [inst_id] ASC,
[branch_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_cashtype]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_cashtype](
    [cashtype_id] [int] IDENTITY(1,1) NOT NULL,
    [cashtype_code] [nvarchar](10) NOT NULL,
    [cashtype] [nvarchar](10) NOT NULL,
    [cashtype_descrpt] [nvarchar](30) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[cashtype_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[cashtype_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_company]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_company](
    [company_id] [int] IDENTITY(1,1) NOT NULL,
    [company_code] [nvarchar](10) NOT NULL,
    [company_name] [nvarchar](100) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[company_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[company_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_company_department]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_company_department](
    [com_dept_id] [int] IDENTITY(1,1) NOT NULL,
    [company_id] [int] NOT NULL,
    [department_id] [int] NOT NULL,
    [cb_bcd_code] [nvarchar](10) NOT NULL,
    [start_date] [datetime] NOT NULL,
    [end_date] [datetime] NOT NULL,
    [is_send_unsort_cc] [bit] NOT NULL,
    [is_prepare_central] [bit] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[com_dept_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_company_institution]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_company_institution](
    [company_inst_id] [int] IDENTITY(1,1) NOT NULL,
    [company_id] [int] NOT NULL,
    [inst_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[company_inst_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_config]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_config](
    [config_id] [int] IDENTITY(1,1) NOT NULL,
    [config_type_id] [int] NOT NULL,
    [config_code] [nvarchar](50) NOT NULL,
    [config_value] [nvarchar](300) NULL,
    [config_descript] [nvarchar](300) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[config_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[config_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_config_type]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_config_type](
    [config_type_id] [int] IDENTITY(1,1) NOT NULL,
    [config_type_code] [nvarchar](50) NOT NULL,
    [config_type_descrpt] [nvarchar](300) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[config_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[config_type_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_denom_reconcile]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_denom_reconcile](
    [denom_reconcile_id] [int] IDENTITY(1,1) NOT NULL,
    [deno_id] [int] NOT NULL,
    [department_id] [int] NOT NULL,
    [series_denom_id] [int] NOT NULL,
    [seq_no] [int] NULL,
    [is_default] [bit] NULL,
    [is_display] [bit] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[denom_reconcile_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_deno_department_series_denom] UNIQUE NONCLUSTERED
(
    [deno_id] ASC,
    [department_id] ASC,
[series_denom_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_denomination]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_denomination](
    [deno_id] [int] IDENTITY(1,1) NOT NULL,
    [deno_code] [int] NOT NULL,
    [deno_price] [int] NOT NULL,
    [deno_descrpt] [nvarchar](20) NULL,
    [deno_currency] [nvarchar](10) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[deno_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[deno_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_institution]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_institution](
    [inst_id] [int] IDENTITY(1,1) NOT NULL,
    [inst_code] [nvarchar](10) NOT NULL,
    [bank_code] [nvarchar](10) NOT NULL,
    [inst_short_name] [nvarchar](100) NOT NULL,
    [inst_name_th] [nvarchar](150) NOT NULL,
    [inst_name_en] [nvarchar](100) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[inst_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UK_bss_mst_inst_bank_code] UNIQUE NONCLUSTERED
(
    [inst_code] ASC,
[bank_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_m7_denom]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_m7_denom](
    [m7_denom_id] [int] IDENTITY(1,1) NOT NULL,
    [deno_id] [int] NOT NULL,
    [m7_denom_code] [nvarchar](10) NOT NULL,
    [m7_denom_name] [nvarchar](20) NOT NULL,
    [m7_denom_descrpt] [nvarchar](30) NOT NULL,
    [m7_denom_bms] [nvarchar](10) NULL,
    [m7_dn_bms] [nvarchar](10) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[m7_denom_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_m7denom_deno_id_denom_code_denom_name] UNIQUE NONCLUSTERED
(
    [deno_id] ASC,
    [m7_denom_code] ASC,
[m7_denom_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_m7_quality]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_m7_quality](
    [m7_quality_id] [int] IDENTITY(1,1) NOT NULL,
    [m7_quality_code] [nvarchar](15) NOT NULL,
    [m7_quality_descrpt] [nvarchar](50) NULL,
    [m7_quality_cps] [nvarchar](15) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[m7_quality_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_m7denom_series]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_m7denom_series](
    [m7denom_series_id] [int] IDENTITY(1,1) NOT NULL,
    [m7_denom_id] [int] NOT NULL,
    [series_denom_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[m7denom_series_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_m7output]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_m7output](
    [m7output_id] [int] IDENTITY(1,1) NOT NULL,
    [m7output_code] [nvarchar](10) NOT NULL,
    [m7output_descrpt] [nvarchar](50) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[m7output_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[m7output_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_machine]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_machine](
    [machine_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [machine_type_id] [int] NOT NULL,
    [machine_code] [nvarchar](20) NOT NULL,
    [machine_name] [nvarchar](30) NOT NULL,
    [hc_length] [int] NULL,
    [pathname_bss] [nvarchar](300) NULL,
    [is_emergency] [bit] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[machine_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[machine_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_machine_type]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_machine_type](
    [machine_type_id] [int] IDENTITY(1,1) NOT NULL,
    [machine_type_code] [nvarchar](10) NOT NULL,
    [machine_type_name] [nvarchar](20) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[machine_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[machine_type_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_menu]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_menu](
    [menu_id] [int] IDENTITY(1,1) NOT NULL,
    [menu_name] [nvarchar](100) NOT NULL,
    [menu_path] [nvarchar](500) NOT NULL,
    [display_order] [int] NOT NULL,
    [controller_name] [nvarchar](100) NULL,
    [action_name] [nvarchar](100) NULL,
    [parent_menu_id] [int] NULL,
    [is_active] [bit] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[menu_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_referrence_seq]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_referrence_seq](
    [referrence_seq_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [seq_no] [int] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[referrence_seq_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_role]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_role](
    [role_id] [int] IDENTITY(1,1) NOT NULL,
    [role_group_id] [int] NOT NULL,
    [role_code] [nvarchar](10) NOT NULL,
    [role_name] [nvarchar](50) NULL,
    [role_descript] [nvarchar](100) NULL,
    [seq_no] [int] NULL,
    [is_get_otp_sup] [bit] NULL,
    [is_get_otp_man] [bit] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[role_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_role_group]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_role_group](
    [role_group_id] [int] IDENTITY(1,1) NOT NULL,
    [role_group_code] [nvarchar](10) NOT NULL,
    [role_group_name] [nvarchar](50) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[role_group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[role_group_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_role_permission]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_role_permission](
    [role_permission_id] [int] IDENTITY(1,1) NOT NULL,
    [role_id] [int] NOT NULL,
    [menu_id] [int] NOT NULL,
    [assigned_date] [datetime] NOT NULL,
    [is_active] [bit] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[role_permission_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_RoleMenuPermissions] UNIQUE NONCLUSTERED
(
    [role_id] ASC,
[menu_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_send_unsort_seq]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_send_unsort_seq](
    [send_seq_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [send_seq_no] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[send_seq_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_series_denom]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_series_denom](
    [series_denom_id] [int] IDENTITY(1,1) NOT NULL,
    [series_code] [nvarchar](5) NOT NULL,
    [series_descrpt] [nvarchar](50) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[series_denom_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[series_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_shift]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_shift](
    [shift_id] [int] IDENTITY(1,1) NOT NULL,
    [shift_code] [nvarchar](10) NOT NULL,
    [shift_name] [nvarchar](20) NULL,
    [start_time] [nvarchar](10) NOT NULL,
    [end_time] [nvarchar](10) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[shift_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[shift_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_status]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_status](
    [status_id] [int] IDENTITY(1,1) NOT NULL,
    [status_code] [nvarchar](10) NOT NULL,
    [status_name_th] [nvarchar](50) NOT NULL,
    [status_name_en] [nvarchar](30) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[status_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[status_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_user]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_user](
    [user_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [username] [nvarchar](40) NOT NULL,
    [username_display] [nvarchar](30) NULL,
    [id_no] [nvarchar](15) NULL,
    [user_mail] [nvarchar](100) NOT NULL,
    [first_name] [nvarchar](50) NOT NULL,
    [last_name] [nvarchar](50) NULL,
    [is_internal] [bit] NULL,
    [start_date] [datetime] NOT NULL,
    [end_date] [datetime] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[user_mail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED
(
[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_user_role]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_user_role](
    [user_role_id] [int] IDENTITY(1,1) NOT NULL,
    [user_id] [int] NOT NULL,
    [role_group_id] [int] NOT NULL,
    [assigned_date] [datetime] NOT NULL,
    [is_active] [bit] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[user_role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_UserRoles] UNIQUE NONCLUSTERED
(
    [user_id] ASC,
[role_group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_zone]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_zone](
    [zone_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [inst_id] [int] NULL,
    [zone_code] [nvarchar](5) NOT NULL,
    [zone_name] [nvarchar](100) NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[zone_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_department_zone_code] UNIQUE NONCLUSTERED
(
    [department_id] ASC,
[zone_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_mst_zone_cashpoint]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_mst_zone_cashpoint](
    [zone_cashpoint_id] [int] IDENTITY(1,1) NOT NULL,
    [zone_id] [int] NOT NULL,
    [cashpoint_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[zone_cashpoint_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UQ_zone_cashpoint] UNIQUE NONCLUSTERED
(
    [zone_id] ASC,
[cashpoint_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_api_log]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_api_log](
    [api_log_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [system_code] [nvarchar](10) NOT NULL,
    [service_name] [nvarchar](50) NOT NULL,
    [api_request] [nvarchar](max) NOT NULL,
    [api_response] [nvarchar](max) NOT NULL,
    [api_result] [bit] NULL,
    [remark] [nvarchar](500) NULL,
    [created_by] [nvarchar](50) NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[api_log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_application_log]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_application_log](
    [app_log_id] [bigint] IDENTITY(1,1) NOT NULL,
    [user_id] [int] NOT NULL,
    [app_controller] [nvarchar](100) NOT NULL,
    [app_action] [nvarchar](100) NOT NULL,
    [app_param] [nvarchar](max) NOT NULL,
    [app_result] [nvarchar](max) NOT NULL,
    [remark] [nvarchar](500) NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[app_log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_container_prepare]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_container_prepare](
    [container_prepare_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [machine_id] [int] NULL,
    [container_code] [nvarchar](10) NOT NULL,
    [bntype_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [receive_id] [bigint] NULL,
    PRIMARY KEY CLUSTERED
(
[container_prepare_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_container_seq]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_container_seq](
    [container_seq_id] [int] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [inst_id] [int] NOT NULL,
    [cashcenter_id] [int] NULL,
    [zone_id] [int] NULL,
    [cashpoint_id] [int] NULL,
    [deno_id] [int] NOT NULL,
    [container_type] [nvarchar](100) NULL,
    [seq_no] [int] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[container_seq_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_login_log]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_login_log](
    [login_log_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [user_id] [int] NOT NULL,
    [machine_id] [int] NULL,
    [first_login] [datetime] NULL,
    [last_login] [datetime] NULL,
    [remark] [nvarchar](100) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[login_log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_machine_hd]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_machine_hd](
    [machine_hd_id] [bigint] IDENTITY(1,1) NOT NULL,
    [source_file_id] [bigint] NULL,
    [department_id] [int] NOT NULL,
    [machine_id] [int] NULL,
    [header_card_code] [nvarchar](15) NOT NULL,
    [start_time] [datetime] NOT NULL,
    [end_time] [datetime] NOT NULL,
    [deposit_id] [nvarchar](15) NULL,
    [is_reject] [nvarchar](5) NULL,
    [is_active] [bit] NULL,
    [seq_no] [int] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [remark] [nvarchar](300) NULL,
    [machine_qty] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[machine_hd_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_machine_hd_data]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_machine_hd_data](
    [machine_data_id] [bigint] IDENTITY(1,1) NOT NULL,
    [machine_hd_id] [bigint] NOT NULL,
    [denom_id] [nvarchar](8) NOT NULL,
    [denom_name] [nvarchar](50) NOT NULL,
    [denom_currency] [nvarchar](5) NULL,
    [denom_value] [int] NOT NULL,
    [denom_quality] [nvarchar](8) NOT NULL,
    [denom_output] [nvarchar](10) NOT NULL,
    [denom_num] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[machine_data_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_manual_history]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_manual_history](
    [manual_his_id] [bigint] IDENTITY(1,1) NOT NULL,
    [reconcile_id] [bigint] NOT NULL,
    [old_deno_price] [int] NOT NULL,
    [new_deno_price] [int] NOT NULL,
    [old_bn_type] [nvarchar](10) NOT NULL,
    [new_bn_type] [nvarchar](10) NOT NULL,
    [old_denom_series] [nvarchar](10) NOT NULL,
    [new_denom_series] [nvarchar](10) NOT NULL,
    [old_qty] [int] NOT NULL,
    [new_qty] [int] NOT NULL,
    [old_value] [int] NOT NULL,
    [new_value] [int] NOT NULL,
    [sup_action] [nvarchar](5) NOT NULL,
    [manager_id] [int] NULL,
    [officer_id] [int] NULL,
    [is_manual_key] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[manual_his_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_manual_tmp]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_manual_tmp](
    [manual_tmp_id] [bigint] IDENTITY(1,1) NOT NULL,
    [reconcile_tran_id] [bigint] NOT NULL,
    [reconcile_id] [bigint] NULL,
    [deno_price] [int] NOT NULL,
    [bn_type] [nvarchar](10) NOT NULL,
    [denom_series] [nvarchar](10) NOT NULL,
    [tmp_qty] [int] NOT NULL,
    [tmp_value] [int] NOT NULL,
    [tmp_action] [nvarchar](5) NOT NULL,
    [manual_date] [datetime] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[manual_tmp_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_noti_recipient]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_noti_recipient](
    [recipient_id] [bigint] IDENTITY(1,1) NOT NULL,
    [notification_id] [bigint] NOT NULL,
    [user_id] [int] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [is_read] [bit] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[recipient_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_notification]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_notification](
    [notification_id] [bigint] IDENTITY(1,1) NOT NULL,
    [notification_type_code] [varchar](255) NULL,
    [department_id] [int] NOT NULL,
    [message] [nvarchar](255) NOT NULL,
    [is_sent] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [otp_code] [nvarchar](10) NULL,
    [otp_ref_code] [nvarchar](10) NULL,
    [otp_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[notification_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_operation_log]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_operation_log](
    [operation_log_id] [int] IDENTITY(1,1) NOT NULL,
    [user_id] [int] NOT NULL,
    [operation_page] [nvarchar](100) NOT NULL,
    [operation_controller] [nvarchar](100) NOT NULL,
    [operation_action] [nvarchar](100) NOT NULL,
    [operation_param] [nvarchar](max) NOT NULL,
    [operation_result] [nvarchar](30) NOT NULL,
    [remark] [nvarchar](500) NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[operation_log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_prepare]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_prepare](
    [prepare_id] [bigint] IDENTITY(1,1) NOT NULL,
    [container_prepare_id] [bigint] NOT NULL,
    [header_card_code] [nvarchar](15) NOT NULL,
    [bundle_code] [nvarchar](30) NOT NULL,
    [inst_id] [int] NOT NULL,
    [cashcenter_id] [int] NULL,
    [zone_id] [int] NULL,
    [cashpoint_id] [int] NULL,
    [deno_id] [int] NOT NULL,
    [qty] [int] NOT NULL,
    [remark] [nvarchar](300) NULL,
    [status_id] [int] NOT NULL,
    [prepare_date] [datetime] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [is_reconcile] [bit] NULL,
    [package_code] [nvarchar](20) NOT NULL,
    [unsort_cc_id] [bigint] NULL,
    PRIMARY KEY CLUSTERED
(
[prepare_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_receive_cbms_data]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_receive_cbms_data](
    [receive_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [bn_type_input] [nvarchar](3) NULL,
    [barcode] [nvarchar](20) NULL,
    [container_id] [nvarchar](20) NULL,
    [send_date] [datetime] NULL,
    [inst_id] [int] NOT NULL,
    [deno_id] [int] NOT NULL,
    [qty] [int] NULL,
    [remaining_qty] [int] NULL,
    [cb_bdc_code] [nvarchar](5) NULL,
    [created_by] [nvarchar](20) NOT NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [unfit_qty] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[receive_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_reconcile]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_reconcile](
    [reconcile_id] [bigint] IDENTITY(1,1) NOT NULL,
    [reconcile_tran_id] [bigint] NOT NULL,
    [bn_type] [nvarchar](10) NOT NULL,
    [denom_series] [nvarchar](10) NOT NULL,
    [deno_price] [int] NOT NULL,
    [qty] [int] NOT NULL,
    [total_value] [int] NOT NULL,
    [is_replace_t] [bit] NULL,
    [is_replace_c] [bit] NULL,
    [adjust_type] [nvarchar](5) NULL,
    [is_normal] [bit] NULL,
    [is_addon] [bit] NULL,
    [is_endjam] [bit] NULL,
    [adjust_by] [int] NULL,
    [adjust_date] [datetime] NULL,
    [manual_by] [int] NULL,
    [manual_date] [datetime] NULL,
    [verify_by] [int] NULL,
    [verify_date] [datetime] NULL,
    [is_send_cbms] [bit] NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[reconcile_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_reconcile_hc_tmp]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_reconcile_hc_tmp](
    [reconcile_tmp_hc_id] [bigint] IDENTITY(1,1) NOT NULL,
    [reconcile_tran_id] [bigint] NOT NULL,
    [header_card_code] [nvarchar](15) NOT NULL,
    [bn_type] [nvarchar](10) NOT NULL,
    [denom_series] [nvarchar](10) NOT NULL,
    [deno_price] [int] NOT NULL,
    [tmp_qty] [int] NOT NULL,
    [tmp_value] [int] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [update_date] [datetime] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[reconcile_tmp_hc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_reconcile_tmp]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_reconcile_tmp](
    [reconcile_tmp_id] [bigint] IDENTITY(1,1) NOT NULL,
    [reconcile_tran_id] [bigint] NOT NULL,
    [bn_type] [nvarchar](10) NOT NULL,
    [denom_series] [nvarchar](10) NOT NULL,
    [deno_price] [int] NOT NULL,
    [tmp_qty] [int] NOT NULL,
    [tmp_value] [int] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [update_date] [datetime] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[reconcile_tmp_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_reconcile_tran]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_reconcile_tran](
    [reconcile_tran_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [prepare_id] [bigint] NOT NULL,
    [machine_hd_id] [bigint] NOT NULL,
    [header_card_code] [nvarchar](15) NULL,
    [header_parent_id] [bigint] NULL,
    [m7_qty] [int] NULL,
    [reconcile_qty] [int] NULL,
    [sup_qty] [int] NULL,
    [bundle_num] [int] NULL,
    [rec_total_value] [int] NULL,
    [status_id] [int] NOT NULL,
    [approve_by] [int] NULL,
    [approve_date] [datetime] NULL,
    [reference_code] [nvarchar](20) NULL,
    [sorter_id] [int] NULL,
    [shift_id] [int] NOT NULL,
    [remark] [nvarchar](300) NULL,
    [alert_remark] [nvarchar](1000) NULL,
    [is_display] [bit] NULL,
    [is_active] [bit] NULL,
    [is_revoke] [bit] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [created_by] [int] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[reconcile_tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_register_unsort]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_register_unsort](
    [register_unsort_id] [bigint] IDENTITY(1,1) NOT NULL,
    [container_code] [nvarchar](10) NOT NULL,
    [department_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [status_id] [int] NOT NULL,
    [supervisor_received] [int] NULL,
    [received_date] [datetime] NULL,
    [remark] [nvarchar](300) NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[register_unsort_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_send_unsort_cc]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_send_unsort_cc](
    [send_unsort_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [send_unsort_code] [nvarchar](20) NOT NULL,
    [remark] [nvarchar](200) NULL,
    [ref_code] [nvarchar](10) NOT NULL,
    [old_ref_code] [nvarchar](10) NULL,
    [status_id] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [send_date] [datetime] NULL,
    [received_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[send_unsort_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_send_unsort_cc_history]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_send_unsort_cc_history](
    [his_unsort_id] [bigint] IDENTITY(1,1) NOT NULL,
    [department_id] [int] NOT NULL,
    [send_unsort_code] [nvarchar](20) NOT NULL,
    [ref_code] [nvarchar](10) NOT NULL,
    [old_ref_code] [nvarchar](10) NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [send_unsort_id] [bigint] NOT NULL,
    CONSTRAINT [PK_bss_txn_send_unsort_cc_history] PRIMARY KEY CLUSTERED
(
[his_unsort_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_send_unsort_data]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_send_unsort_data](
    [send_data_id] [bigint] IDENTITY(1,1) NOT NULL,
    [send_unsort_id] [bigint] NOT NULL,
    [register_unsort_id] [bigint] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[send_data_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_send_unsort_data_history]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_send_unsort_data_history](
    [his_data_id] [bigint] IDENTITY(1,1) NOT NULL,
    [his_unsort_id] [bigint] NOT NULL,
    [register_unsort_id] [bigint] NOT NULL,
    [container_code] [nvarchar](10) NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    CONSTRAINT [PK_bss_txn_send_unsort_data_history] PRIMARY KEY CLUSTERED
(
[his_data_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_source_file]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_source_file](
    [source_file_id] [bigint] IDENTITY(1,1) NOT NULL,
    [machine_id] [int] NOT NULL,
    [file_name] [nvarchar](150) NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    [remark] [nvarchar](300) NULL,
    [is_error] [bit] NULL,
    PRIMARY KEY CLUSTERED
(
[source_file_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_unsort_cc]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_unsort_cc](
    [unsort_cc_id] [bigint] IDENTITY(1,1) NOT NULL,
    [register_unsort_id] [bigint] NOT NULL,
    [inst_id] [int] NOT NULL,
    [deno_id] [int] NOT NULL,
    [banknote_qty] [int] NOT NULL,
    [remaining_qty] [int] NOT NULL,
    [is_active] [bit] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[unsort_cc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_unsort_cc_history]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_unsort_cc_history](
    [his_cc_id] [bigint] IDENTITY(1,1) NOT NULL,
    [his_data_id] [bigint] NOT NULL,
    [inst_id] [int] NOT NULL,
    [deno_id] [int] NOT NULL,
    [banknote_qty] [int] NOT NULL,
    [remaining_qty] [int] NOT NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NOT NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    CONSTRAINT [PK_bss_txn_unsort_cc_history] PRIMARY KEY CLUSTERED
(
[his_cc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[bss_txn_user_history]    Script Date: 12/01/2569 18:59:34 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[bss_txn_user_history](
    [user_his_id] [int] IDENTITY(1,1) NOT NULL,
    [user_id] [int] NOT NULL,
    [department_id] [int] NOT NULL,
    [role_group_id] [int] NOT NULL,
    [username] [nvarchar](40) NOT NULL,
    [user_mail] [nvarchar](100) NULL,
    [first_name] [nvarchar](50) NOT NULL,
    [last_name] [nvarchar](50) NULL,
    [is_internal] [bit] NULL,
    [start_date] [datetime] NULL,
    [end_date] [datetime] NULL,
    [user_created_date] [datetime] NULL,
    [created_by] [int] NULL,
    [created_date] [datetime] NULL,
    [updated_by] [int] NULL,
    [updated_date] [datetime] NULL,
    PRIMARY KEY CLUSTERED
(
[user_his_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
ALTER TABLE [dbo].[bss_mst_bn_operation_center] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_bn_type] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_bn_type_send] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_cashpoint] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_cashtype] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_company] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_company_department] ADD  DEFAULT ((0)) FOR [is_send_unsort_cc]
    GO
ALTER TABLE [dbo].[bss_mst_company_department] ADD  DEFAULT ((0)) FOR [is_prepare_central]
    GO
ALTER TABLE [dbo].[bss_mst_company_department] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_company_institution] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_config] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_config_type] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_denomination] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_institution] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_m7_denom] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_m7_quality] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_m7denom_series] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_m7output] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_machine] ADD  DEFAULT ((0)) FOR [is_emergency]
    GO
ALTER TABLE [dbo].[bss_mst_machine] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_machine_type] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_menu] ADD  DEFAULT ((0)) FOR [display_order]
    GO
ALTER TABLE [dbo].[bss_mst_menu] ADD  DEFAULT ((1)) FOR [is_active]
    GO
ALTER TABLE [dbo].[bss_mst_menu] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_referrence_seq] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_role] ADD  DEFAULT ((0)) FOR [seq_no]
    GO
ALTER TABLE [dbo].[bss_mst_role] ADD  DEFAULT ((0)) FOR [is_get_otp_sup]
    GO
ALTER TABLE [dbo].[bss_mst_role] ADD  DEFAULT ((0)) FOR [is_get_otp_man]
    GO
ALTER TABLE [dbo].[bss_mst_role] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_role_group] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_role_permission] ADD  DEFAULT (getdate()) FOR [assigned_date]
    GO
ALTER TABLE [dbo].[bss_mst_role_permission] ADD  DEFAULT ((1)) FOR [is_active]
    GO
ALTER TABLE [dbo].[bss_mst_role_permission] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_send_unsort_seq] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_series_denom] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_shift] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_status] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_user] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_user_role] ADD  DEFAULT (getdate()) FOR [assigned_date]
    GO
ALTER TABLE [dbo].[bss_mst_user_role] ADD  DEFAULT ((1)) FOR [is_active]
    GO
ALTER TABLE [dbo].[bss_mst_user_role] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_zone] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_zone_cashpoint] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_api_log] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_application_log] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_login_log] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd_data] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_manual_history] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_noti_recipient] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_noti_recipient] ADD  DEFAULT ((0)) FOR [is_read]
    GO
ALTER TABLE [dbo].[bss_txn_notification] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_operation_log] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_prepare] ADD  DEFAULT ((0)) FOR [is_reconcile]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile] ADD  DEFAULT ((0)) FOR [is_replace_t]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile] ADD  DEFAULT ((0)) FOR [is_replace_c]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile] ADD  DEFAULT ((0)) FOR [is_send_cbms]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] ADD  DEFAULT ((1)) FOR [is_display]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_register_unsort] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc_history] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data_history] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_source_file] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_source_file] ADD  DEFAULT ((0)) FOR [is_error]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history] ADD  DEFAULT (getdate()) FOR [created_date]
    GO
ALTER TABLE [dbo].[bss_mst_cashcenter]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_cashcenter_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_cashcenter] CHECK CONSTRAINT [FK_bss_mst_cashcenter_department]
    GO
ALTER TABLE [dbo].[bss_mst_cashcenter]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_cashcenter_institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_mst_cashcenter] CHECK CONSTRAINT [FK_bss_mst_cashcenter_institution]
    GO
ALTER TABLE [dbo].[bss_mst_cashpoint]  WITH CHECK ADD  CONSTRAINT [FK_cashpoint_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_cashpoint] CHECK CONSTRAINT [FK_cashpoint_department]
    GO
ALTER TABLE [dbo].[bss_mst_cashpoint]  WITH CHECK ADD  CONSTRAINT [FK_cashpoint_institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_mst_cashpoint] CHECK CONSTRAINT [FK_cashpoint_institution]
    GO
ALTER TABLE [dbo].[bss_mst_company_department]  WITH CHECK ADD  CONSTRAINT [FK_BMSCD_Company] FOREIGN KEY([company_id])
    REFERENCES [dbo].[bss_mst_company] ([company_id])
    GO
ALTER TABLE [dbo].[bss_mst_company_department] CHECK CONSTRAINT [FK_BMSCD_Company]
    GO
ALTER TABLE [dbo].[bss_mst_company_department]  WITH CHECK ADD  CONSTRAINT [FK_BMSCD_Department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_company_department] CHECK CONSTRAINT [FK_BMSCD_Department]
    GO
ALTER TABLE [dbo].[bss_mst_company_institution]  WITH CHECK ADD  CONSTRAINT [FK_Com_Inst_Company] FOREIGN KEY([company_id])
    REFERENCES [dbo].[bss_mst_company] ([company_id])
    GO
ALTER TABLE [dbo].[bss_mst_company_institution] CHECK CONSTRAINT [FK_Com_Inst_Company]
    GO
ALTER TABLE [dbo].[bss_mst_company_institution]  WITH CHECK ADD  CONSTRAINT [FK_Com_Inst_Institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_mst_company_institution] CHECK CONSTRAINT [FK_Com_Inst_Institution]
    GO
ALTER TABLE [dbo].[bss_mst_config]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_config_config_type_id] FOREIGN KEY([config_type_id])
    REFERENCES [dbo].[bss_mst_config_type] ([config_type_id])
    GO
ALTER TABLE [dbo].[bss_mst_config] CHECK CONSTRAINT [FK_bss_mst_config_config_type_id]
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_denom_reconcile_deno] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile] CHECK CONSTRAINT [FK_bss_mst_denom_reconcile_deno]
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_denom_reconcile_dept] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile] CHECK CONSTRAINT [FK_bss_mst_denom_reconcile_dept]
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_denom_reconcile_series] FOREIGN KEY([series_denom_id])
    REFERENCES [dbo].[bss_mst_series_denom] ([series_denom_id])
    GO
ALTER TABLE [dbo].[bss_mst_denom_reconcile] CHECK CONSTRAINT [FK_bss_mst_denom_reconcile_series]
    GO
ALTER TABLE [dbo].[bss_mst_m7_denom]  WITH CHECK ADD  CONSTRAINT [FK_m7_denom_denomination] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_mst_m7_denom] CHECK CONSTRAINT [FK_m7_denom_denomination]
    GO
ALTER TABLE [dbo].[bss_mst_m7denom_series]  WITH CHECK ADD  CONSTRAINT [FK_series_M7Denom] FOREIGN KEY([m7_denom_id])
    REFERENCES [dbo].[bss_mst_m7_denom] ([m7_denom_id])
    GO
ALTER TABLE [dbo].[bss_mst_m7denom_series] CHECK CONSTRAINT [FK_series_M7Denom]
    GO
ALTER TABLE [dbo].[bss_mst_m7denom_series]  WITH CHECK ADD  CONSTRAINT [FK_series_SeriesDenom] FOREIGN KEY([series_denom_id])
    REFERENCES [dbo].[bss_mst_series_denom] ([series_denom_id])
    GO
ALTER TABLE [dbo].[bss_mst_m7denom_series] CHECK CONSTRAINT [FK_series_SeriesDenom]
    GO
ALTER TABLE [dbo].[bss_mst_machine]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_machine_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_machine] CHECK CONSTRAINT [FK_bss_mst_machine_department]
    GO
ALTER TABLE [dbo].[bss_mst_machine]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_machine_machine_type] FOREIGN KEY([machine_type_id])
    REFERENCES [dbo].[bss_mst_machine_type] ([machine_type_id])
    GO
ALTER TABLE [dbo].[bss_mst_machine] CHECK CONSTRAINT [FK_bss_mst_machine_machine_type]
    GO
ALTER TABLE [dbo].[bss_mst_referrence_seq]  WITH CHECK ADD  CONSTRAINT [FK_department_id_ref_seq] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_referrence_seq] CHECK CONSTRAINT [FK_department_id_ref_seq]
    GO
ALTER TABLE [dbo].[bss_mst_role]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_role_group] FOREIGN KEY([role_group_id])
    REFERENCES [dbo].[bss_mst_role_group] ([role_group_id])
    GO
ALTER TABLE [dbo].[bss_mst_role] CHECK CONSTRAINT [FK_bss_mst_role_group]
    GO
ALTER TABLE [dbo].[bss_mst_role_permission]  WITH CHECK ADD  CONSTRAINT [FK_RoleMenuPermissions_Menus] FOREIGN KEY([menu_id])
    REFERENCES [dbo].[bss_mst_menu] ([menu_id])
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[bss_mst_role_permission] CHECK CONSTRAINT [FK_RoleMenuPermissions_Menus]
    GO
ALTER TABLE [dbo].[bss_mst_role_permission]  WITH CHECK ADD  CONSTRAINT [FK_RoleMenuPermissions_Roles] FOREIGN KEY([role_id])
    REFERENCES [dbo].[bss_mst_role] ([role_id])
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[bss_mst_role_permission] CHECK CONSTRAINT [FK_RoleMenuPermissions_Roles]
    GO
ALTER TABLE [dbo].[bss_mst_send_unsort_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_send_unsort_seq_department_id] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_send_unsort_seq] CHECK CONSTRAINT [FK_bss_mst_send_unsort_seq_department_id]
    GO
ALTER TABLE [dbo].[bss_mst_user]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_user_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_user] CHECK CONSTRAINT [FK_bss_mst_user_department]
    GO
ALTER TABLE [dbo].[bss_mst_user_role]  WITH CHECK ADD  CONSTRAINT [FK_UserRoles_Roles_Group] FOREIGN KEY([role_group_id])
    REFERENCES [dbo].[bss_mst_role_group] ([role_group_id])
    GO
ALTER TABLE [dbo].[bss_mst_user_role] CHECK CONSTRAINT [FK_UserRoles_Roles_Group]
    GO
ALTER TABLE [dbo].[bss_mst_zone]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_zone_dept] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_mst_zone] CHECK CONSTRAINT [FK_bss_mst_zone_dept]
    GO
ALTER TABLE [dbo].[bss_mst_zone]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_zone_inst] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_mst_zone] CHECK CONSTRAINT [FK_bss_mst_zone_inst]
    GO
ALTER TABLE [dbo].[bss_mst_zone_cashpoint]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_zone_cashpoint_cp] FOREIGN KEY([cashpoint_id])
    REFERENCES [dbo].[bss_mst_cashpoint] ([cashpoint_id])
    GO
ALTER TABLE [dbo].[bss_mst_zone_cashpoint] CHECK CONSTRAINT [FK_bss_mst_zone_cashpoint_cp]
    GO
ALTER TABLE [dbo].[bss_mst_zone_cashpoint]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_zone_cashpoint_zone] FOREIGN KEY([zone_id])
    REFERENCES [dbo].[bss_mst_zone] ([zone_id])
    GO
ALTER TABLE [dbo].[bss_mst_zone_cashpoint] CHECK CONSTRAINT [FK_bss_mst_zone_cashpoint_zone]
    GO
ALTER TABLE [dbo].[bss_txn_api_log]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_api_log_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_api_log] CHECK CONSTRAINT [FK_bss_txn_api_log_department]
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_package_prepare_bntype] FOREIGN KEY([bntype_id])
    REFERENCES [dbo].[bss_mst_bn_type] ([bntype_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare] CHECK CONSTRAINT [FK_bss_txn_package_prepare_bntype]
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_package_prepare_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare] CHECK CONSTRAINT [FK_bss_txn_package_prepare_department]
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_package_prepare_machine] FOREIGN KEY([machine_id])
    REFERENCES [dbo].[bss_mst_machine] ([machine_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare] CHECK CONSTRAINT [FK_bss_txn_package_prepare_machine]
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_package_prepare_receive_cbms] FOREIGN KEY([receive_id])
    REFERENCES [dbo].[bss_txn_receive_cbms_data] ([receive_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_prepare] CHECK CONSTRAINT [FK_bss_txn_package_prepare_receive_cbms]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_cashcenter] FOREIGN KEY([cashcenter_id])
    REFERENCES [dbo].[bss_mst_cashcenter] ([cashcenter_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_cashcenter]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_cashpoint] FOREIGN KEY([cashpoint_id])
    REFERENCES [dbo].[bss_mst_cashpoint] ([cashpoint_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_cashpoint]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_denomination] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_denomination]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_department]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_institution]
    GO
ALTER TABLE [dbo].[bss_txn_container_seq]  WITH CHECK ADD  CONSTRAINT [FK_bss_mst_package_seq_zone] FOREIGN KEY([zone_id])
    REFERENCES [dbo].[bss_mst_zone] ([zone_id])
    GO
ALTER TABLE [dbo].[bss_txn_container_seq] CHECK CONSTRAINT [FK_bss_mst_package_seq_zone]
    GO
ALTER TABLE [dbo].[bss_txn_login_log]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_login_log_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_login_log] CHECK CONSTRAINT [FK_bss_txn_login_log_department]
    GO
ALTER TABLE [dbo].[bss_txn_login_log]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_login_log_machine] FOREIGN KEY([machine_id])
    REFERENCES [dbo].[bss_mst_machine] ([machine_id])
    GO
ALTER TABLE [dbo].[bss_txn_login_log] CHECK CONSTRAINT [FK_bss_txn_login_log_machine]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd]  WITH CHECK ADD  CONSTRAINT [FK_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd] CHECK CONSTRAINT [FK_department]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd]  WITH CHECK ADD  CONSTRAINT [FK_machine] FOREIGN KEY([machine_id])
    REFERENCES [dbo].[bss_mst_machine] ([machine_id])
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd] CHECK CONSTRAINT [FK_machine]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd]  WITH CHECK ADD  CONSTRAINT [FK_txn_machine_hd_source_file] FOREIGN KEY([source_file_id])
    REFERENCES [dbo].[bss_txn_source_file] ([source_file_id])
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd] CHECK CONSTRAINT [FK_txn_machine_hd_source_file]
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd_data]  WITH CHECK ADD  CONSTRAINT [FK_txn_machine_hd_data_txn_machine_hd] FOREIGN KEY([machine_hd_id])
    REFERENCES [dbo].[bss_txn_machine_hd] ([machine_hd_id])
    GO
ALTER TABLE [dbo].[bss_txn_machine_hd_data] CHECK CONSTRAINT [FK_txn_machine_hd_data_txn_machine_hd]
    GO
ALTER TABLE [dbo].[bss_txn_manual_history]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_id_manual_history] FOREIGN KEY([reconcile_id])
    REFERENCES [dbo].[bss_txn_reconcile] ([reconcile_id])
    GO
ALTER TABLE [dbo].[bss_txn_manual_history] CHECK CONSTRAINT [FK_reconcile_id_manual_history]
    GO
ALTER TABLE [dbo].[bss_txn_manual_tmp]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_id_manual] FOREIGN KEY([reconcile_id])
    REFERENCES [dbo].[bss_txn_reconcile] ([reconcile_id])
    GO
ALTER TABLE [dbo].[bss_txn_manual_tmp] CHECK CONSTRAINT [FK_reconcile_id_manual]
    GO
ALTER TABLE [dbo].[bss_txn_manual_tmp]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_id_manual] FOREIGN KEY([reconcile_tran_id])
    REFERENCES [dbo].[bss_txn_reconcile_tran] ([reconcile_tran_id])
    GO
ALTER TABLE [dbo].[bss_txn_manual_tmp] CHECK CONSTRAINT [FK_reconcile_tran_id_manual]
    GO
ALTER TABLE [dbo].[bss_txn_noti_recipient]  WITH CHECK ADD  CONSTRAINT [FK_NotiRecipient_Notification] FOREIGN KEY([notification_id])
    REFERENCES [dbo].[bss_txn_notification] ([notification_id])
    GO
ALTER TABLE [dbo].[bss_txn_noti_recipient] CHECK CONSTRAINT [FK_NotiRecipient_Notification]
    GO
ALTER TABLE [dbo].[bss_txn_notification]  WITH CHECK ADD  CONSTRAINT [FK_Notification_Department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_notification] CHECK CONSTRAINT [FK_Notification_Department]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_cashcenter] FOREIGN KEY([cashcenter_id])
    REFERENCES [dbo].[bss_mst_cashcenter] ([cashcenter_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_cashcenter]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_cashpoint] FOREIGN KEY([cashpoint_id])
    REFERENCES [dbo].[bss_mst_cashpoint] ([cashpoint_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_cashpoint]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_container_prepare] FOREIGN KEY([container_prepare_id])
    REFERENCES [dbo].[bss_txn_container_prepare] ([container_prepare_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_container_prepare]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_deno] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_deno]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_inst] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_inst]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_status] FOREIGN KEY([status_id])
    REFERENCES [dbo].[bss_mst_status] ([status_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_status]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_unsort_cc_id_txn_unsort_cc] FOREIGN KEY([unsort_cc_id])
    REFERENCES [dbo].[bss_txn_unsort_cc] ([unsort_cc_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_unsort_cc_id_txn_unsort_cc]
    GO
ALTER TABLE [dbo].[bss_txn_prepare]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_prepare_zone] FOREIGN KEY([zone_id])
    REFERENCES [dbo].[bss_mst_zone] ([zone_id])
    GO
ALTER TABLE [dbo].[bss_txn_prepare] CHECK CONSTRAINT [FK_bss_txn_prepare_zone]
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data]  WITH CHECK ADD  CONSTRAINT [FK_receive_denomination] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data] CHECK CONSTRAINT [FK_receive_denomination]
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data]  WITH CHECK ADD  CONSTRAINT [FK_receive_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data] CHECK CONSTRAINT [FK_receive_department]
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data]  WITH CHECK ADD  CONSTRAINT [FK_receive_institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_txn_receive_cbms_data] CHECK CONSTRAINT [FK_receive_institution]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_id_reconcile] FOREIGN KEY([reconcile_tran_id])
    REFERENCES [dbo].[bss_txn_reconcile_tran] ([reconcile_tran_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile] CHECK CONSTRAINT [FK_reconcile_tran_id_reconcile]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_hc_tmp]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_hc_id] FOREIGN KEY([reconcile_tran_id])
    REFERENCES [dbo].[bss_txn_reconcile_tran] ([reconcile_tran_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_hc_tmp] CHECK CONSTRAINT [FK_reconcile_tran_hc_id]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tmp]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_id] FOREIGN KEY([reconcile_tran_id])
    REFERENCES [dbo].[bss_txn_reconcile_tran] ([reconcile_tran_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tmp] CHECK CONSTRAINT [FK_reconcile_tran_id]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] CHECK CONSTRAINT [FK_reconcile_tran_department]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_machine_hd] FOREIGN KEY([machine_hd_id])
    REFERENCES [dbo].[bss_txn_machine_hd] ([machine_hd_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] CHECK CONSTRAINT [FK_reconcile_tran_machine_hd]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_prepare] FOREIGN KEY([prepare_id])
    REFERENCES [dbo].[bss_txn_prepare] ([prepare_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] CHECK CONSTRAINT [FK_reconcile_tran_prepare]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_shift] FOREIGN KEY([shift_id])
    REFERENCES [dbo].[bss_mst_shift] ([shift_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] CHECK CONSTRAINT [FK_reconcile_tran_shift]
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran]  WITH CHECK ADD  CONSTRAINT [FK_reconcile_tran_status] FOREIGN KEY([status_id])
    REFERENCES [dbo].[bss_mst_status] ([status_id])
    GO
ALTER TABLE [dbo].[bss_txn_reconcile_tran] CHECK CONSTRAINT [FK_reconcile_tran_status]
    GO
ALTER TABLE [dbo].[bss_txn_register_unsort]  WITH CHECK ADD  CONSTRAINT [FK_register_unsort_dept] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_register_unsort] CHECK CONSTRAINT [FK_register_unsort_dept]
    GO
ALTER TABLE [dbo].[bss_txn_register_unsort]  WITH CHECK ADD  CONSTRAINT [FK_register_unsort_status] FOREIGN KEY([status_id])
    REFERENCES [dbo].[bss_mst_status] ([status_id])
    GO
ALTER TABLE [dbo].[bss_txn_register_unsort] CHECK CONSTRAINT [FK_register_unsort_status]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_send_unsort_cc_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc] CHECK CONSTRAINT [FK_bss_txn_send_unsort_cc_department]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_send_unsort_cc_status] FOREIGN KEY([status_id])
    REFERENCES [dbo].[bss_mst_status] ([status_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc] CHECK CONSTRAINT [FK_bss_txn_send_unsort_cc_status]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_send_unsort_cc_history_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc_history] CHECK CONSTRAINT [FK_bss_txn_send_unsort_cc_history_department]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc_history]  WITH CHECK ADD  CONSTRAINT [FK_send_unsort_cc_his_send_unsort_id] FOREIGN KEY([send_unsort_id])
    REFERENCES [dbo].[bss_txn_send_unsort_cc] ([send_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_cc_history] CHECK CONSTRAINT [FK_send_unsort_cc_his_send_unsort_id]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data]  WITH CHECK ADD  CONSTRAINT [FK_register_unsort_id] FOREIGN KEY([register_unsort_id])
    REFERENCES [dbo].[bss_txn_register_unsort] ([register_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data] CHECK CONSTRAINT [FK_register_unsort_id]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data]  WITH CHECK ADD  CONSTRAINT [FK_send_unsort_id] FOREIGN KEY([send_unsort_id])
    REFERENCES [dbo].[bss_txn_send_unsort_cc] ([send_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data] CHECK CONSTRAINT [FK_send_unsort_id]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_send_unsort_data_history_main] FOREIGN KEY([his_unsort_id])
    REFERENCES [dbo].[bss_txn_send_unsort_cc_history] ([his_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data_history] CHECK CONSTRAINT [FK_bss_txn_send_unsort_data_history_main]
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_send_unsort_data_history_register] FOREIGN KEY([register_unsort_id])
    REFERENCES [dbo].[bss_txn_register_unsort] ([register_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_send_unsort_data_history] CHECK CONSTRAINT [FK_bss_txn_send_unsort_data_history_register]
    GO
ALTER TABLE [dbo].[bss_txn_source_file]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_source_file_machine_id] FOREIGN KEY([machine_id])
    REFERENCES [dbo].[bss_mst_machine] ([machine_id])
    GO
ALTER TABLE [dbo].[bss_txn_source_file] CHECK CONSTRAINT [FK_bss_txn_source_file_machine_id]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc]  WITH CHECK ADD  CONSTRAINT [FK_unsortcc_denomination_id] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc] CHECK CONSTRAINT [FK_unsortcc_denomination_id]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc]  WITH CHECK ADD  CONSTRAINT [FK_unsortcc_institution] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc] CHECK CONSTRAINT [FK_unsortcc_institution]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc]  WITH CHECK ADD  CONSTRAINT [FK_unsortcc_register] FOREIGN KEY([register_unsort_id])
    REFERENCES [dbo].[bss_txn_register_unsort] ([register_unsort_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc] CHECK CONSTRAINT [FK_unsortcc_register]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_unsort_cc_history_data] FOREIGN KEY([his_data_id])
    REFERENCES [dbo].[bss_txn_send_unsort_data_history] ([his_data_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history] CHECK CONSTRAINT [FK_bss_txn_unsort_cc_history_data]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_unsort_cc_history_deno] FOREIGN KEY([deno_id])
    REFERENCES [dbo].[bss_mst_denomination] ([deno_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history] CHECK CONSTRAINT [FK_bss_txn_unsort_cc_history_deno]
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_unsort_cc_history_inst] FOREIGN KEY([inst_id])
    REFERENCES [dbo].[bss_mst_institution] ([inst_id])
    GO
ALTER TABLE [dbo].[bss_txn_unsort_cc_history] CHECK CONSTRAINT [FK_bss_txn_unsort_cc_history_inst]
    GO
ALTER TABLE [dbo].[bss_txn_user_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_user_history_department] FOREIGN KEY([department_id])
    REFERENCES [dbo].[bss_mst_bn_operation_center] ([department_id])
    GO
ALTER TABLE [dbo].[bss_txn_user_history] CHECK CONSTRAINT [FK_bss_txn_user_history_department]
    GO
ALTER TABLE [dbo].[bss_txn_user_history]  WITH CHECK ADD  CONSTRAINT [FK_bss_txn_user_history_role_group] FOREIGN KEY([role_group_id])
    REFERENCES [dbo].[bss_mst_role_group] ([role_group_id])
    GO
ALTER TABLE [dbo].[bss_txn_user_history] CHECK CONSTRAINT [FK_bss_txn_user_history_role_group]
    GO
