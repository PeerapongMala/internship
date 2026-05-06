package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) CreateSubjectReward(subjectReward *constant.SubjectRewardEntity) error {
	// log.Println("subjectReward", subjectReward)
	_, err := postgresRepository.Database.Exec(`
	INSERT INTO 
	"streak_login"."subject_reward" 
	(subject_id, day, item_id, gold_coin_amount, arcade_coin_amount, ice_amount)
	VALUES ($1, $2, $3, $4, $5, $6)
	`,
		subjectReward.SubjectId,
		subjectReward.Day,
		subjectReward.ItemId,
		subjectReward.GoldCoinAmount,
		subjectReward.ArcadeCoinAmount,
		subjectReward.IceAmount,
	)
	if err != nil {
		return err
	}
	return nil
}
