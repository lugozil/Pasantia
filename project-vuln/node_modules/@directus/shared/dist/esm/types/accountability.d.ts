import { Permission } from '.';
export declare type ShareScope = {
    collection: string;
    item: string;
};
export declare type Accountability = {
    role: string | null;
    user?: string | null;
    admin?: boolean;
    app?: boolean;
    permissions?: Permission[];
    share?: string;
    share_scope?: ShareScope;
    ip?: string;
    userAgent?: string;
};
//# sourceMappingURL=accountability.d.ts.map