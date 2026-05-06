package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) RewardLogList(userId string, pagination *helper.Pagination) ([]constant.RewardLogEntity, error) {
	query := `
		SELECT
			rl.description,
			rl.gold_coin_amount,
			rl.arcade_coin_amount,
			rl.ice_amount,
			i.name AS "item_name",
			i."type" AS "item_type",
			rl.item_amount,
			i.image_url AS "item_image_url",
			b.template_path AS "item_template_path",
			b.badge_description AS "item_badge_description",
			a.model_id AS "avatar_model_id",
			rl.avatar_amount,
			p.model_id AS "pet_model_id",
			rl.pet_amount,
			rl.received_at
		FROM
			reward.reward_log rl
		LEFT JOIN item.item i ON rl.item_id = i.id
		LEFT JOIN item.badge b ON i.id = b.item_id
		LEFT JOIN game.avatar a ON rl.avatar_id = a.id
		LEFT JOIN game.pet p ON rl.pet_id = p.id
		WHERE
			rl.user_id = $1
	`
	args := []interface{}{userId}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		log.Println(countQuery)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "rl"."received_at" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rewardLogs := []constant.RewardLogEntity{}
	err := postgresRepository.Database.Select(&rewardLogs, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return rewardLogs, nil
}
