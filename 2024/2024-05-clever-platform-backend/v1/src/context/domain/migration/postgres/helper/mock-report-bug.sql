BEGIN;

INSERT INTO bug.bug_report
(id, platform, type, version, priority, description, status, created_at, created_by)
VALUES
(1, 'CLMS', 'bug', '1.0', 'สูง', 'CLMS มีปัญหา', 'สร้าง', '2025-03-09', 'cd1592be-7302-4805-a172-86956b0bf2a1'),
(2, 'CLMS Line', 'bug', '1.1', 'ต่ำ', 'CLMS Line มีปัญหา', 'แก้ไขสำเร็จ', '2025-03-10', 'cd1592be-7302-4805-a172-86956b0bf2a1');

INSERT INTO bug.bug_report_status_log
(id, bug_report_id, status, message, created_at, created_by)
VALUES
(1, 2, 'รอตรวจสอบ', 'รอตรวจสอบ', '2025-03-10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(2, 2, 'แก้ไขสำเร็จ', 'แก้ไขสำเร็จ', '2025-03-11', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
COMMIT;