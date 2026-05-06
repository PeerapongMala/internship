package postgres

func (p *postgresRepository) GetSubjectCheckinCountById(userId string, subjectId int) (int, error) {
	var currentStreak int
	query := `
        	SELECT 
            		sc.current_streak
        	FROM 
            		"user"."student" s
        	JOIN 
            		"streak_login"."subject_checkin" sc 
            	ON 	s.user_id = sc.student_id
        	WHERE 
            		s.user_id = $1 
            	AND 	sc.subject_id = $2;
    	`
	err := p.Database.Get(&currentStreak, query, userId, subjectId)
	if err != nil {
		return 0, err
	}

	return currentStreak, nil
}
