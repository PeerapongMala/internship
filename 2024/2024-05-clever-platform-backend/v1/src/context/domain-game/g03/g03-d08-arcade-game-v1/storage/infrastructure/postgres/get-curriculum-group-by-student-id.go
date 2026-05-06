package postgres

func (postgresRepository *postgresRepository) GetCurriculumGroupByStudentId(studentId string) (int, error) {
	query := `
	SELECT
	"cg"."id"
	FROM  "class"."study_group_student" sgs
	LEFT JOIN "class"."study_group" stg
		ON "sgs"."study_group_id" = "stg"."id"
	LEFT JOIN "subject"."subject" sj
		ON stg.subject_id = sj.id
	LEFT JOIN "curriculum_group"."subject_group" sg
		ON sj.subject_group_id = sg.id
	LEFT JOIN "curriculum_group"."year" y 
		ON sg.year_id = y.id	
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON y.curriculum_group_id = cg.id
	WHERE "sgs"."student_id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&curriculumGroupId)
	if err != nil {
		return 0, err
	}
	return curriculumGroupId, nil
}
