package com.sd.chatmicroservice.controller;

import com.sd.chatmicroservice.dto.ChatMessage;
import com.sd.chatmicroservice.dto.ReadMessage;
import com.sd.chatmicroservice.dto.TypingMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatController {
    private final Map<String, List<ChatMessage>> userMessageHistory = new ConcurrentHashMap<>();

    @MessageMapping("/chat/{userRoomUid}")
    @SendTo("/topic/{userRoomUid}")
    public List<ChatMessage> chat(@DestinationVariable String userRoomUid, ChatMessage message) {
        List<ChatMessage> userMessageHistory = getUserMessageHistory(userRoomUid);
        userMessageHistory.add(message);
        return userMessageHistory;
    }

    @MessageMapping("/chat/{userRoomUid}/history")
    @SendTo("/topic/{userRoomUid}")
    public List<ChatMessage> history(@DestinationVariable String userRoomUid) {
        return getUserMessageHistory(userRoomUid);
    }

    @MessageMapping("/chat/{userRoomUid}/typing")
    @SendTo("/topic/{userRoomUid}")
    public TypingMessage typingNotification(@DestinationVariable String userRoomUid, TypingMessage typingMessage) {
        return typingMessage;
    }

    @MessageMapping("/chat/{userRoomUid}/read")
    @SendTo("/topic/{userRoomUid}")
    public ReadMessage readMessageNotification(@DestinationVariable String userRoomUid, ReadMessage readMessage) {
        return readMessage;
    }

    private List<ChatMessage> getUserMessageHistory(String userRoomUid) {
        return userMessageHistory.computeIfAbsent(userRoomUid, k -> Collections.synchronizedList(new ArrayList<>()));
    }
}
