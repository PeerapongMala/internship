package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DocumentTemplateList(schoolID *int, formatId *string, pagination *helper.Pagination, isDefault *bool, id *int, name *string) ([]constant.GradeDocumentTemplate, error) {
	query := `
		SELECT
			dt.*,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by
		FROM grade.document_template dt
		WHERE 1 = 1
	`
	args := []interface{}{}
	idx := 1

	if schoolID != nil {
		query += fmt.Sprintf(" AND school_id = $%d", idx)
		args = append(args, *schoolID)
		idx++
	}

	if formatId != nil {
		query += fmt.Sprintf(" AND format_id = $%d", idx)
		args = append(args, *formatId)
		idx++
	}

	if id != nil {
		query += fmt.Sprintf(" AND id = $%d", idx)
		args = append(args, *id)
		idx++
	}

	if formatId != nil {
		query += fmt.Sprintf(" AND format_id = $%d", idx)
		args = append(args, *formatId)
		idx++
	}

	if name != nil {
		query += fmt.Sprintf(" AND name ILIKE $%d", idx)
		args = append(args, "%"+helper.Deref(name)+"%")
		idx++
	}

	if isDefault != nil {
		query += fmt.Sprintf(" AND COALESCE(is_default, FALSE) = $%d", idx)
		args = append(args, *isDefault)
		idx++
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

	entities := []constant.GradeDocumentTemplate{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
