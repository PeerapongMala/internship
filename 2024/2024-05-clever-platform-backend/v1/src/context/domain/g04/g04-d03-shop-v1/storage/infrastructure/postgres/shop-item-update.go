package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateShopItem(storeItemId int, c constant.ShopItemRequest) (r constant.ShopItemEntity, err error) {
	values := []interface{}{}
	columns := []string{}

	updateQuery := `UPDATE "teacher_store"."teacher_store_item" SET `
	columns = append(columns,
		"item_id = $1",
		"price= $2",
		"status= $3",
		"updated_at= $4",
		"updated_by= $5")
	values = append(values, c.ItemId, c.Price, c.Status, "NOW()", c.UpdatedBy)

	if c.Stock != nil {
		columns = append(columns, "stock = $"+strconv.Itoa(len(values)+1))
		values = append(values, c.Stock)
	}

	if c.InitialStock != nil {
		columns = append(columns, "initial_stock = $"+strconv.Itoa(len(values)+1))
		values = append(values, c.InitialStock)
	}

	columns = append(columns, "open_date = $"+strconv.Itoa(len(values)+1))
	values = append(values, c.OpenDate)

	columns = append(columns, "closed_date = $"+strconv.Itoa(len(values)+1))
	values = append(values, c.ClosedDate)

	updateQuery += strings.Join(columns, ", ")
	updateQuery += ` WHERE id = $` + strconv.Itoa(len(values)+1)
	values = append(values, storeItemId)

	updateQuery += ` RETURNING *`
	err = postgresRepository.Database.QueryRowx(updateQuery, values...).StructScan(&r)
	if err != nil {
		return r, err
	}

	return r, nil

}
