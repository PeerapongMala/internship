package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateSubjectReward(subjectReward *constant.SubjectRewardEntity) (*constant.SubjectRewardEntity, error) {
	response := constant.SubjectRewardEntity{}

	updateQuery := `
		UPDATE "streak_login"."subject_reward"
		SET 
	`
	columns := []string{}
	values := []interface{}{}

	// Add fields conditionally
	if subjectReward.ItemId != nil {
		columns = append(columns, "item_id = $"+strconv.Itoa(len(values)+1))
		values = append(values, subjectReward.ItemId)
	}
	if subjectReward.GoldCoinAmount != nil {
		columns = append(columns, "gold_coin_amount = $"+strconv.Itoa(len(values)+1))
		values = append(values, subjectReward.GoldCoinAmount)
	}
	if subjectReward.ArcadeCoinAmount != nil {
		columns = append(columns, "arcade_coin_amount = $"+strconv.Itoa(len(values)+1))
		values = append(values, subjectReward.ArcadeCoinAmount)
	}
	if subjectReward.IceAmount != nil {
		columns = append(columns, "ice_amount = $"+strconv.Itoa(len(values)+1))
		values = append(values, subjectReward.IceAmount)
	}

	// Combine columns with comma separator
	updateQuery += strings.Join(columns, ", ")

	// Add WHERE clause with parameterized placeholders for subject_id and day
	updateQuery += ` WHERE subject_id = $` + strconv.Itoa(len(values)+1) + ` AND day = $` + strconv.Itoa(len(values)+2) + ` RETURNING *`

	// Add subject_id and day to the values slice
	values = append(values, subjectReward.SubjectId, subjectReward.Day)

	err := postgresRepository.Database.Get(&response, updateQuery, values...)
	if err != nil {
		return nil, err
	}

	return &response, nil
}
