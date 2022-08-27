import { Router } from 'express';
import { ApiExtensionContext } from './extensions';
declare type EndpointHandlerFunction = (router: Router, context: ApiExtensionContext) => void;
interface EndpointAdvancedConfig {
    id: string;
    handler: EndpointHandlerFunction;
}
export declare type EndpointConfig = EndpointHandlerFunction | EndpointAdvancedConfig;
export {};
//# sourceMappingURL=endpoints.d.ts.map