package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateStudentSortAnswers(tx *sqlx.Tx, entities []constant.StudentSortAnswerEntity) (err error) {
	values := []interface{}{}
	placeholders := []string{}

	for i, entity := range entities {
		placeholder := fmt.Sprintf("($%d, $%d, $%d)", 3*i+1, 3*i+2, 3*i+3)
		placeholders = append(placeholders, placeholder)
		values = append(values, entity.QuestionPlayLogId, entity.QuestionSortTextChoiceId, entity.Index)
	}

	query := `INSERT INTO "question"."student_sort_answer" (
		question_play_log_id, 
		question_sort_text_choice_id, 
		index
	) VALUES `

	query += strings.Join(placeholders, ",")
	query += " RETURNING *"

	rows, err := tx.Queryx(query, values...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentSortAnswerEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
