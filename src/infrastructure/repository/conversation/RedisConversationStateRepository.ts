import { ConversationState } from "@/v1/domain/entities/patient/conversation-state/ConversationState";
import { ConversationStateRepository } from "@/v1/domain/repository/conversation/ConversationState";

export class RedisConversationStateRepository
  implements ConversationStateRepository
{
  constructor(private redisClient: any) {} // Use ioredis or redis package

  async get(userId: string): Promise<ConversationState | null> {
    const data = await this.redisClient.get(`conversation:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  async save(state: ConversationState): Promise<void> {
    state.lastMessageAt = new Date();
    await this.redisClient.setex(
      `conversation:${state.userId}`,
      86400, // 24 hours TTL
      JSON.stringify(state)
    );
  }

  async delete(userId: string): Promise<void> {
    await this.redisClient.del(`conversation:${userId}`);
  }

  async cleanup(olderThan: Date): Promise<void> {
    // Redis TTL handles this automatically
  }
}
