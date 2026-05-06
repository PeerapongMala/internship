package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateStudentMultipleChoiceAnswers(tx *sqlx.Tx, entities []constant.StudentMultipleChoiceAnswerEntity) (err error) {
	values := []interface{}{}
	placeholders := []string{}

	for i, entity := range entities {
		placeholder := fmt.Sprintf("($%d, $%d, $%d)", 3*i+1, 3*i+2, 3*i+3)
		placeholders = append(placeholders, placeholder)
		values = append(values, entity.QuestionPlayLogId, entity.QuestionMultipleChoiceTextChoiceId, entity.QuestionMultipleChoiceImageChoiceId)
	}

	query := `INSERT INTO "question"."student_multiple_choice_answer" (
		question_play_log_id, 
		question_multiple_choice_text_choice_id, 
		question_multiple_choice_image_choice_id
	) VALUES `

	query += strings.Join(placeholders, ",")
	query += " RETURNING *"

	rows, err := tx.Queryx(query, values...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentMultipleChoiceAnswerEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
