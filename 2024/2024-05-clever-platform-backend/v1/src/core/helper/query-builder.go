package helper

import (
	"fmt"
	"reflect"
	"strings"
)

type QueryBuilder struct {
	baseQuery        string
	closingQuery     string
	filters          []string
	args             []interface{}
	placeholderIndex int
}

func (qb *QueryBuilder) GetPlaceholderIndex() int {
	return qb.placeholderIndex
}

func NewQueryBuilder(baseQuery string, initialArgs ...interface{}) *QueryBuilder {
	return &QueryBuilder{
		baseQuery:        baseQuery,
		args:             initialArgs,
		placeholderIndex: len(initialArgs) + 1,
	}
}

func (qb *QueryBuilder) AddFilter(condition string, value interface{}) {
	if value != "" && value != nil {
		qb.filters = append(qb.filters, fmt.Sprintf(condition+" $%d", qb.placeholderIndex))
		qb.args = append(qb.args, value)
		qb.placeholderIndex++
	} else {
		qb.filters = append(qb.filters, condition)
	}
}

func (qb *QueryBuilder) AddClosingQuery(closingQuery string) {
	qb.closingQuery = closingQuery
}

// Build finalizes the query with all added filters.
func (qb *QueryBuilder) Build() (string, []interface{}) {
	query := strings.Join([]string{qb.baseQuery, strings.Join(qb.filters, " "), qb.closingQuery}, " ")
	return query, qb.args
}

// ApplySearch adds a search filter to the query.
func (qb *QueryBuilder) ApplySearch(searchCols []string, searchValue string) {
	if searchValue == "" {
		return
	}

	const (
		START_TEMPLATE = `AND (%s::TEXT ILIKE`
		MID_TEMPLATE   = `OR %s::TEXT ILIKE`
	)
	searchText := "%" + strings.ToLower(strings.TrimSpace(searchValue)) + "%"

	for i, searchCol := range searchCols {
		filter := fmt.Sprintf(MID_TEMPLATE, searchCol)
		if i == 0 {
			filter = fmt.Sprintf(START_TEMPLATE, searchCol)
		}
		qb.AddFilter(filter, searchText)
	}

	if len(searchCols) > 0 {
		qb.AddFilter(")", nil)
	}
}

func (qb *QueryBuilder) GetTotalCountQueryBuild() (string, []interface{}) {
	query, args := qb.Build()

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) as total_count`, query)

	return countQuery, args
}

func (qb *QueryBuilder) AddFiltersWithOR(conditions []string, values []interface{}) {
	if len(conditions) != len(values) {
		return
	}

	startText := "OR"
	filter := "AND ("
	for idx, condition := range conditions {
		if idx == 0 {
			if IsSlice(values[idx]) {
				filter += fmt.Sprintf(`%s ANY($%d)`, condition, qb.placeholderIndex)
			} else {
				filter += fmt.Sprintf(`%s $%d`, condition, qb.placeholderIndex)
			}
		} else if IsSlice(values[idx]) {
			filter += fmt.Sprintf(` %s %s ANY($%d)`, startText, condition, qb.placeholderIndex)
		} else {
			filter += fmt.Sprintf(` %s %s $%d`, startText, condition, qb.placeholderIndex)
		}

		qb.args = append(qb.args, values[idx])
		qb.placeholderIndex++
	}

	filter += ")"
	qb.filters = append(qb.filters, filter)
}

func IsSlice(v interface{}) bool {
	return reflect.TypeOf(v).Kind() == reflect.Slice
}
