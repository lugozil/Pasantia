import { InterfaceConfig, DisplayConfig, LayoutConfig, ModuleConfig, HookConfig, EndpointConfig, PanelConfig } from '../types';
export declare function defineInterface(config: InterfaceConfig): InterfaceConfig;
export declare function defineDisplay(config: DisplayConfig): DisplayConfig;
export declare function defineLayout<Options = any, Query = any>(config: LayoutConfig<Options, Query>): LayoutConfig<Options, Query>;
export declare function defineModule(config: ModuleConfig): ModuleConfig;
export declare function defineHook(config: HookConfig): HookConfig;
export declare function defineEndpoint(config: EndpointConfig): EndpointConfig;
export declare function definePanel(config: PanelConfig): PanelConfig;
//# sourceMappingURL=define-extension.d.ts.map