
interface record {
    begin: number;
    lexer: string;
    lines: number;
    presv: boolean;
    stack: string;
    token: string;
    types: string;
}
interface parsedArray {
    begin: number[];
    lexer: string[];
    lines: number[];
    presv: boolean[];
    stack: string[];
    token: string[];
    types: string[];
}
interface parsedObject {
    [index: number]: record;
}
interface optionFunctions {
    definitions?: {};

}
type mode = "analysis" | "beautify" | "diff" | "minify" | "parse";
interface options {
    accessibility?: boolean;
    api?: "dom" | "node";
    brace_style?: "collapse" | "collapse-preserve-inline" | "expand" | "none";
    braceline?: boolean;
    braces?: boolean;
    bracepadding?: boolean;
    comments?: boolean;
    commline?: boolean;
    compressedcss?: boolean;
    conditional?: boolean;
    content?: boolean;
    context?: number;
    correct?: boolean;
    crlf?: boolean;
    cssinsertlines?: boolean;
    csvchar?: string;
    diff?: string;
    diffcli?: boolean;
    diffcomments?: boolean;
    difflabel?: string;
    diffspaceignore?: boolean;
    diffview?: "inline" | "sidebyside";
    elseline?: boolean;
    endcomma?: "always" | "multiline" | "never";
    formatArray?: "default" | "indent" | "inline";
    formatObject?: "default" | "indent" | "inline";
    force_attribute?: boolean;
    force_indent?: boolean;
    functionname?: boolean;
    functions: any;
    inchar?: string;
    inlevel?: number;
    insize?: number;
    jsscope?: "none" | "html" | "report";
    lang: string;
    langdefault?: string;
    lexer: string;
    methodchain?: "chain" | "indent" | "none";
    miniwrap?: boolean;
    mode?: mode;
    neverflatten?: boolean;
    newline?: boolean;
    nocaseindent?: boolean;
    nochainindent?: boolean;
    noleadzero?: boolean;
    objsort?: boolean;
    parsed?: parsedArray;
    parseFormat?: "htmltable" | "parallel" | "sequential";
    parseSpace?: boolean;
    preserve?: number;
    preserveComment?: boolean;
    quoteConvert?: "double" | "none" | "single";
    selectorlist?: boolean;
    semicolon?: boolean;
    source: string;
    sourcelabel?: string;
    space?: boolean;
    spaceclose?: boolean;
    style?: boolean;
    styleguide?: string;
    tagmerge?: boolean;
    tagsort?: boolean;
    ternaryline?: boolean;
    textpreserve?: boolean;
    topcoms?: boolean;
    unformatted?: boolean;
    varword?: "each" | "list" | "none";
    vertical?: boolean;
    wrap?: number;
}
interface parseOptions extends options {
    lexer: "string";
    lexerOptions: {
        [key: string]: {
            [key: string]: any;
        }
    };
    outputFormat: "objects" | "arrays";
}
interface library {
    (options: options): string;
}
interface dom {
    [key: string]: any;
}
declare var ace: any;
type languageAuto = [string, string, string];
interface language {
    auto(sample:string, defaultLang:string): languageAuto;
    nameproper(input:string): string;
    setlangmode(input:string):string;
}
interface finalFile {
    css: {
        color: {
            canvas: string;
            shadow: string;
            white: string;
        };
        global: string;
        reports: string;
    };
    html: {
        body: string;
        color: string;
        end: string;
        head: string;
        intro: string;
        script: string;
    };
    order: string[];
    script: {
        beautify: string;
        diff: string;
        minimal: string;
    };
}
interface diffview {
    (options:options): [string, number, number]
}
interface prettydiff {
    analyze: {
        [key: string]: library;
    };
    app(): string;
    beautify: {
        [key: string]: library;
    };
    diffview?: diffview;
    dom?: dom;
    finalFile?: finalFile;
    language?: language;
    minify: {
        [key: string]: library;
    };
    meta?: {};
    options?: options;
}
interface meta {
    error: string;
    lang: [string, string, string];
    time: string;
    insize: number;
    outsize: number;
    difftotal: number;
    difflines: number;
}
type codes = [string, number, number, number, number];
interface opcodes extends Array<codes> {
    [index: number]: codes;
}
interface difftable {
    [key: string]: [number, number];
}
interface compareStore extends Array<[number, number]>{
    [index:number]: [number, number];
}

interface Window {
    prettydiff: prettydiff;
    parseFramework: any;
}
interface pdNode {
    fs: "fs";
    http: "http";
    https: "https";
    path: "path";
}
declare var window: Window;
declare module NodeJS {
    interface Global {
        parseFramework: any;
        prettydiff: prettydiff
    }
}