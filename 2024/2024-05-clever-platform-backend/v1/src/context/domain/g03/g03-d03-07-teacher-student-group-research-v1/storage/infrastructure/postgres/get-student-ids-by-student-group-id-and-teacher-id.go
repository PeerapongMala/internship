package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId int, teacherId string) ([]string, error) {

	stm := `
		SELECT 
		    sgs.student_id
		FROM class.study_group_student sgs
		INNER JOIN class.study_group sg ON sg.id = sgs.study_group_id
		INNER JOIN school.class_teacher ct ON ct.class_id = sg.class_id
		WHERE sgs.study_group_id = $1 AND ct.teacher_id = $2
	`

	studentIds := make([]string, 0)
	if err := p.Database.Select(&studentIds, stm, studyGroupId, teacherId); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentIds, nil
}
