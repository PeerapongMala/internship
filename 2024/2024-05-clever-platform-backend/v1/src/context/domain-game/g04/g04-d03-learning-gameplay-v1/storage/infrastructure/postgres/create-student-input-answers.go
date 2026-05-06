package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateStudentInputAnswers(tx *sqlx.Tx, entities []constant.StudentInputAnswerEntity) (err error) {
	values := []interface{}{}
	placeholders := []string{}

	for i, entity := range entities {
		placeholder := fmt.Sprintf("($%d, $%d, $%d, $%d)", 4*i+1, 4*i+2, 4*i+3, 4*i+4)
		placeholders = append(placeholders, placeholder)
		values = append(values, entity.QuestionPlayLogId, entity.QuestionInputAnswerId, entity.AnswerIndex, entity.Answer)
	}

	query := `INSERT INTO "question"."student_input_answer" (
		question_play_log_id, 
		question_input_answer_id, 
		answer_index, 
		answer
	) VALUES `

	query += strings.Join(placeholders, ",")
	query += " RETURNING *"

	rows, err := tx.Queryx(query, values...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentInputAnswerEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
