package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.dto.ConversationSequenceDto;
import com.example.restaurant.management.dto.ConversationMeta;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    Conversation getConversationByBuyerIdAndShopId(Integer buyerId, Integer shopsId);

    Conversation getConversationsByIdAndBuyer_Id(Integer conversationId, Integer buyerId);

    Conversation getConversationsByIdAndShop_Id(Integer conversationId, Integer shopsId);

    Conversation getConversationsByIdAndBuyer_IdAndShop_Id(Integer conversationId, Integer buyerId, Integer shopsId);

    @Query("""
            SELECT new com.example.restaurant.management.dto.ConversationMeta(
                c.id,
                m.content,
                m.sentAt,
                CASE
                    WHEN m.sender.id = b.id THEN b.fullName
                    WHEN m.sender.id = sm.id THEN s.shopName
                    ELSE u.fullName
                END,
                CASE
                    WHEN m.sender.id = b.id THEN b.id
                    WHEN m.sender.id = sm.id THEN sm.id
                    ELSE u.id
                END,
                m.readAt,
                s.shopName,
                s.id,
                'ROLE_SHOP_MANAGER',
                (
                    SELECT COUNT(m3.id)
                    FROM Message m3
                    WHERE m3.conversation.id = c.id
                      AND m3.readAt IS NULL
                      AND m3.sender.id <> :userId
                )
            )
            FROM Conversation c
            JOIN c.buyer b
            JOIN c.shop s
            JOIN s.manager sm
            JOIN c.messages m
            JOIN m.sender u
            WHERE c.buyer.id = :userId
              AND NOT EXISTS (
                  SELECT 1
                  FROM Message m2
                  WHERE m2.conversation.id = c.id
                    AND (
                        m2.sentAt > m.sentAt
                        OR (
                            m2.sentAt = m.sentAt
                            AND m2.clientSequence > m.clientSequence
                        )
                        OR (
                            m2.sentAt = m.sentAt
                            AND m2.clientSequence = m.clientSequence
                            AND m2.id > m.id
                        )
                    )
              )
            ORDER BY m.sentAt DESC,
                     m.clientSequence DESC,
                     m.id DESC
            """)
    List<ConversationMeta> getConversationsByBuyer(Integer userId, Pageable pageable);

    @Query("""
            SELECT new com.example.restaurant.management.dto.ConversationMeta(
                c.id,
                m.content,
                m.sentAt,
                CASE
                    WHEN m.sender.id = b.id THEN b.fullName
                    WHEN m.sender.id = sm.id THEN s.shopName
                    ELSE u.fullName
                END,
                CASE
                    WHEN m.sender.id = b.id THEN b.id
                    WHEN m.sender.id = sm.id THEN sm.id
                    ELSE u.id
                END,
                m.readAt,
                b.fullName,
                b.id,
                'ROLE_BUYER',
                (
                    SELECT COUNT(m3.id)
                    FROM Message m3
                    WHERE m3.conversation.id = c.id
                      AND m3.readAt IS NULL
                      AND m3.sender.id <> sm.id
                )
            )
            FROM Conversation c
            JOIN c.buyer b
            JOIN c.shop s
            JOIN s.manager sm
            JOIN c.messages m
            JOIN m.sender u
            WHERE s.id = :shopsId
              AND NOT EXISTS (
                  SELECT 1
                  FROM Message m2
                  WHERE m2.conversation.id = c.id
                    AND (
                        m2.sentAt > m.sentAt
                        OR (
                            m2.sentAt = m.sentAt
                            AND m2.clientSequence > m.clientSequence
                        )
                        OR (
                            m2.sentAt = m.sentAt
                            AND m2.clientSequence = m.clientSequence
                            AND m2.id > m.id
                        )
                    )
              )
            ORDER BY m.sentAt DESC,
                     m.clientSequence DESC,
                     m.id DESC
            """)
    List<ConversationMeta> getConversationsByShopManager(
            Integer shopsId,
            Pageable pageable
    );



    @Query("""
            SELECT new com.example.restaurant.management.dto.ConversationSequenceDto(
                m.conversation.id,
                MAX(
                    CASE
                        WHEN m.sender.id = :userId
                        THEN m.clientSequence
                        ELSE NULL
                    END
                ),
                MAX(
                    CASE
                        WHEN m.sender.id <> :userId
                        THEN m.clientSequence
                        ELSE NULL
                    END
                )
            )
            FROM Message m
            WHERE m.conversation.id IN (:conversationIds)
            GROUP BY m.conversation.id
            """)
    List<ConversationSequenceDto> getConversationSequences(
            @Param("userId") Integer userId,
            @Param("conversationIds") List<Integer> conversationIds
    );
}


//