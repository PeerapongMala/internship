-- +goose Up
-- +goose StatementBegin
DROP TABLE IF EXISTS "level"."level_play_log_alert";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
CREATE TABLE "level"."level_play_log_alert" (
                                                "id" INT PRIMARY KEY,
                                                "class_id" int,
                                                "student_id" char(36) NOT NULL,
                                                "level_id" int NOT NULL,
                                                "homework_id" int,
                                                "played_at" timestamp NOT NULL,
                                                "star" smallint NOT NULL,
                                                "time_used" smallint NOT NULL,
                                                "admin_login_as" char(36)
);
-- +goose StatementEnd
