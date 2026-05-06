package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeEvaluationStudentList(filter constant.GradeEvaluationStudentFilter, pagination *helper.Pagination) ([]constant.GradeEvaluationStudentFilterResult, error) {
	query := `
		SELECT
			es.*,
			ef.academic_year,
			ef.year,
			ef.school_room,
			ef.school_term,
			s.code as school_code,
			s.name as school_name,
			student.student_id as master_student_id,
			u.title as master_student_title,
			u.first_name as master_student_first_name,
			u.last_name  as master_student_last_name
		FROM grade.evaluation_student es
		LEFT JOIN grade.evaluation_form ef ON es.form_id = ef.id
		LEFT JOIN school.school s on ef.school_id = s.id
		LEFT JOIN "user".student student ON student.student_id = es.student_id AND student.school_id = ef.school_id
		LEFT JOIN "user"."user" u ON student.user_id = u.id
		WHERE ef.is_archived IS FALSE
	`
	args := []interface{}{}
	idx := 1

	if filter.SchoolID != nil {
		query += fmt.Sprintf(" AND ef.school_id = $%d", idx)
		args = append(args, *filter.SchoolID)
		idx++
	}
	if filter.FormID != nil {
		query += fmt.Sprintf(" AND ef.id = $%d", idx)
		args = append(args, *filter.FormID)
		idx++
	}
	if filter.AcademicYear != nil {
		query += fmt.Sprintf(" AND ef.academic_year = $%d", idx)
		args = append(args, *filter.AcademicYear)
		idx++
	}
	if filter.Year != nil {
		query += fmt.Sprintf(" AND ef.year = $%d", idx)
		args = append(args, *filter.Year)
		idx++
	}
	if filter.SchoolRoom != nil {
		query += fmt.Sprintf(" AND ef.school_room = $%d", idx)
		args = append(args, *filter.SchoolRoom)
		idx++
	}
	if filter.StudentID != nil {
		query += fmt.Sprintf(" AND es.id = $%d", idx)
		args = append(args, *filter.StudentID)
		idx++
	}
	if filter.SearchText != nil {
		elem := "%" + *filter.SearchText + "%"
		query += fmt.Sprintf(` AND (es.thai_first_name ILIKE $%d OR es.thai_last_name ILIKE $%d OR es.citizen_no ILIKE $%d)`, idx, idx+1, idx+2)
		args = append(args, elem, elem, elem)
		idx += 3
	}

	if pagination != nil {
		countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
		query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, idx, idx+1)
		args = append(args, pagination.Limit, pagination.Offset)
	}

	entities := []constant.GradeEvaluationStudentFilterResult{}
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for i, v := range entities {
		entities[i].MatchInMasterData = &constant.True //default
		unmatchedFields := []string{}
		if !compareValueOfPointerString(v.StudentID, v.MasterStudentID) {
			entities[i].MatchInMasterData = &constant.False
			unmatchedFields = append(unmatchedFields, "student_id")
		}
		if !compareValueOfPointerString(v.Title, v.MasterStudentTitle) {
			entities[i].MatchInMasterData = &constant.False
			unmatchedFields = append(unmatchedFields, "student_title")
		}
		if !compareValueOfPointerString(v.ThaiFirstName, v.MasterStudentFirstName) {
			entities[i].MatchInMasterData = &constant.False
			unmatchedFields = append(unmatchedFields, "student_first_name")
		}
		if !compareValueOfPointerString(v.ThaiLastName, v.MasterStudentLastName) {
			entities[i].MatchInMasterData = &constant.False
			unmatchedFields = append(unmatchedFields, "student_last_name")
		}
		entities[i].UnmatchedFields = unmatchedFields
	}

	return entities, nil
}

func compareValueOfPointerString(s1, s2 *string) bool {
	if s1 == nil || s2 == nil {
		return false
	}

	return *s1 == *s2
}
