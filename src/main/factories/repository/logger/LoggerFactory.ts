import {Logger} from '@/infrastructure/repository/logger/Logger';
import {Logger as _Logger} from '@/v1/domain/repository/Logger';

export const LoggerFactory = (): _Logger => {
    return new Logger();
};
