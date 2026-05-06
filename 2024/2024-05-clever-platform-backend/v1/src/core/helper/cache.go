package helper

import (
	"sync"
	"time"
)

type Cache struct {
	cacheStore map[string]cacheItem
	mutex      *sync.RWMutex
	cleanup    *time.Ticker
	stop       chan struct{}
}

type cacheItem struct {
	Data       interface{}
	Expiration time.Time
}

func NewCache(cleanupInterval time.Duration) *Cache {
	c := &Cache{
		cacheStore: make(map[string]cacheItem),
		mutex:      &sync.RWMutex{},
		stop:       make(chan struct{}),
	}

	if cleanupInterval > 0 {
		c.cleanup = time.NewTicker(cleanupInterval)
		go c.cleanupExpired(cleanupInterval)
	}

	return c
}

func (c *Cache) Get(key string) (interface{}, bool) {
	c.mutex.RLock()
	defer c.mutex.RUnlock()

	item, exists := c.cacheStore[key]
	if !exists || time.Now().After(item.Expiration) {
		return nil, false
	}
	return item.Data, true
}

func (c *Cache) Set(key string, data interface{}, duration time.Duration) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	c.cacheStore[key] = cacheItem{
		Data:       data,
		Expiration: time.Now().Add(duration),
	}
}

func (c *Cache) cleanupExpired(interval time.Duration) {
	for {
		select {
		case <-c.cleanup.C:
			c.mutex.Lock()
			for key, item := range c.cacheStore {
				if time.Now().After(item.Expiration) {
					delete(c.cacheStore, key)
				}
			}
			c.mutex.Unlock()
		case <-c.stop:
			c.cleanup.Stop()
			return
		}
	}
}
