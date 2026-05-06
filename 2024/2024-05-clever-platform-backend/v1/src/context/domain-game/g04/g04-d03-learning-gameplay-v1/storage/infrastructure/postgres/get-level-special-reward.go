package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelSpecialReward(levelId int) ([]constant.SpecialReward, error) {
	query := `
		SELECT
			"item_id",
			"amount"		
		FROM "level"."level_special_reward" lsr
		WHERE
			"level_id" = $1
	`
	rewards := []constant.SpecialReward{}
	err := postgresRepository.Database.Select(&rewards, query, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return rewards, nil
}
