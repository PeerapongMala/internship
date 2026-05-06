package constant

import "time"

type CouponEntity struct {
	Id               *int       `json:"id" db:"id"`
	Code             *string    `json:"code" db:"code"`
	StartedAt        *time.Time `json:"started_at" db:"started_at"`
	EndedAt          *time.Time `json:"ended_at" db:"ended_at"`
	InitialStock     *int       `json:"initial_stock,omitempty" db:"initial_stock"`
	Stock            *int       `json:"stock,omitempty" db:"stock"`
	AvatarId         *int       `json:"avatar_id" db:"avatar_id"`
	PetId            *int       `json:"pet_id" db:"pet_id"`
	GoldCoinAmount   *int       `json:"gold_coin_amount,omitempty" db:"gold_coin_amount"`
	ArcadeCoinAmount *int       `json:"arcade_coin_amount,omitempty" db:"arcade_coin_amount"`
	IceAmount        *int       `json:"ice_amount,omitempty" db:"ice_amount"`
	Status           *string    `json:"status" db:"status"`
	CreatedAt        *time.Time `json:"created_at" db:"created_at"`
	CreatedBy        *string    `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs     *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type CouponTransactionEntity struct {
	Id           *int       `json:"id" db:"id"`
	CouponId     *int       `json:"coupon_id" db:"coupon_id"`
	StudentId    *string    `json:"student_id" db:"student_id"`
	Status       *string    `json:"status" db:"status"`
	UsedAt       *time.Time `json:"used_at" db:"used_at"`
	RecalledAt   *time.Time `json:"recalled_at,omitempty" db:"recalled_at"`
	AdminLoginAs *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type RewardLogEntity struct {
	Id               *int       `db:"id" json:"id"`
	UserId           *string    `db:"user_id" json:"user_id"`
	GoldCoinAmount   *int       `db:"gold_coin_amount" json:"gold_coin_amount"`
	ArcadeCoinAmount *int       `db:"arcade_coin_amount" json:"arcade_coin_amount"`
	IceAmount        *int       `db:"ice_amount" json:"ice_amount"`
	ItemId           *int       `db:"item_id" json:"item_id"`
	ItemAmount       *int       `db:"item_amount" json:"item_amount"`
	AvatarId         *int       `db:"avatar_id" json:"avatar_id"`
	AvatarAmount     *int       `db:"avatar_amount" json:"avatar_amount"`
	PetId            *int       `db:"pet_id" json:"pet_id"`
	PetAmount        *int       `db:"pet_amount" json:"pet_amount"`
	Description      *string    `db:"description" json:"description"`
	ReceivedAt       *time.Time `db:"received_at" json:"received_at"`
	CreatedAt        *time.Time `db:"created_at" json:"created_at"`
}
