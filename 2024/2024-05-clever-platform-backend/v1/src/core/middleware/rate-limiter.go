package middleware

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/time/rate"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"
)

const (
	Global      string = "GLOBAL"
	GlobalLimit string = "GLOBAL_LIMIT"
	GlobalBurst string = "GLOBAL_BURST"
	Auth        string = "AUTH"
	AuthLimit   string = "AUTH_LIMIT"
	AuthBurst   string = "AUTH_BURST"
	Exp         string = "EXP"
	ExpLimit    string = "EXP_LIMIT"
	ExpBurst    string = "EXP_BURST"
)

type RateLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

type RateLimiterManager struct {
	limiters map[string]*RateLimiter
	mu       sync.Mutex
	limit    rate.Limit
	burst    int
}

func NewRateLimiterManager() (*RateLimiterManager, error) {
	limitStr := os.Getenv(GlobalLimit)
	limit, err := strconv.ParseFloat(limitStr, 64)
	if err != nil {
		return nil, err
	}

	burstStr := os.Getenv(GlobalBurst)
	burst, err := strconv.Atoi(burstStr)
	if err != nil {
		return nil, err
	}

	return &RateLimiterManager{
		limiters: make(map[string]*RateLimiter),
		limit:    rate.Limit(limit),
		burst:    burst,
	}, nil
}

func (manager *RateLimiterManager) GetLimiter(key string) *rate.Limiter {
	manager.mu.Lock()
	defer manager.mu.Unlock()

	limiter, exists := manager.limiters[key]
	if !exists {
		limiter = &RateLimiter{
			limiter: rate.NewLimiter(manager.limit, manager.burst),
		}
		manager.limiters[key] = limiter
	}
	limiter.lastSeen = time.Now()

	go manager.cleanupLimiters()

	return limiter.limiter
}

func (manager *RateLimiterManager) cleanupLimiters() {
	manager.mu.Lock()
	defer manager.mu.Unlock()

	for key, limiter := range manager.limiters {
		if time.Since(limiter.lastSeen) > 5*time.Minute {
			delete(manager.limiters, key)
		}
	}
}

type RateLimitConfig struct {
	Limit rate.Limit
	Burst int
}

func (manager *RateLimiterManager) RateLimit(routeType ...string) fiber.Handler {
	return func(context *fiber.Ctx) error {
		if context.Locals("skipGlobal") != nil && context.Locals("skipGlobal").(bool) {
			context.Locals("skipGlobal", false)
			return context.Next()
		}
		limit := manager.limit
		burst := manager.burst

		if len(routeType) > 0 {
			switch routeType[0] {
			case Auth:
				limitVal, err := helper.GetEnv[float64](AuthLimit, 0.17)
				if err != nil {
					return err
				}
				limit = rate.Limit(limitVal)
				burst, err = helper.GetEnv[int](AuthBurst, 2)
				if err != nil {
					return err
				}
				context.Locals("skipGlobal", true)
			case Exp:
				limitVal, err := helper.GetEnv[float64](ExpLimit, 2)
				if err != nil {
					return err
				}
				limit = rate.Limit(limitVal)
				burst, err = helper.GetEnv[int](ExpBurst, 5)
				if err != nil {
					return err
				}
				context.Locals("skipGlobal", true)
			}
		}

		ip := context.IP()
		limiter := manager.GetLimiter(ip)
		limiter.SetLimit(limit)
		limiter.SetBurst(burst)

		if !limiter.Allow() {
			msg := "Limit Limit exceeded"
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusTooManyRequests, &msg))
		}

		return context.Next()
	}
}
