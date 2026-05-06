package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetReward(levelId int) ([]constant.GameRewardEntity, error) {
	query := `
		SELECT
			"lr"."star_required",
			"lr"."gold_coin",
			"lr"."arcade_coin"
		FROM
		    "level"."level" l
		LEFT JOIN
			"subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN
			"subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id" 
		LEFT JOIN
			"subject"."subject" s ON "ls"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"level"."level_reward" lr ON "sg"."seed_subject_group_id" = "lr"."seed_subject_group_id"
		WHERE
		    "l"."difficulty" = "lr"."level_type"
			AND "sg"."seed_subject_group_id" = "lr"."seed_subject_group_id"
			AND "l"."id" = $1
	`
	args := []interface{}{levelId}

	gameRewards := []constant.GameRewardEntity{}
	err := postgresRepository.Database.Select(&gameRewards, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return gameRewards, nil
}
