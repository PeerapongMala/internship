package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) EvaluationDataEntryListNoDetails(sheetID int, pagination *helper.Pagination) ([]constant.EvaluationSheetHistoryListNoDetailsEntity, error) {
	query := `
		SELECT
			version,
			ede.updated_at
		FROM grade.evaluation_data_entry ede
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

	entities := []constant.EvaluationSheetHistoryListNoDetailsEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
