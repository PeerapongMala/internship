package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) GetSubjectRewardBySubjectId(subjectId int) ([]constant.SubjectRewardWithItemEntity, error) {

	reward := []constant.SubjectRewardWithItemEntity{}
	err := postgresRepository.Database.Select(&reward, `
		SELECT * FROM 
		"streak_login"."subject_reward" sr
		left join item.item i 
		on i.id = sr.item_id 
		WHERE subject_id = $1
		order by day
	`,
		subjectId,
	)

	if err != nil {
		return nil, err
	}

	return reward, nil
}

func (postgresRepository *postgresRepository) GetSubjectRewardBySubjectIdAndDay(subjectId int, day int) (*constant.SubjectRewardEntity, error) {

	reward := constant.SubjectRewardEntity{}
	err := postgresRepository.Database.QueryRowx(`
		SELECT * FROM 
    		"streak_login"."subject_reward" sr
		WHERE subject_id = $1
		AND day = (
    		SELECT (($2 - 1) % MAX(day) + 1) 
    		FROM "streak_login"."subject_reward" 
    		WHERE subject_id = $1
		)
	`,
		subjectId,
		day,
	).StructScan(&reward)

	if err != nil {
		return nil, err
	}

	return &reward, nil
}
