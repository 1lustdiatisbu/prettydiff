/*global global, prettydiff*/
(function minify_markup_init():void {
    "use strict";
    const markup = function minify_markup(options:any):string {
        const data:parsedArray = options.parsed,
            lexer:string = "markup",
            c:number            = (options.end < 1 || options.end > data.token.length)
                ? data.token.length
                : options.end + 1,
            lf:"\r\n"|"\n"      = (options.crlf === true)
                ? "\r\n"
                : "\n",
            externalIndex:externalIndex = {},
            levels:number[] = (function minify_markup_levels():number[] {
                const level:number[]      = (options.start > 0)
                        ? Array(options.start).fill(0, 0, options.start)
                        : [],
                    nextIndex = function minify_markup_levels_next():number {
                        let x:number = a + 1,
                            y:number = 0;
                        if (data.types[x] === "comment" || data.types[x] === "attribute" || data.types[x] === "jsx_attribute_start") {
                            do {
                                if (data.types[x] === "jsx_attribute_start") {
                                    y = x;
                                    do {
                                        if (data.types[x] === "jsx_attribute_end" && data.begin[x] === y) {
                                            break;
                                        }
                                        x = x + 1;
                                    } while (x < c);
                                } else if (data.types[x] !== "comment" && data.types[x] !== "attribute") {
                                    return x;
                                }
                                x = x + 1;
                            } while (x < c);
                        }
                        return x;
                    },
                    external = function minify_markup_levels_external():void {
                        let skip = a;
                        do {
                            if (data.lexer[a + 1] === lexer && data.begin[a + 1] < skip && data.types[a + 1] !== "start" && data.types[a + 1] !== "singleton") {
                                break;
                            }
                            level.push(-20);
                            a = a + 1;
                        } while (a < c);
                        externalIndex[skip] = a;
                        level.push(-20);
                        next = nextIndex();
                    },
                    comment = function minify_markup_levels_comment():void {
                        let x:number = a,
                            test:boolean = false;
                        if (data.lines[a + 1] === 0) {
                            do {
                                if (data.lines[x] > 0) {
                                    test = true;
                                    break;
                                }
                                x = x - 1;
                            } while (x > comstart);
                            x = a;
                        } else {
                            test = true;
                        }
                        do {
                            level.push(-20);
                            x = x - 1;
                        } while (x > comstart);
                        if (test === true) {
                            if (data.types[x] === "attribute" || data.types[x] === "jsx_attribute_start") {
                                level[data.begin[x]] = -10;
                            } else {
                                level[x] = -10;
                            }
                        } else {
                            level[x] = -20;
                        }
                        comstart = -1;
                    };
                let a:number     = options.start,
                    next:number = 0,
                    comstart:number = -1;
                // data.lines -> space before token
                // level -> space after token
                do {
                    if (data.lexer[a] === lexer) {
                        if (data.types[a].indexOf("attribute") > -1) {
                            if (data.types[a] === "comment_attribute" && data.token[a].slice(0, 2) === "//") {
                                level.push(-10);
                            } else if (a < c - 1 && data.types[a + 1].indexOf("attribute") < 0) {
                                if (data.lines[a + 1] > 0) {
                                    level.push(-10);
                                } else {
                                    level.push(-20);
                                }
                            } else {
                                level.push(-10);
                            }
                        } else if (data.types[a] === "jsx_attribute_start") {
                            level.push(-20);
                        } else if (data.types[a] === "jsx_attribute_end") {
                            level.push(-10);
                        } else if (data.types[a] === "comment") {
                            if (comstart < 0) {
                                comstart = a;
                            }
                            if (data.types[a + 1] !== "comment") {
                                comment();
                            }
                        } else if (data.types[a] !== "comment") {
                            next = nextIndex();
                            if (data.lines[next] > 0 && (
                                data.types[a] === "content" ||
                                data.types[a] === "singleton" ||
                                data.types[next] === "content" ||
                                data.types[next] === "singleton" ||
                                (data.types[next] !== undefined && data.types[next].indexOf("attribute") > 0)
                            )) {
                                level.push(-10);
                            } else {
                                level.push(-20);
                            }
                        }
                    } else {
                        external();
                    }
                    a = a + 1;
                } while (a < c);
                return level;
            }());
        return (function minify_markup_apply():string {
            const build:string[]        = [],
                len:number = levels.length,
                // a new line character plus the correct amount of identation for the given line
                // of code
                attributeEnd = function minify_markup_apply_attributeEnd():void {
                    const parent:string = data.token[a],
                        regend:RegExp = (/(\/|\?)?>$/),
                        end:string[]|null = regend.exec(parent);
                    let y:number = a + 1,
                        x:number = 0,
                        jsx:boolean = false;
                    if (end === null) {
                        return;
                    }
                    data.token[a] = parent.replace(regend, "");
                    do {
                        if (data.types[y] === "jsx_attribute_end" && data.begin[data.begin[y]] === a) {
                            jsx = false;
                        } else if (data.begin[y] === a) {
                            if (data.types[y] === "jsx_attribute_start") {
                                jsx = true;
                            } else if (data.types[y].indexOf("attribute") < 0 && jsx === false) {
                                break;
                            }
                        } else if (jsx === false && (data.begin[y] < a || data.types[y].indexOf("attribute") < 0)) {
                            break;
                        }
                        y = y + 1;
                    } while (y < c);
                    if (data.types[y - 1] === "comment_attribute") {
                        x = y;
                        do {
                            y = y - 1;
                        } while (y > a && data.types[y - 1] === "comment_attribute");
                        if (data.lines[x] < 1) {
                            levels[y - 1] = -20;
                        }
                    }
                    data.token[y - 1] = data.token[y - 1] + end[0];
                };
            let a:number            = options.start,
                external:string = "",
                lastLevel:number = 0;
            if (options.top_comments === true && data.types[a] === "comment" && options.start === 0) {
                if (a > 0) {
                    build.push(lf);
                }
                do {
                    build.push(data.token[a]);
                    build.push(lf);
                    a = a + 1;
                } while (a < len && data.types[a] === "comment");
            }
            do {
                if (data.lexer[a] === lexer || prettydiff.minify[data.lexer[a]] === undefined) {
                    if ((data.types[a] === "start" || data.types[a] === "singleton" || data.types[a] === "xml" || data.types[a] === "sgml") && data.types[a].indexOf("attribute") < 0 && a < c - 1 && data.types[a + 1].indexOf("attribute") > -1) {
                        attributeEnd();
                    }
                    if (data.types[a] !== "comment" && data.types[a] !== "comment_attribute") {
                        build.push(data.token[a]);
                        if ((data.types[a] === "template" || data.types[a] === "template_start") && data.types[a - 1] === "content" && data.presv[a - 1] === true && options.mode === "minify" && levels[a] === -20) {
                            build.push(" ");
                        }
                        if (levels[a] > -1) {
                            lastLevel = levels[a];
                        } else if (levels[a] === -10 && data.types[a] !== "jsx_attribute_start") {
                            build.push(" ");
                        }
                    }
                } else {
                    if (externalIndex[a] === a && data.types[a] !== "reference") {
                        if (data.types[a] !== "comment") {
                            build.push(data.token[a]);
                        }
                    } else {
                        options.end = externalIndex[a];
                        options.indent_level = lastLevel;
                        options.start = a;
                        external = prettydiff.minify[data.lexer[a]](options).replace(/\s+$/, "");
                        build.push(external);
                        if (levels[prettydiff.iterator] > -1 && externalIndex[a] > a) {
                            build.push(lf);
                        }
                        a = prettydiff.iterator;
                    }
                }
                a = a + 1;
            } while (a < len);
            prettydiff.iterator = len - 1;
            if (build[0] === lf || build[0] === " ") {
                build[0] = "";
            }
            if (options.new_line === true && options.end === data.token.length) {
                build.push(lf);
            }
            return build.join("");
        }());
    };
    global.prettydiff.minify.markup = markup;
}());