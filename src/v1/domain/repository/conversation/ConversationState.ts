import { ConversationState } from "../../entities/patient/conversation-state/ConversationState";

export interface ConversationStateRepository {
  get(userId: string): Promise<ConversationState | null>;
  save(state: ConversationState): Promise<void>;
  delete(userId: string): Promise<void>;
  cleanup(olderThan: Date): Promise<void>;
}
