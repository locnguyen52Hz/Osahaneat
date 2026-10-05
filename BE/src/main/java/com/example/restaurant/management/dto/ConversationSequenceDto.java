package com.example.restaurant.management.dto;


public class ConversationSequenceDto {
    private Integer conversationId;

    private Long mySequence;
    private Long partnerSequence;

    public ConversationSequenceDto(
            Integer conversationId,
            Long mySequence,
            Long partnerSequence
    ) {
        this.conversationId = conversationId;
        this.mySequence = mySequence;
        this.partnerSequence = partnerSequence;
    }

    public Long getMySequence() {
        return mySequence;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public void setMySequence(Long mySequence) {
        this.mySequence = mySequence;
    }

    public Long getPartnerSequence() {
        return partnerSequence;
    }

    public void setPartnerSequence(Long partnerSequence) {
        this.partnerSequence = partnerSequence;
    }
}
