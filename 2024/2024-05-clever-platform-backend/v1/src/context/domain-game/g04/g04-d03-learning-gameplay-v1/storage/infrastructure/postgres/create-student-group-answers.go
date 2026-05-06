package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateStudentGroupAnswers(tx *sqlx.Tx, entities []constant.StudentGroupAnswerEntity) (err error) {
	values := []interface{}{}
	placeholders := []string{}

	for i, entity := range entities {
		placeholder := fmt.Sprintf("($%d, $%d, $%d)", 3*i+1, 3*i+2, 3*i+3)
		placeholders = append(placeholders, placeholder)
		values = append(values, entity.QuestionPlayLogId, entity.QuestionGroupChoiceId, entity.QuestionGroupGroupId)
	}

	query := `INSERT INTO "question"."student_group_answer" (
		question_play_log_id, 
		question_group_choice_id, 
		question_group_group_id
	) VALUES `

	query += strings.Join(placeholders, ",")
	query += " RETURNING *"

	rows, err := tx.Queryx(query, values...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentGroupAnswerEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
