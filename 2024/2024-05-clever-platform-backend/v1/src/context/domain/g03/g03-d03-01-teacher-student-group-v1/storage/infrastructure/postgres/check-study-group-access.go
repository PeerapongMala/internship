package postgres

func (postgresRepository *postgresRepository) CheckStudyGroupAccess(studentGroupID int, userID string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM class.study_group sg
			LEFT JOIN school.class_teacher ct ON ct.class_id = sg.class_id AND ct.teacher_id = $1
			LEFT JOIN subject.subject_teacher st ON st.subject_id = sg.subject_id AND st.teacher_id = $1
			WHERE sg.id = $2 AND (ct.teacher_id IS NOT NULL OR st.teacher_id IS NOT NULL)
		)
	`

	var hasAccess bool
	err := postgresRepository.Database.QueryRow(query, userID, studentGroupID).Scan(&hasAccess)
	if err != nil {
		return false, err
	}
	return hasAccess, nil
}
