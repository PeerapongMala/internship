package postgres

func (p *postgresRepository) GetUnreadAnnouncementCountByUserId(userId string) (int, error) {
	var unreadCount int

	query := `
        	SELECT 
            		COUNT(*)
        	FROM 
 		"announcement"."user_announcement"
        	WHERE 
            		user_id = $1
            	AND 	is_read = false
            	AND 	is_deleted = false
            	AND 	is_received = true;
    	`
	err := p.Database.Get(&unreadCount, query, userId)
	if err != nil {
		return 0, err
	}

	return unreadCount, nil
}
