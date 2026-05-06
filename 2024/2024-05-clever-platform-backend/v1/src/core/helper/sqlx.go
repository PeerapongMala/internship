package helper

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/pkg/errors"

	"github.com/jmoiron/sqlx"
)

// GetTotalCount returns the total number of rows for a given SELECT query.
// It transforms a query like:
//
//	"SELECT field1, field2 FROM table LEFT JOIN ... WHERE ..."
//
// into:
//
//	"SELECT COUNT(*) AS total_count FROM table LEFT JOIN ... WHERE ..."
//
// by finding the last occurrence of "FROM" (case-insensitive).
//
// !Important: "GROUP BY" and "ORDER BY" might not work remove it
//
// Note: This function assumes that the outer query starts with SELECT and that
// the last "FROM" in the query corresponds to the outer query's FROM clause.
// Use caution with very complex queries.
func GetTotalCount(db *sqlx.DB, baseQuery string, args ...any) (int, error) {
	upperQuery := strings.ToUpper(baseQuery)
	idx := strings.LastIndex(upperQuery, "FROM")
	if idx == -1 {
		return 0, errors.New("no FROM clause found in query")
	}

	countQuery := "SELECT COUNT(*) AS total_count " + baseQuery[idx:]

	var totalCount int
	if err := db.QueryRow(countQuery, args...).Scan(&totalCount); err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}
	return totalCount, nil
}

// GetTotalCount returns the total number of rows for a given SELECT query.
// @selectQuery is like user.id to use in DISTINCT
//
// It transforms a query like:
//
//	"SELECT field1, field2 FROM table LEFT JOIN ... WHERE ..."
//
// into:
//
//	"SELECT COUNT(DISTINCT field1) AS total_count FROM table LEFT JOIN ... WHERE ..."
//
// by finding the last occurrence of "FROM" (case-insensitive).
//
// !Important: "GROUP BY" and "ORDER BY" might not work. remove it
//
// Note: This function assumes that the outer query starts with SELECT and that
// the last "FROM" in the query corresponds to the outer query's FROM clause.
// Use caution with very complex queries
func GetTotalCountDistinct(db *sqlx.DB, selectQuery, baseQuery string, args ...any) (int, error) {
	upperQuery := strings.ToUpper(baseQuery)
	idx := strings.LastIndex(upperQuery, "FROM")
	if idx == -1 {
		return 0, errors.New("no FROM clause found in query")
	}

	countQuery := fmt.Sprintf("SELECT COUNT(DISTINCT %s) AS total_count %s", selectQuery, baseQuery[idx:])

	var totalCount int
	if err := db.QueryRow(countQuery, args...).Scan(&totalCount); err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}
	return totalCount, nil
}
