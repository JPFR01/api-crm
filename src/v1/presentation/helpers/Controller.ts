import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';

export interface Controller {
    handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
