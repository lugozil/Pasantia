import { Extension, ExtensionPackageType, ExtensionType } from '../../types';
export declare function getPackageExtensions(root: string, types: readonly ExtensionPackageType[]): Promise<Extension[]>;
export declare function getLocalExtensions(root: string, types: readonly ExtensionType[]): Promise<Extension[]>;
//# sourceMappingURL=get-extensions.d.ts.map