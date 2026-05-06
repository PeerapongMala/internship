package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelReward(levelId int, star int, maxStar int) ([]constant.Reward, error) {
	query := `
		SELECT
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
			"level"."level_reward" lr ON "lr"."seed_subject_group_id" = "sg"."seed_subject_group_id"
		WHERE
		    "l"."id" = $1
			AND "lr"."star_required" <= $2
		  	AND "lr"."star_required" > $3
			AND "l"."difficulty" = "lr"."level_type"
			AND "sg"."seed_subject_group_id" = "lr"."seed_subject_group_id"
			AND ("lr"."gold_coin" != 0 OR "lr"."arcade_coin" != 0)
	`
	rewards := []constant.Reward{}
	err := postgresRepository.Database.Select(&rewards, query, levelId, star, maxStar)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return rewards, nil
}
