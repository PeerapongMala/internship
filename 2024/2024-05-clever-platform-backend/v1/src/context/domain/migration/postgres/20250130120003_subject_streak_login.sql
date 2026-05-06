-- +goose Up
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" DROP CONSTRAINT "subject_reward_pkey";
ALTER TABLE "streak_login"."subject_reward" ADD PRIMARY KEY ("subject_id", "day") ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" DROP CONSTRAINT "subject_reward_pkey";
ALTER TABLE "streak_login"."subject_reward" ADD PRIMARY KEY ("subject_id") ;
-- +goose StatementEnd
