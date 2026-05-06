package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) EvaluationDataEntryListBySheetID(sheetID int, pagination *helper.Pagination) ([]constant.EvaluationSheetHistoryListEntity, error) {
	query := `
		SELECT
			ede.id,
			sheet_id,
			version,
			ede.status,
			ede.is_lock,
			ede.updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = ede.updated_by LIMIT 1) AS updated_by,
			ede.start_edit_at,
			ede.end_edit_at,
			u.id as user_id,
			u.email,
			u.title,
			u.first_name,
			u.last_name,
			(SELECT ARRAY_AGG(ta.access_name)  FROM "user".user_teacher_access uta LEFT JOIN auth.teacher_access ta on uta.teacher_access_id = ta.id WHERE uta.user_id = ede.updated_by) as user_access_name,
			es.current_data_entry_id = ede.id as is_current_version
		FROM grade.evaluation_data_entry ede
		LEFT JOIN "user"."user" u ON ede.updated_by = u.id
		LEFT JOIN grade.evaluation_sheet es ON ede.sheet_id = es.id
		WHERE sheet_id = $1
	`
	args := []interface{}{sheetID}
	idx := 2

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "ede"."%s"::INT %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, idx, idx+1)
	args = append(args, pagination.Limit, pagination.Offset)

	entities := []constant.EvaluationSheetHistoryListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
