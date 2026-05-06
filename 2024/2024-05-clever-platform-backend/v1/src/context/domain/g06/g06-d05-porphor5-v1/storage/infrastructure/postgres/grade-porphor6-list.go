package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetListPorphor6ByFormID(filter constant.Porphor6ListFilter, pagination *helper.Pagination) ([]constant.Porphor6Data, error) {
	query := `
		SELECT 
			pd.id,
			pd.form_id,
			pd."order",
			pd.student_id,
-- 			pd.data_json,
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

	args := []interface{}{filter.EvaluationFormId}
	idx := 2

	if filter.SearchText != "" {
		query += fmt.Sprintf(` 
		AND (
			es.student_id ILIKE $%d 
			OR es.title ILIKE $%d
			OR es.thai_first_name ILIKE $%d
			OR es.thai_last_name ILIKE $%d
		)`, idx, idx+1, idx+2, idx+3)
		args = append(args, "%"+filter.SearchText+"%", "%"+filter.SearchText+"%", "%"+filter.SearchText+"%", "%"+filter.SearchText+"%")
		idx += 4
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, idx, idx+1)
	args = append(args, pagination.Limit, pagination.Offset)

	var entities []constant.Porphor6Data
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
