import { ActionHandler, FilterHandler, InitHandler, ScheduleHandler } from './events';
import { ApiExtensionContext } from './extensions';
declare type RegisterFunctions = {
    filter: (event: string, handler: FilterHandler) => void;
    action: (event: string, handler: ActionHandler) => void;
    init: (event: string, handler: InitHandler) => void;
    schedule: (cron: string, handler: ScheduleHandler) => void;
};
declare type HookHandlerFunction = (register: RegisterFunctions, context: ApiExtensionContext) => void;
export declare type HookConfig = HookHandlerFunction;
export {};
//# sourceMappingURL=hooks.d.ts.map