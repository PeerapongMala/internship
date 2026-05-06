package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolList(pagination *helper.Pagination) ([]*constant.SchoolList, error) {
	query := `
		SELECT 
			ss.id as school_id,
			ss.name as school_name
		FROM school.school ss
	`

	args := []interface{}{}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $1 LIMIT $2`)

	var school []*constant.SchoolList
	err = postgresRepository.Database.Select(&school, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return school, nil
}

func (postgresRepository *postgresRepository) AcademicYearList(pagination *helper.Pagination, schoolId int) ([]*int, error) {
	query := `
		SELECT 
			DISTINCT name::integer
		FROM school.academic_year_range
	`

	args := []interface{}{}
	argsIndex := len(args) + 1

	if schoolId != 0 {
		query += fmt.Sprintf(` WHERE school_id = $%d`, argsIndex)
		args = append(args, schoolId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "name" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	var academic_year []*int
	err := postgresRepository.Database.Select(&academic_year, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academic_year, nil
}

func (postgresRepository *postgresRepository) YearList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*string, error) {
	query := `
		SELECT
			cc.year
        FROM school.school ss
		INNER JOIN class.class cc
			ON cc.school_id = ss.id
        INNER JOIN school.seed_academic_year sy
        	ON cc.academic_year = sy.academic_year
		WHERE cc.school_id = $1 AND sy.academic_year = $2
		GROUP BY sy.academic_year, cc.year
	`

	args := []interface{}{filter.SchoolID, filter.AcademicYear}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $3 LIMIT $4`)

	var year []*string
	err = postgresRepository.Database.Select(&year, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return year, nil
}

func (postgresRepository *postgresRepository) ClassList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*constant.ClassList, error) {
	query := `
		SELECT 
			cc.id as class_id,
			cc.name as class_name
        FROM school.school ss
        INNER JOIN class.class cc
        	ON cc.school_id = ss.id
        INNER JOIN school.seed_academic_year sy
        	ON cc.academic_year = sy.academic_year
		WHERE 
        	cc.school_id = $1 
            AND cc.academic_year = $2
            AND cc.year = $3
	`

	args := []interface{}{filter.SchoolID, filter.AcademicYear, filter.Year}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $4 LIMIT $5`)

	var classes []*constant.ClassList
	err = postgresRepository.Database.Select(&classes, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classes, nil
}
