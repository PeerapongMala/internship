INSERT INTO "announcement"."announcement"
(id, school_id, scope, type, started_at, ended_at, title, description, status, created_at, created_by)
VALUES 
(1, 1, 'School', 'system', '2025-02-01', '2025-04-30', 'ประกาศจากระบบ 1', 'Test description 1', 'enabled', '2025-02-08', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(2, 1, 'School', 'system', '2025-02-01', '2025-04-30', 'ประกาศจากระบบ 2', 'Test description 2', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 1, 'School', 'teacher', '2025-02-01', '2025-04-30', 'ประกาศจากโรงเรียน 1', 'Test description 3', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 1, 'School', 'teacher', '2025-02-01', '2025-04-30', 'ประกาศจากโรงเรียน 2', 'Test description 4', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
