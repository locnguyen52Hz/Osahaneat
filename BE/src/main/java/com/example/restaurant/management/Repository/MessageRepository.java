package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Message;
import com.example.restaurant.management.dto.MessageDto;
import com.example.restaurant.management.dto.UnreadCount;
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
                SELECT new com.example.restaurant.management.dto.MessageDto(
                    m.id,
                    m.content,
                    m.sender.fullName,
                    m.conversation.id,
                    m.createdAt,
                    m.sender.id,
                    m.readAt,
                    m.clientSequence,
                    m.sentAt
                )
                FROM Message m
                WHERE m.conversation.id = :conversationId
                ORDER BY m.sentAt DESC,
                         m.clientSequence DESC,
                         m.id DESC
            """)
    List<MessageDto> findLastestMessagesByConversationId(
            @Param("conversationId") Integer conversationId,
            Pageable pageable
    );

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
                  AND c.shop.id = :shopId
            """)
    Integer countUnreadMessagesForShop(@Param("shopManagerId") Integer shopManagerId,
                                       @Param("shopId") Integer shopId);


    @Query("""
                SELECT new com.example.restaurant.management.dto.MessageDto(
                    m.id,
                    m.content,
                    m.sender.id,
                    m.sender.fullName,
                    m.createdAt,
                    m.readAt,
                    m.conversation.id,
                    m.clientSequence,
                    m.sentAt
                )
                FROM Message m
                WHERE m.conversation.id = :conversationId
                  AND (
                        m.sentAt < :lastSentAt
            
                     OR (
                            m.sentAt = :lastSentAt
                            AND m.clientSequence < :lastClientSequence
                        )
            
                     OR (
                            m.sentAt = :lastSentAt
                            AND m.clientSequence = :lastClientSequence
                            AND m.id < :lastId
                        )
                  )
                ORDER BY m.sentAt DESC,
                         m.clientSequence DESC,
                         m.id DESC
            """)
    List<MessageDto> getOlderMessages(
            @Param("conversationId") Integer conversationId,
            @Param("lastSentAt") Instant lastSentAt,
            @Param("lastClientSequence") Long lastClientSequence,
            @Param("lastId") Integer lastId,
            Pageable pageable
    );

    @Modifying
    @Query("""
            UPDATE Message m
            SET m.readAt = :lastSeenAt
            WHERE m.conversation.id = :conversationId
                AND m.sender.id <> :userId
                AND m.clientSequence >= :lastSeenClientSequence
                AND m.clientSequence <= :firstSeenClientSequence
                AND m.readAt IS NULL
            """)
    void markMessagesAsRead(
            @Param("userId") Integer userId,
            @Param("conversationId") Integer conversationId,
            @Param("firstSeenClientSequence") Long firstSeenClientSequence,
            @Param("lastSeenClientSequence") Long lastSeenClientSequence,
            @Param("lastSeenAt") Instant lastSeenAt
    );


    @Query("""
                SELECT new com.example.restaurant.management.dto.UnreadCount(
                    :conversationId,
                    COALESCE(
                        SUM(
                            CASE
                                WHEN c.id = :conversationId THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ),
                    COUNT(m.id)
                )
                FROM Message m
                JOIN m.conversation c
                WHERE 
                    m.sender.id <> :shopManagerId
                    AND m.readAt IS NULL
                    AND c.shop.id = :shopId
            """)
    UnreadCount getUnreadMessageStatsForShopManager(@Param("conversationId") Integer conversationId, @Param("shopManagerId") Integer shopManagerId, @Param("shopId") Integer shopId);


    @Query("""
            SELECT new com.example.restaurant.management.dto.UnreadCount(
                :conversationId,
                COALESCE(
                    SUM(
                        CASE
                            WHEN c.id = :conversationId THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ),
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
