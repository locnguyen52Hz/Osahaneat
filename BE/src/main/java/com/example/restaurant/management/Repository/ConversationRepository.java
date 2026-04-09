package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.ConversationWithLatestMessageDTO;
import com.example.restaurant.management.Entity.Conversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    Conversation getConversationByBuyerIdAndShopsId(Integer buyerId, Integer shopsId);

    Conversation getConversationsByIdAndBuyer_IdAndShops_Id(Integer conversationId, Integer buyerId, Integer shopsId);

    @Query("""
            SELECT new com.example.restaurant.management.DTO.ConversationWithLatestMessageDTO(
                c.id,
                m.content,
                m.createdAt,
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
            JOIN c.shops s
            JOIN s.manager sm
            JOIN c.messages m
            JOIN m.sender u
            WHERE m.createdAt = (
                SELECT MAX(m2.createdAt)
                FROM Message m2
                WHERE m2.conversation.id = c.id
            )
            AND c.buyer.id = :userId
            ORDER BY m.createdAt DESC
            """)
    List<ConversationWithLatestMessageDTO> getLastMessageDTOByBuyerId(Integer userId, Pageable pageable);

    @Query("""
            SELECT new com.example.restaurant.management.DTO.ConversationWithLatestMessageDTO(
                c.id,m.content,m.createdAt,
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
            JOIN c.shops s
            JOIN s.manager sm
            JOIN c.messages m
            JOIN m.sender u
            WHERE m.createdAt = (
                SELECT MAX(m2.createdAt)
                FROM Message m2
                WHERE m2.conversation.id = c.id
            )
            AND s.id = :shopsId
            ORDER BY m.createdAt DESC
            """)
    List<ConversationWithLatestMessageDTO> getConversationsByShopsId(Integer shopsId, Pageable pageable);
}


//