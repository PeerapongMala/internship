package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"

func (postgresRepository *postgresRepository) IncreaseCoin(req constant.IncreaseCoinRequest) error {

	query :=
		`
	UPDATE "inventory"."inventory"
	SET arcade_coin = $1
	WHERE student_id = $2
	`
	_, err := postgresRepository.Database.Exec(query,
		req.ArcadeCoin,
		req.UserId,
	)
	if err != nil {
		return err
	}
	return nil
}
