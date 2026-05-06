package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeTemplateList(schoolId int, year string, activeFlag *bool, status []string, pagination *helper.Pagination, search *string) ([]constant.GradeTemplateListEntity, error) {
	args := []any{schoolId}
	argsIndex := 2

	baseQuery := `
		SELECT
			t.id,
			t.year,
			t.school_id,
			t.template_name,
			t.version,
			t.active_flag,
			t.status,
			COUNT(tla.subject_name) AS subject_name_count
		FROM
			grade."template" t
		LEFT JOIN
			grade.template_subject tla ON t.id = tla.template_id
		WHERE t.school_id = $1`

	if year != "" {
		baseQuery += fmt.Sprintf(` AND t.year = $%d`, argsIndex)
		args = append(args, year)
		argsIndex++
	}

	if len(status) > 0 {
		baseQuery += fmt.Sprintf(` AND t.status = ANY($%d)`, argsIndex)
		args = append(args, pq.Array(status))
		argsIndex++
	}

	if activeFlag != nil {
		baseQuery += fmt.Sprintf(`  AND t.active_flag = $%d `, argsIndex)
		args = append(args, activeFlag)
		argsIndex++
	}

	if search != nil {
		baseQuery += fmt.Sprintf(`  AND t.template_name ILIKE $%d `, argsIndex)
		args = append(args, "%"+*search+"%")
		argsIndex++
	}

	mainQuery := baseQuery + `
		GROUP BY
			t.id, t.year, t.template_name, t.version, t.active_flag, t.status
		ORDER BY t.created_at DESC`

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) as sub`, mainQuery)
	err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	queryWithPagination := mainQuery + fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Offset, pagination.Limit)

	entities := []constant.GradeTemplateListEntity{}
	err = postgresRepository.Database.Select(&entities, queryWithPagination, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
