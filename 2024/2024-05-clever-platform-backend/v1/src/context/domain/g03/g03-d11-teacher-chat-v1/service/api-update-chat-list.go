package service

import (
	"log"
	"strconv"
	"sync"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
var (
	rooms       = make(map[UserKey]*websocket.Conn)
	broadcast_  = make(chan constant.MessageList)
	register_   = make(chan UpdateChatListInput)
	unregister_ = make(chan UpdateChatListInput)
	mu_         sync.Mutex
)

const (
	pingPeriod   = 60 * time.Second
	writeTimeout = 30 * time.Second
	readTimeout  = 5 * time.Minute
)

type UserKey struct {
	UserID   string
	SchoolID int
}

type UpdateChatListInput struct {
	SchoolID int
	UserID   string
	Conn     *websocket.Conn
}

type UpdateChatListMessage struct {
	MessageID int       `json:"message_id"`
	SenderID  string    `json:"sender_id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	RoomType  string    `json:"room_type"`
	RoomID    string    `json:"room_id"`
	TimeStamp time.Time `json:"timestamp"`
	SchoolID  int       `json:"school_id"`
	Message   string    `json:"content"`
}

func (api *APIStruct) UpdateChatList(context *fiber.Ctx) error {
	return websocket.New(func(Conn *websocket.Conn) {
		subjectId, ok := Conn.Locals("subjectId").(string)
		if !ok {
			log.Println("subjectId error")
			return
		}

		schoolIDStr := Conn.Params("school_id")
		schoolID, err := strconv.Atoi(schoolIDStr)
		if err != nil {
			log.Println("Invalid school_id:", err)
			return
		}

		clientObj_ := UpdateChatListInput{
			SchoolID: schoolID,
			UserID:   subjectId,
			Conn:     Conn,
		}

		defer func() {
			unregister_ <- clientObj_
			Conn.Close()
		}()

		// Register the client
		register_ <- clientObj_

		go func() {
			ticker := time.NewTicker(pingPeriod)
			defer ticker.Stop()

			for {
				<-ticker.C

				Conn.SetWriteDeadline(time.Now().Add(writeTimeout))
				if err := Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					log.Println("Ping error:", err)
					Conn.Close()
					return
				}
			}
		}()

		for {
			_, _, err := Conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Println("read error:", err)
				}
				return
			}
		}

	})(context)
}

func SocketHandlerUpdateChatlist() {
	log.Println(" --- socket handler update chat list --- ")
	for {
		select {
		case client := <-register_:
			mu_.Lock()
			key := UserKey{
				UserID:   client.UserID,
				SchoolID: client.SchoolID,
			}
			rooms[key] = client.Conn
			mu_.Unlock()

		case client := <-unregister_:
			RemoveClient_(client.UserID, client.SchoolID)
		}

	}
}

func RemoveClient_(userID string, schoolID int) {
	key := UserKey{
		UserID:   userID,
		SchoolID: schoolID,
	}
	if con_, ok := rooms[key]; ok {
		mu_.Lock()
		delete(rooms, key)
		con_.Close()
		mu_.Unlock()
	}
}
