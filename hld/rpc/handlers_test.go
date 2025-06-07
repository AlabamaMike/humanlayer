package rpc

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/humanlayer/humanlayer/hld/session"
	"github.com/humanlayer/humanlayer/hld/store"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
)

func TestHandleGetConversation(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockManager := session.NewMockSessionManager(ctrl)
	mockStore := store.NewMockConversationStore(ctrl)

	handlers := NewSessionHandlers(mockManager, mockStore)

	t.Run("get conversation by session ID", func(t *testing.T) {
		sessionID := "sess-123"
		claudeSessionID := "claude-456"

		// Mock data
		events := []*store.ConversationEvent{
			{
				ID:              1,
				SessionID:       sessionID,
				ClaudeSessionID: claudeSessionID,
				Sequence:        1,
				EventType:       store.EventTypeMessage,
				CreatedAt:       time.Now(),
				Role:            "assistant",
				Content:         "Hello! How can I help you?",
			},
			{
				ID:              2,
				SessionID:       sessionID,
				ClaudeSessionID: claudeSessionID,
				Sequence:        2,
				EventType:       store.EventTypeToolCall,
				CreatedAt:       time.Now(),
				ToolID:          "tool-1",
				ToolName:        "calculator",
				ToolInputJSON:   `{"operation": "add", "a": 1, "b": 2}`,
			},
		}

		mockStore.EXPECT().
			GetSessionConversation(gomock.Any(), sessionID).
			Return(events, nil)

		req := GetConversationRequest{
			SessionID: sessionID,
		}
		reqJSON, _ := json.Marshal(req)

		result, err := handlers.HandleGetConversation(context.Background(), reqJSON)
		require.NoError(t, err)

		resp, ok := result.(*GetConversationResponse)
		require.True(t, ok)
		assert.Len(t, resp.Events, 2)
		assert.Equal(t, "assistant", resp.Events[0].Role)
		assert.Equal(t, "Hello! How can I help you?", resp.Events[0].Content)
		assert.Equal(t, "calculator", resp.Events[1].ToolName)
	})

	t.Run("get conversation by Claude session ID", func(t *testing.T) {
		claudeSessionID := "claude-456"

		events := []*store.ConversationEvent{
			{
				ID:              1,
				SessionID:       "sess-123",
				ClaudeSessionID: claudeSessionID,
				Sequence:        1,
				EventType:       store.EventTypeMessage,
				CreatedAt:       time.Now(),
				Role:            "user",
				Content:         "What is 2+2?",
			},
		}

		mockStore.EXPECT().
			GetConversation(gomock.Any(), claudeSessionID).
			Return(events, nil)

		req := GetConversationRequest{
			ClaudeSessionID: claudeSessionID,
		}
		reqJSON, _ := json.Marshal(req)

		result, err := handlers.HandleGetConversation(context.Background(), reqJSON)
		require.NoError(t, err)

		resp, ok := result.(*GetConversationResponse)
		require.True(t, ok)
		assert.Len(t, resp.Events, 1)
		assert.Equal(t, "user", resp.Events[0].Role)
	})

	t.Run("missing both session IDs", func(t *testing.T) {
		req := GetConversationRequest{}
		reqJSON, _ := json.Marshal(req)

		_, err := handlers.HandleGetConversation(context.Background(), reqJSON)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "either session_id or claude_session_id is required")
	})

	t.Run("invalid JSON", func(t *testing.T) {
		_, err := handlers.HandleGetConversation(context.Background(), []byte(`invalid json`))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "invalid request")
	})
}

func TestHandleGetSessionState(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockManager := session.NewMockSessionManager(ctrl)
	mockStore := store.NewMockConversationStore(ctrl)

	handlers := NewSessionHandlers(mockManager, mockStore)

	t.Run("successful get session state", func(t *testing.T) {
		sessionID := "sess-123"
		now := time.Now()
		completedAt := now.Add(10 * time.Minute)
		costUSD := 0.05
		totalTokens := 1500
		durationMS := 600000

		dbSession := &store.Session{
			ID:              sessionID,
			RunID:           "run-456",
			ClaudeSessionID: "claude-789",
			Status:          store.SessionStatusCompleted,
			Query:           "Help me write a function",
			Model:           "claude-3-opus",
			WorkingDir:      "/home/user/project",
			CreatedAt:       now,
			LastActivityAt:  completedAt,
			CompletedAt:     &completedAt,
			CostUSD:         &costUSD,
			TotalTokens:     &totalTokens,
			DurationMS:      &durationMS,
			ErrorMessage:    "",
		}

		mockStore.EXPECT().
			GetSession(gomock.Any(), sessionID).
			Return(dbSession, nil)

		req := GetSessionStateRequest{
			SessionID: sessionID,
		}
		reqJSON, _ := json.Marshal(req)

		result, err := handlers.HandleGetSessionState(context.Background(), reqJSON)
		require.NoError(t, err)

		resp, ok := result.(*GetSessionStateResponse)
		require.True(t, ok)
		assert.Equal(t, sessionID, resp.Session.ID)
		assert.Equal(t, "run-456", resp.Session.RunID)
		assert.Equal(t, "claude-789", resp.Session.ClaudeSessionID)
		assert.Equal(t, store.SessionStatusCompleted, resp.Session.Status)
		assert.Equal(t, 0.05, resp.Session.CostUSD)
		assert.Equal(t, 1500, resp.Session.TotalTokens)
		assert.Equal(t, 600000, resp.Session.DurationMS)
		assert.NotEmpty(t, resp.Session.CompletedAt)
	})

	t.Run("session with error", func(t *testing.T) {
		sessionID := "sess-error"
		now := time.Now()

		dbSession := &store.Session{
			ID:             sessionID,
			RunID:          "run-error",
			Status:         store.SessionStatusFailed,
			Query:          "Failed query",
			CreatedAt:      now,
			LastActivityAt: now,
			ErrorMessage:   "Connection timeout",
		}

		mockStore.EXPECT().
			GetSession(gomock.Any(), sessionID).
			Return(dbSession, nil)

		req := GetSessionStateRequest{
			SessionID: sessionID,
		}
		reqJSON, _ := json.Marshal(req)

		result, err := handlers.HandleGetSessionState(context.Background(), reqJSON)
		require.NoError(t, err)

		resp, ok := result.(*GetSessionStateResponse)
		require.True(t, ok)
		assert.Equal(t, store.SessionStatusFailed, resp.Session.Status)
		assert.Equal(t, "Connection timeout", resp.Session.ErrorMessage)
	})

	t.Run("missing session ID", func(t *testing.T) {
		req := GetSessionStateRequest{}
		reqJSON, _ := json.Marshal(req)

		_, err := handlers.HandleGetSessionState(context.Background(), reqJSON)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "session_id is required")
	})

	t.Run("session not found", func(t *testing.T) {
		sessionID := "nonexistent"

		mockStore.EXPECT().
			GetSession(gomock.Any(), sessionID).
			Return(nil, assert.AnError)

		req := GetSessionStateRequest{
			SessionID: sessionID,
		}
		reqJSON, _ := json.Marshal(req)

		_, err := handlers.HandleGetSessionState(context.Background(), reqJSON)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to get session")
	})
}
