package postgres

func (postgresRepository *postgresRepository) AvatarGetPrice(avatarId int) (*int, error) {
	query := `
		SELECT
			"sp"."price"
		FROM
		    "game"."avatar" a
		LEFT JOIN
			"game"."shop_price" sp
			ON "a"."model_id" = "sp"."model_id"
		WHERE
		    "a"."id" = $1
	`
	var price int
	err := postgresRepository.Database.QueryRowx(query, avatarId).Scan(&price)
	if err != nil {
		return nil, err
	}

	return &price, nil
}
