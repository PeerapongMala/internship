package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetRewardByLevelId(levelId int) ([]constant.GameReward, error) {
	query := `
		SELECT
			"lsr"."item_id" AS "id",	
			"i"."type" AS "type",
			"i"."name" AS "name",
			"i"."description" AS "description",
			"i"."image_url" AS "image_url",
			"b"."template_path" AS "template_path",
			"b"."badge_description" AS "badge_description",
			"lsr"."amount" AS "amount"
		FROM "level"."level_special_reward" lsr
		LEFT JOIN
		    "item"."item" i ON "lsr"."id" = "i"."id"
		LEFT JOIN
		    "item"."badge" b ON "i"."id" = "b"."item_id"
		WHERE "level_id" = $1
	`
	gameRewards := []constant.GameReward{}
	err := postgresRepository.Database.Select(&gameRewards, query, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return gameRewards, nil
}
