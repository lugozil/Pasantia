"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const define_extension_1 = require("./define-extension");
const vue_1 = require("vue");
const mockComponent = (0, vue_1.defineComponent)({});
const mockHandler = () => {
    return '';
};
describe('define-extensions', () => {
    const types = [];
    const mockRecord = () => {
        return { test: 'test' };
    };
    const interfaceConfig = { id: '1', name: 'test', icon: 'icon', component: mockComponent, types: types, options: {} };
    const displayConfig = { id: '1', name: 'test', icon: 'icon', component: mockComponent, types: types, options: {} };
    const layoutConfig = {
        id: '1',
        name: 'test',
        icon: 'icon',
        component: mockComponent,
        slots: { options: mockComponent, sidebar: mockComponent, actions: mockComponent },
        setup: mockRecord,
    };
    const moduleConfig = {
        id: '1',
        name: 'test',
        icon: 'icon',
        routes: [],
    };
    const hookHandler = () => {
        return { test: (..._values) => undefined };
    };
    const endpointConfig = { id: '1', handler: mockHandler };
    it('return an interface config', () => {
        expect((0, define_extension_1.defineInterface)(interfaceConfig)).toBe(interfaceConfig);
    });
    it('return a display config', () => {
        expect((0, define_extension_1.defineDisplay)(displayConfig)).toBe(displayConfig);
    });
    it('return a layout config', () => {
        expect((0, define_extension_1.defineLayout)(layoutConfig)).toBe(layoutConfig);
    });
    it('return a module config', () => {
        expect((0, define_extension_1.defineModule)(moduleConfig)).toBe(moduleConfig);
    });
    it('return a hook config', () => {
        expect((0, define_extension_1.defineHook)(hookHandler)).toBe(hookHandler);
    });
    it('return an endpoint config', () => {
        expect((0, define_extension_1.defineEndpoint)(endpointConfig)).toBe(endpointConfig);
    });
});
