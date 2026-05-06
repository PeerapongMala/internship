package postgres

func (postgres postgresRepository) CheckStudyGroupByClassID(classID int, teacherID string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM class.study_group sg
			LEFT JOIN school.class_teacher ct 
				ON ct.class_id = sg.class_id AND ct.teacher_id = $2
			LEFT JOIN subject.subject_teacher st
				ON st.subject_id = sg.subject_id AND st.teacher_id = $2
			WHERE sg.class_id = $1
			  AND (
			    ct.teacher_id IS NOT NULL OR
			    st.teacher_id IS NOT NULL
			  )
		)
	`

	var hasAccess bool
	err := postgres.Database.QueryRow(query, classID, teacherID).Scan(&hasAccess)
	if err != nil {
		return false, err
	}
	return hasAccess, nil
}
