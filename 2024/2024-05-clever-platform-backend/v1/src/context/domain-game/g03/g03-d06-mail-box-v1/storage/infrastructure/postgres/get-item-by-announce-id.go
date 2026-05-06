package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) GetItemInfoByAnnouncementId(announceId int) ([]constant.ItemInfo, error) {
	query := `
SELECT
	"ari"."item_id",
	"ari"."amount"
	FROM "announcement"."announcement" a
	LEFT JOIN "announcement"."announcement_reward_item" ari
	ON "a"."id" = "ari"."announcemnet_reward_id"
	WHERE "a"."id" = $1
`
	rows, err := postgresRepository.Database.Query(query, announceId)
	if err != nil {
		return nil, err
	}
	responses := []constant.ItemInfo{}

	for rows.Next() {
		response := constant.ItemInfo{}
		err = rows.Scan(
			&response.ItemId,
			&response.Amount,
		)
		responses = append(responses, response)
	}
	if err != nil {
		return nil, err
	}
	return responses, nil
}
