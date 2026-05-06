-- +goose Up
-- +goose StatementBegin
CREATE TABLE "question"."question_learn" (
                                                "question_id" INT PRIMARY KEY,
                                                "text" VARCHAR,
                                                "url" VARCHAR
);
ALTER TABLE "question"."question_multiple_choice" ADD FOREIGN KEY ("question_id") REFERENCES "question"."question" ("id");

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "question"."question_learn";
-- +goose StatementEnd
