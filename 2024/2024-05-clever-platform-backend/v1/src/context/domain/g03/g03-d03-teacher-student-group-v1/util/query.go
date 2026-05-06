package domainutil

import (
	"fmt"
	"time"
)

func ConcatContainSql(query, field, value string) string {
	if len(value) > 0 {
		return ConcatMatchSql(query, field, "%"+value+"%")
	}

	return query
}

func ConcatContainSqlOr(query string, fields []string, value string) string {
	if len(value) > 0 {
		return ConcatMatchSqlOr(query, fields, "%"+value+"%")
	}

	return query
}

func ConcatMatchSqlOr(query string, fields []string, value string) string {
	if len(value) > 0 || len(fields) <= 1 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += "( "

		for index, field := range fields {
			query += fmt.Sprintf("LOWER(%s) LIKE LOWER('%v') ", field, value)

			if index != len(fields)-1 {
				query += " OR "
			}
		}

		query += ") "
	}

	return query
}

func ConcatMatchSql(query, field string, value string) string {
	if len(value) > 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			LOWER(%s) LIKE LOWER('%v')
		`, field, value)
	}

	return query
}

func ConcatMatchSqlInt(query, field string, value int) string {
	if value != 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			%s = %v
		`, field, value)
	}

	return query
}

func ConcatMatchSqlInt64(query, field string, value int64) string {
	if value != 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			%s = %v
		`, field, value)
	}

	return query
}

func ConcatMatchSqlInt64Or(query, field1, field2 string, value int64) string {

	if value != 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			(%s = %v OR %s = %v)
		`, field1, value, field2, value)
	}

	return query
}

func ConcatNotMatchSqlInt64(query, field string, value int64) string {

	if len(query) > 0 {
		query += "AND "
	} else {
		query += "WHERE "
	}

	query += fmt.Sprintf(`
			%s <> %v
		`, field, value)

	return query
}

func ConcatMatchSqlFloat64(query, field string, value float64) string {
	if value != 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			%s = %v
		`, field, value)
	}

	return query
}

func ConcatMatchSqlBool(query, field string, value *bool) string {
	if value != nil {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			%s = %t
		`, field, *value)
	}

	return query
}

func ConcatNotMatchSql(query, field, value string) string {
	if len(value) > 0 {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			%s NOT LIKE '%s'
		`, field, value)
	}

	return query
}

func ConcatMatchInListSql(tempQuery, field string, value []string) string {
	valueIN := ""
	for index, v := range value {
		if index != len(value)-1 {
			valueIN += fmt.Sprintf(`'%s',`, v)
		} else {
			valueIN += fmt.Sprintf(`'%s'`, v)
		}
	}

	if len(value) > 0 {
		if len(tempQuery) > 0 {
			tempQuery += "AND "
		} else {
			tempQuery += "WHERE "
		}

		tempQuery += fmt.Sprintf(`
			%s IN (%s)
		`, field, valueIN)
	}

	return tempQuery
}

func ConcatContainsAllSql(tempQuery, field string, value []string) string {
	containsAll := ""
	for index, v := range value {
		if index != len(value)-1 {
			containsAll += fmt.Sprintf(`'%s',`, v)
		} else {
			containsAll += fmt.Sprintf(`'%s'`, v)
		}
	}

	if len(value) > 0 {
		if len(tempQuery) > 0 {
			tempQuery += "AND "
		} else {
			tempQuery += "WHERE "
		}

		tempQuery += fmt.Sprintf(`
			%s @> ARRAY[%s]
		`, field, containsAll)
	}

	return tempQuery
}

func ConcatGreaterThanEqualDatetime(query, field string, t *time.Time) string {
	if t != nil {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			DATE(%s) >= DATE('%v')
		`, field, t.Format(time.RFC3339))
	}

	return query
}

func ConcatLessThanDatetime(query, field string, t *time.Time) string {
	if t != nil {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			DATE(%s) <= DATE('%v')
		`, field, t.Format(time.RFC3339))
	}

	return query
}

func ConcatMatchDate(query, field string, t *time.Time) string {
	if t != nil {
		if len(query) > 0 {
			query += "AND "
		} else {
			query += "WHERE "
		}

		query += fmt.Sprintf(`
			CAST(%s as DATE) = CAST('%v' as DATE)
		`, field, t.Format(time.RFC3339))
	}

	return query
}
