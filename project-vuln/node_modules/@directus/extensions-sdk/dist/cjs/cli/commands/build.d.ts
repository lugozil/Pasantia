declare type BuildOptions = {
    type: string;
    input: string;
    output: string;
    language: string;
    force: boolean;
    watch: boolean;
    minify: boolean;
    sourcemap: boolean;
};
export default function build(options: BuildOptions): Promise<void>;
export {};
//# sourceMappingURL=build.d.ts.map