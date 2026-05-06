package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetPorphor6ByFormID(formID int, ids ...int) ([]constant.Porphor6Data, error) {
	query := `
		SELECT 
			pd.id,
			pd.form_id,
			pd."order",
			pd.student_id,
			pd.data_json,
			pd.created_at,
			es.student_id as student_id_no,
			es.title,
			es.thai_first_name,
			es.thai_last_name,
			es.eng_first_name,
			es.eng_last_name,
			ef.academic_year,
			ef.year,
			ef.school_room
		FROM
			grade.porphor6_data pd
		LEFT JOIN grade.evaluation_student es ON pd.student_id = es.id
		LEFT JOIN grade.evaluation_form ef ON pd.form_id = ef.id
		WHERE pd.form_id = $1
	`

	args := []interface{}{formID}

	if len(ids) > 0 {
		query += " AND pd.id = ANY($2)"
		args = append(args, ids)
	}

	query += ` ORDER BY "order" ASC, pd.id DESC`

	var entities []constant.Porphor6Data
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
