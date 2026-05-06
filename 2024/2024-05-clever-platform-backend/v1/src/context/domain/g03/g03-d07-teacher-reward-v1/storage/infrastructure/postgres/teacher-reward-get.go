package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherRewardGet(teacherRewardId int) (*constant.TeacherReward, error) {
	query := `
		SELECT
			"i"."name" AS "reward_name",
			"trt"."amount" AS "reward_amount",
			"i"."image_url" AS "reward_image",
			"i"."image_url" AS "reward_image_key",
			"trt"."item_id"
		FROM
		    "teacher_item"."teacher_reward_transaction" trt
		INNER JOIN "item"."item" i ON "trt"."item_id" = "i"."id"
		WHERE "trt"."id" = $1
	`
	teacherReward := constant.TeacherReward{}
	err := postgresRepository.Database.QueryRowx(query, teacherRewardId).StructScan(&teacherReward)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		SELECT DISTINCT ON ("student_id")
			"student_id"
		FROM "teacher_item"."teacher_reward_transaction" trt
		WHERE "trt"."item_id" = $1
	`
	studentIds := []string{}
	err = postgresRepository.Database.Select(&studentIds, query, teacherReward.ItemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	teacherReward.StudentIds = studentIds

	return &teacherReward, nil
}
