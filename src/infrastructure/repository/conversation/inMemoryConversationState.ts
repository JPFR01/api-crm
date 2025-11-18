import { ConversationState } from "@/v1/domain/entities/patient/conversation-state/ConversationState";
import { ConversationStateRepository } from "@/v1/domain/repository/conversation/ConversationState";

export class InMemoryConversationStateRepository
  implements ConversationStateRepository
{
  private states = new Map<string, ConversationState>();

  async get(userId: string): Promise<ConversationState | null> {
    return this.states.get(userId) || null;
  }

  async save(state: ConversationState): Promise<void> {
    state.lastMessageAt = new Date();
    this.states.set(state.userId, state);
  }

  async delete(userId: string): Promise<void> {
    this.states.delete(userId);
  }

  async cleanup(olderThan: Date): Promise<void> {
    for (const [userId, state] of this.states.entries()) {
      if (state.lastMessageAt < olderThan) {
        this.states.delete(userId);
      }
    }
  }
}
