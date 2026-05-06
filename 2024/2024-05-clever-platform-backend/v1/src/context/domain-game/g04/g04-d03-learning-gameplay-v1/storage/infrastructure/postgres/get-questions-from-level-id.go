package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
)

func (postgresRepository *postgresRepository) GetQuestionsFromLevelId(levelId int) (entities []constant.QuestionEntity, err error) {
	query := `
		SELECT
			*
		FROM
			"question"."question"
		WHERE
			level_id = $1
	`
	rows, err := postgresRepository.Database.Queryx(query, levelId)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.QuestionEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
