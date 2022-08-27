import { Knex } from 'knex';
import { Accountability } from './accountability';
import { SchemaOverview } from './schema';
export declare type EventContext = {
    database: Knex;
    schema: SchemaOverview | null;
    accountability: Accountability | null;
};
export declare type FilterHandler = (payload: any, meta: Record<string, any>, context: EventContext) => any | Promise<any>;
export declare type ActionHandler = (meta: Record<string, any>, context: EventContext) => void;
export declare type InitHandler = (meta: Record<string, any>) => void;
export declare type ScheduleHandler = () => void;
//# sourceMappingURL=events.d.ts.map