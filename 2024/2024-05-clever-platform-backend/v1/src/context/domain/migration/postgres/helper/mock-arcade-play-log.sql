INSERT INTO "arcade"."arcade_play_log" (
id,
class_id,
student_id,
arcade_game_id,
score,
played_at,
time_used,
wave
)
VALUES
(1,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-02-24',1222,2),
(2,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-02-26',1111,2),
(3,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-02-27',1111,2),
(4,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-02-28',1111,2),
(5,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-03-01',1111,2),
(6,1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1000,'2025-03-02',1111,2);


INSERT INTO "announcement"."announcement" (
id,
school_id,
scope,
type,
started_at,
ended_at,
title,
description,
status,
created_at,
created_by
)
VALUES
(101,1,'Subject','event','2025-02-24','2025-03-05','กิจกรรม1','test description','enabled','2025-02-15','1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(102,1,'Subject','event','2025-02-26','2025-03-05','กิจกรรม2','test description','enabled','2025-02-15','1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO "announcement"."announcement_event" (
    announcement_id,
    subject_id,
    academic_year,
    arcade_game_id
)
VALUES
(101,1,2568,1),
(102,1,2568,1);
