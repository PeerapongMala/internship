package domainutil

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

func GetTotalCount(
	db *sqlx.DB,
	queryBuilder *helper.QueryBuilder,
	closingQuery string,
) (int, error) {

	queryBuilder.AddClosingQuery(closingQuery)
	countSubQuery, args := queryBuilder.Build()

	countSubQueryArr := strings.Split(countSubQuery, "-- MAIN_QUERY")

	countQuery := fmt.Sprintf(`
		%s
		SELECT COUNT(*)
		FROM (%s) AS total_count
	`, countSubQueryArr[0], countSubQueryArr[1])

	var count int
	if err := db.QueryRowx(countQuery, args...).Scan(&count); err != nil {
		return 0, err
	}
	return count, nil
}
