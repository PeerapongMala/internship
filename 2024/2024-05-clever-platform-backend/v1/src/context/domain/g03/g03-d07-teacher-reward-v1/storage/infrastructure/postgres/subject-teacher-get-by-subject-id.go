package postgres

func (postgresRepository *postgresRepository) GetSubjectTeacherBySubjectId(subjectId int, teacherId string) (int, error) {
	query := `
	SELECT
	id
	FROM "subject"."subject_teacher"
	WHERE subject_id = $1 AND teacher_id = $2
	`
	var SubjectTeacherId int
	err := postgresRepository.Database.QueryRow(query, subjectId, teacherId).Scan(&SubjectTeacherId)
	if err != nil {
		return 0, err
	}
	return SubjectTeacherId, nil

}
