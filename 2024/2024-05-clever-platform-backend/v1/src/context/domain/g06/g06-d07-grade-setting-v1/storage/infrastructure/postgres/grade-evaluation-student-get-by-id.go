package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeEvaluationFormGetById(id int) (*constant.EvaluationStudent, error) {
	query := `
		SELECT
			es.*,
			ef.academic_year,
			ef.year,
			ef.school_room,
			student.student_id as master_student_id,
			u.title as master_student_title,
			u.first_name as master_student_first_name,
			u.last_name  as master_student_last_name
		FROM grade.evaluation_student es
		LEFT JOIN grade.evaluation_form ef ON es.form_id = ef.id
		LEFT JOIN school.school s on ef.school_id = s.id
		LEFT JOIN "user".student student ON student.student_id = es.student_id AND student.school_id = ef.school_id
		LEFT JOIN "user"."user" u ON student.user_id = u.id
		WHERE es.id = $1
	`

	var entity constant.EvaluationStudent
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	entity.MatchInMasterData = &constant.True //default
	unmatchedFields := []string{}
	if !compareValueOfPointerString(entity.StudentID, entity.MasterStudentID) {
		entity.MatchInMasterData = &constant.False
		unmatchedFields = append(unmatchedFields, "student_id")
	}
	if !compareValueOfPointerString(entity.Title, entity.MasterStudentTitle) {
		entity.MatchInMasterData = &constant.False
		unmatchedFields = append(unmatchedFields, "student_title")
	}
	if !compareValueOfPointerString(entity.ThaiFirstName, entity.MasterStudentFirstName) {
		entity.MatchInMasterData = &constant.False
		unmatchedFields = append(unmatchedFields, "student_first_name")
	}
	if !compareValueOfPointerString(entity.ThaiLastName, entity.MasterStudentLastName) {
		entity.MatchInMasterData = &constant.False
		unmatchedFields = append(unmatchedFields, "student_last_name")
	}
	entity.UnmatchedFields = unmatchedFields

	return &entity, nil
}
