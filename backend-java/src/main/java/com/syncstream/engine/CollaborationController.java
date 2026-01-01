package com.syncstream.engine;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CollaborationController {

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    @MessageMapping("/code/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public String broadcastCode(@DestinationVariable String roomId, String code) {
        // Save state to Redis (Persistence)
        redisTemplate.opsForValue().set("ROOM:" + roomId, code);
        return code;
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/room/{roomId}")
    @org.springframework.web.bind.annotation.ResponseBody
    @org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
    public String getRoomCode(@PathVariable String roomId) {
        String code = redisTemplate.opsForValue().get("ROOM:" + roomId);
        return code != null ? code : "// Start typing... (New Room)";
    }
}
