package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateStudentPlaceholderAnswers(tx *sqlx.Tx, entities []constant.StudentPlaceholderAnswerEntity) (err error) {
	values := []interface{}{}
	placeholders := []string{}

	for i, entity := range entities {
		placeholder := fmt.Sprintf("($%d, $%d, $%d)", 3*i+1, 3*i+2, 3*i+3)
		placeholders = append(placeholders, placeholder)
		values = append(values, entity.QuestionPlayLogId, entity.QuestionPlaceholderAnswerId, entity.QuestionPlaceholderTextChoiceId)
	}

	query := `INSERT INTO "question"."student_placeholder_answer" (
		question_play_log_id, 
		question_placeholder_answer_id, 
		question_placeholder_text_choice_id
	) VALUES `

	query += strings.Join(placeholders, ",")
	query += " RETURNING *"

	rows, err := tx.Queryx(query, values...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentPlaceholderAnswerEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
