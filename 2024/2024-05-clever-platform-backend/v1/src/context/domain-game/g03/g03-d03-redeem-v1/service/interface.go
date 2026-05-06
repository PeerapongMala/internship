package service

type ServiceInterface interface {
	RedeemCoupon(in *RedeemCouponInput) error
}
