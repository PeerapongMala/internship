package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"

func (postgresRepository postgresRepository) GetQuestionsFromLevelIds(levelIds []int) (entities []constant.QuestionEntity, err error) {
	entities = []constant.QuestionEntity{}

	query := `
		SELECT
			*
		FROM
			"question"."question"
		WHERE
			level_id = ANY($1)
	`
	args := []interface{}{levelIds}

	rows, err := postgresRepository.Database.Queryx(query, args...)
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
