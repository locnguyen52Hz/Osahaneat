package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.MessageDTO;
import com.example.restaurant.management.DTO.UnreadCount;
import com.example.restaurant.management.Entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("""
        SELECT new com.example.restaurant.management.DTO.MessageDTO(
            m.id,
            m.content,
            m.sender.fullName,
            m.conversation.id,
            m.createdAt,
            m.sender.id,
            m.readAt
    )
    FROM Message m
    WHERE m.conversation.id = :conversationId
    ORDER BY m.createdAt DESC
    """)
    List<MessageDTO> findMessages(Integer conversationId, Pageable pageable);

    @Query("""
                SELECT COUNT(m)
                FROM Message m
                JOIN m.conversation c
                WHERE m.sender.id <> :buyerId
                  AND m.readAt IS NULL
                  AND c.buyer.id = :buyerId
            """)
    Integer countUnreadMessagesByBuyerId(@Param("buyerId") Integer buyerId);

    @Query("""
                SELECT COUNT(m)
                FROM Message m
                JOIN m.conversation c
                WHERE m.sender.id <> :shopManagerId
                  AND m.readAt IS NULL
                  AND c.shops.id = :shopId
            """)
    Integer countUnreadMessagesForShop(@Param("shopManagerId") Integer shopManagerId,
                                       @Param("shopId") Integer shopId);


    @Query("""
                SELECT new com.example.restaurant.management.DTO.MessageDTO(
                    m.id,
                    m.content,
                    m.sender.id,
                    m.sender.fullName,
                    m.createdAt,
                    m.readAt,
                    m.conversation.id
                )
                FROM Message m
                WHERE m.conversation.id = :conversationId
                  AND (
                        m.createdAt < :lastCreatedAt
                     OR (m.createdAt = :lastCreatedAt AND m.id < :lastId)
                  )
                ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<MessageDTO> loadMoreMessage(@Param("conversationId") Integer conversationId,
                                     @Param("lastCreatedAt") Instant lastCreatedAt,
                                     @Param("lastId") Integer lastId, Pageable pageable);

    @Modifying
    @Query("""
            UPDATE Message m
            SET m.readAt = :lastSeenAt
            WHERE m.conversation.id = :conversationId
                AND m.id >= :lastSeenMessageId
                AND m.createdAt <= :lastSeenAt
                AND m.sender.id <> :userId
                AND m.readAt IS NULL
            """)
    void markMessagesAsRead(@Param("userId") Integer userId,
                            @Param("conversationId") Integer conversationId,
                            @Param("lastSeenMessageId") Integer lastSeenMessageId,
                            @Param("lastSeenAt") Instant lastSeenAt);



//    UnreadCount getUnreadMessageStatsForBuyer(Integer conversationId, Integer userId);


    @Query("""
    SELECT new com.example.restaurant.management.DTO.UnreadCount(
        :conversationId,
        SUM(CASE WHEN c.id = :conversationId THEN 1 ELSE 0 END),
        COUNT(m.id)
    )
    FROM Message m
    JOIN m.conversation c
    WHERE
        m.sender.id <> :shopManagerId
        AND m.readAt IS NULL
        AND c.shops.id = :shopId
    """)
    UnreadCount getUnreadMessageStatsForShopManager(@Param("conversationId") Integer conversationId, @Param("shopManagerId") Integer shopManagerId, @Param("shopId") Integer shopId);


    @Query("""
    SELECT new com.example.restaurant.management.DTO.UnreadCount(
        :conversationId,
        SUM(CASE WHEN c.id = :conversationId THEN 1 ELSE 0 END),
        COUNT(m.id)
    )
    FROM Message m
    JOIN m.conversation c
    WHERE
        m.sender.id <> :buyerId
        AND m.readAt IS NULL
        AND c.buyer.id = :buyerId
    """)
    UnreadCount getUnreadMessageStatsForBuyer(@Param("conversationId") Integer conversationId, @Param("buyerId") Integer buyerId);
}
