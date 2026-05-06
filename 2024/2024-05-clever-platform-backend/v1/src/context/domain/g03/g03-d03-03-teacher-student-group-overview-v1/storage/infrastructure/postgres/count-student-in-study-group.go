package postgres

import (
	"fmt"
)

func (postgresRepository postgresRepository) CountStudentsInStudyGroup(studyGroupId int) (count int, err error) {
	query := `
		SELECT COUNT(DISTINCT student_id) 
		FROM class.study_group_student 
		WHERE study_group_id = $1;

	`
	err = postgresRepository.Database.Get(&count, query, studyGroupId)
	if err != nil {
		err = fmt.Errorf("failed to count students in study group: %w", err)
		return
	}
	return
}
