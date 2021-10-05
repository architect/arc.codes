'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var onigasm = require('onigasm');
var vscodeTextmate = require('vscode-textmate');

const themes = [
    'css-variables',
    'dark-plus',
    'dracula-soft',
    'dracula',
    'github-dark-dimmed',
    'github-dark',
    'github-light',
    'light-plus',
    'material-darker',
    'material-default',
    'material-lighter',
    'material-ocean',
    'material-palenight',
    'min-dark',
    'min-light',
    'monokai',
    'nord',
    'one-dark-pro',
    'poimandres',
    'slack-dark',
    'slack-ochin',
    'solarized-dark',
    'solarized-light',
    'vitesse-dark',
    'vitesse-light'
];

const languages = [
    {
        id: 'abap',
        scopeName: 'source.abap',
        path: 'abap.tmLanguage.json',
        samplePath: 'abap.sample'
    },
    {
        id: 'actionscript-3',
        scopeName: 'source.actionscript.3',
        path: 'actionscript-3.tmLanguage.json',
        samplePath: 'actionscript-3.sample'
    },
    {
        id: 'ada',
        scopeName: 'source.ada',
        path: 'ada.tmLanguage.json',
        samplePath: 'ada.sample'
    },
    {
        id: 'apache',
        scopeName: 'source.apacheconf',
        path: 'apache.tmLanguage.json'
    },
    {
        id: 'apex',
        scopeName: 'source.apex',
        path: 'apex.tmLanguage.json',
        samplePath: 'apex.sample'
    },
    {
        id: 'apl',
        scopeName: 'source.apl',
        path: 'apl.tmLanguage.json',
        embeddedLangs: ['html', 'xml', 'css', 'javascript', 'json']
    },
    {
        id: 'applescript',
        scopeName: 'source.applescript',
        path: 'applescript.tmLanguage.json',
        samplePath: 'applescript.sample'
    },
    {
        id: 'asm',
        scopeName: 'source.asm.x86_64',
        path: 'asm.tmLanguage.json',
        samplePath: 'asm.sample'
    },
    {
        id: 'astro',
        scopeName: 'text.html.astro',
        path: 'astro.tmLanguage.json',
        embeddedLangs: ['css', 'sass', 'scss', 'tsx']
    },
    {
        id: 'awk',
        scopeName: 'source.awk',
        path: 'awk.tmLanguage.json',
        samplePath: 'awk.sample'
    },
    {
        id: 'bat',
        scopeName: 'source.batchfile',
        path: 'bat.tmLanguage.json',
        samplePath: 'bat.sample',
        aliases: ['batch']
    },
    {
        id: 'c',
        scopeName: 'source.c',
        path: 'c.tmLanguage.json',
        samplePath: 'c.sample'
    },
    {
        id: 'clojure',
        scopeName: 'source.clojure',
        path: 'clojure.tmLanguage.json',
        samplePath: 'clojure.sample',
        aliases: ['clj']
    },
    {
        id: 'cobol',
        scopeName: 'source.cobol',
        path: 'cobol.tmLanguage.json',
        samplePath: 'cobol.sample',
        embeddedLangs: ['sql', 'html', 'java']
    },
    {
        id: 'coffee',
        scopeName: 'source.coffee',
        path: 'coffee.tmLanguage.json',
        samplePath: 'coffee.sample',
        embeddedLangs: ['javascript']
    },
    {
        id: 'cpp',
        scopeName: 'source.cpp',
        path: 'cpp.tmLanguage.json',
        samplePath: 'cpp.sample',
        embeddedLangs: ['sql']
    },
    {
        id: 'crystal',
        scopeName: 'source.crystal',
        path: 'crystal.tmLanguage.json',
        samplePath: 'crystal.sample',
        embeddedLangs: ['html', 'sql', 'css', 'c', 'javascript', 'shellscript']
    },
    {
        id: 'csharp',
        scopeName: 'source.cs',
        path: 'csharp.tmLanguage.json',
        samplePath: 'csharp.sample',
        aliases: ['c#']
    },
    {
        id: 'css',
        scopeName: 'source.css',
        path: 'css.tmLanguage.json',
        samplePath: 'css.sample'
    },
    {
        id: 'd',
        scopeName: 'source.d',
        path: 'd.tmLanguage.json',
        samplePath: 'd.sample'
    },
    {
        id: 'dart',
        scopeName: 'source.dart',
        path: 'dart.tmLanguage.json',
        samplePath: 'dart.sample'
    },
    {
        id: 'diff',
        scopeName: 'source.diff',
        path: 'diff.tmLanguage.json',
        samplePath: 'diff.sample'
    },
    {
        id: 'docker',
        scopeName: 'source.dockerfile',
        path: 'docker.tmLanguage.json',
        samplePath: 'docker.sample'
    },
    {
        id: 'dream-maker',
        scopeName: 'source.dm',
        path: 'dream-maker.tmLanguage.json'
    },
    {
        id: 'elixir',
        scopeName: 'source.elixir',
        path: 'elixir.tmLanguage.json',
        samplePath: 'elixir.sample',
        embeddedLangs: ['html']
    },
    {
        id: 'elm',
        scopeName: 'source.elm',
        path: 'elm.tmLanguage.json',
        samplePath: 'elm.sample'
    },
    {
        id: 'erb',
        scopeName: 'text.html.erb',
        path: 'erb.tmLanguage.json',
        samplePath: 'erb.sample',
        embeddedLangs: ['html', 'ruby']
    },
    {
        id: 'erlang',
        scopeName: 'source.erlang',
        path: 'erlang.tmLanguage.json',
        samplePath: 'erlang.sample'
    },
    {
        id: 'fish',
        scopeName: 'source.fish',
        path: 'fish.tmLanguage.json',
        samplePath: 'fish.sample'
    },
    {
        id: 'fsharp',
        scopeName: 'source.fsharp',
        path: 'fsharp.tmLanguage.json',
        samplePath: 'fsharp.sample',
        aliases: ['f#'],
        embeddedLangs: ['markdown']
    },
    {
        id: 'gherkin',
        scopeName: 'text.gherkin.feature',
        path: 'gherkin.tmLanguage.json'
    },
    {
        id: 'git-commit',
        scopeName: 'text.git-commit',
        path: 'git-commit.tmLanguage.json',
        embeddedLangs: ['diff']
    },
    {
        id: 'git-rebase',
        scopeName: 'text.git-rebase',
        path: 'git-rebase.tmLanguage.json',
        embeddedLangs: ['shellscript']
    },
    {
        id: 'gnuplot',
        scopeName: 'source.gnuplot',
        path: 'gnuplot.tmLanguage.json'
    },
    {
        id: 'go',
        scopeName: 'source.go',
        path: 'go.tmLanguage.json',
        samplePath: 'go.sample'
    },
    {
        id: 'graphql',
        scopeName: 'source.graphql',
        path: 'graphql.tmLanguage.json',
        embeddedLangs: ['javascript', 'typescript', 'jsx', 'tsx']
    },
    {
        id: 'groovy',
        scopeName: 'source.groovy',
        path: 'groovy.tmLanguage.json'
    },
    {
        id: 'hack',
        scopeName: 'source.hack',
        path: 'hack.tmLanguage.json',
        embeddedLangs: ['html', 'sql']
    },
    {
        id: 'haml',
        scopeName: 'text.haml',
        path: 'haml.tmLanguage.json',
        embeddedLangs: ['ruby', 'javascript', 'sass', 'coffee', 'markdown', 'css']
    },
    {
        id: 'handlebars',
        scopeName: 'text.html.handlebars',
        path: 'handlebars.tmLanguage.json',
        aliases: ['hbs'],
        embeddedLangs: ['html', 'css', 'javascript', 'yaml']
    },
    {
        id: 'haskell',
        scopeName: 'source.haskell',
        path: 'haskell.tmLanguage.json'
    },
    {
        id: 'hcl',
        scopeName: 'source.hcl',
        path: 'hcl.tmLanguage.json'
    },
    {
        id: 'hlsl',
        scopeName: 'source.hlsl',
        path: 'hlsl.tmLanguage.json'
    },
    {
        id: 'html',
        scopeName: 'text.html.basic',
        path: 'html.tmLanguage.json',
        samplePath: 'html.sample',
        embeddedLangs: ['javascript', 'css']
    },
    {
        id: 'ini',
        scopeName: 'source.ini',
        path: 'ini.tmLanguage.json'
    },
    {
        id: 'java',
        scopeName: 'source.java',
        path: 'java.tmLanguage.json',
        samplePath: 'java.sample'
    },
    {
        id: 'javascript',
        scopeName: 'source.js',
        path: 'javascript.tmLanguage.json',
        samplePath: 'javascript.sample',
        aliases: ['js']
    },
    {
        id: 'jinja-html',
        scopeName: 'text.html.jinja',
        path: 'jinja-html.tmLanguage.json',
        embeddedLangs: ['html']
    },
    {
        id: 'json',
        scopeName: 'source.json',
        path: 'json.tmLanguage.json'
    },
    {
        id: 'jsonc',
        scopeName: 'source.json.comments',
        path: 'jsonc.tmLanguage.json'
    },
    {
        id: 'jsonnet',
        scopeName: 'source.jsonnet',
        path: 'jsonnet.tmLanguage.json'
    },
    {
        id: 'jssm',
        scopeName: 'source.jssm',
        path: 'jssm.tmLanguage.json',
        samplePath: 'jssm.sample',
        aliases: ['fsl']
    },
    {
        id: 'jsx',
        scopeName: 'source.js.jsx',
        path: 'jsx.tmLanguage.json'
    },
    {
        id: 'julia',
        scopeName: 'source.julia',
        path: 'julia.tmLanguage.json',
        embeddedLangs: ['cpp', 'python', 'javascript', 'r', 'sql']
    },
    {
        id: 'jupyter',
        scopeName: 'source.jupyter',
        path: 'jupyter.tmLanguage.json',
        embeddedLangs: ['json']
    },
    {
        id: 'kotlin',
        scopeName: 'source.kotlin',
        path: 'kotlin.tmLanguage.json'
    },
    {
        id: 'latex',
        scopeName: 'text.tex.latex',
        path: 'latex.tmLanguage.json',
        embeddedLangs: ['tex', 'css', 'html', 'java', 'javascript', 'typescript', 'lua', 'python', 'julia', 'ruby', 'xml', 'yaml', 'cpp', 'haskell', 'scala', 'gnuplot']
    },
    {
        id: 'less',
        scopeName: 'source.css.less',
        path: 'less.tmLanguage.json',
        embeddedLangs: ['css']
    },
    {
        id: 'lisp',
        scopeName: 'source.lisp',
        path: 'lisp.tmLanguage.json'
    },
    {
        id: 'logo',
        scopeName: 'source.logo',
        path: 'logo.tmLanguage.json'
    },
    {
        id: 'lua',
        scopeName: 'source.lua',
        path: 'lua.tmLanguage.json',
        embeddedLangs: ['c']
    },
    {
        id: 'make',
        scopeName: 'source.makefile',
        path: 'make.tmLanguage.json',
        aliases: ['makefile']
    },
    {
        id: 'markdown',
        scopeName: 'text.html.markdown',
        path: 'markdown.tmLanguage.json',
        aliases: ['md'],
        embeddedLangs: ['css', 'html', 'ini', 'java', 'lua', 'make', 'perl', 'r', 'ruby', 'php', 'sql', 'vb', 'xml', 'xsl', 'yaml', 'bat', 'clojure', 'coffee', 'c', 'cpp', 'diff', 'docker', 'git-commit', 'git-rebase', 'go', 'groovy', 'pug', 'javascript', 'json', 'jsonc', 'less', 'objective-c', 'swift', 'scss', 'raku', 'powershell', 'python', 'rust', 'scala', 'shellscript', 'typescript', 'tsx', 'csharp', 'fsharp', 'dart', 'handlebars', 'erlang', 'elixir']
    },
    {
        id: 'matlab',
        scopeName: 'source.matlab',
        path: 'matlab.tmLanguage.json'
    },
    {
        id: 'mdx',
        scopeName: 'text.html.markdown.jsx',
        path: 'mdx.tmLanguage.json',
        embeddedLangs: ['jsx', 'markdown']
    },
    {
        id: 'nginx',
        scopeName: 'source.nginx',
        path: 'nginx.tmLanguage.json'
    },
    {
        id: 'nim',
        scopeName: 'source.nim',
        path: 'nim.tmLanguage.json',
        embeddedLangs: ['c', 'html', 'xml', 'javascript', 'css', 'markdown']
    },
    {
        id: 'nix',
        scopeName: 'source.nix',
        path: 'nix.tmLanguage.json'
    },
    {
        id: 'objective-c',
        scopeName: 'source.objc',
        path: 'objective-c.tmLanguage.json',
        aliases: ['objc']
    },
    {
        id: 'objective-cpp',
        scopeName: 'source.objcpp',
        path: 'objective-cpp.tmLanguage.json'
    },
    {
        id: 'ocaml',
        scopeName: 'source.ocaml',
        path: 'ocaml.tmLanguage.json'
    },
    {
        id: 'pascal',
        scopeName: 'source.pascal',
        path: 'pascal.tmLanguage.json'
    },
    {
        id: 'perl',
        scopeName: 'source.perl',
        path: 'perl.tmLanguage.json',
        embeddedLangs: ['html', 'xml', 'css', 'javascript', 'sql']
    },
    {
        id: 'php',
        scopeName: 'source.php',
        path: 'php.tmLanguage.json',
        embeddedLangs: ['html', 'xml', 'sql', 'javascript', 'json', 'css']
    },
    {
        id: 'plsql',
        scopeName: 'source.plsql.oracle',
        path: 'plsql.tmLanguage.json'
    },
    {
        id: 'postcss',
        scopeName: 'source.css.postcss',
        path: 'postcss.tmLanguage.json'
    },
    {
        id: 'powershell',
        scopeName: 'source.powershell',
        path: 'powershell.tmLanguage.json',
        aliases: ['ps', 'ps1']
    },
    {
        id: 'prisma',
        scopeName: 'source.prisma',
        path: 'prisma.tmLanguage.json',
        samplePath: 'prisma.sample'
    },
    {
        id: 'prolog',
        scopeName: 'source.prolog',
        path: 'prolog.tmLanguage.json'
    },
    {
        id: 'pug',
        scopeName: 'text.pug',
        path: 'pug.tmLanguage.json',
        aliases: ['jade'],
        embeddedLangs: ['javascript', 'css', 'sass', 'stylus', 'coffee', 'html']
    },
    {
        id: 'puppet',
        scopeName: 'source.puppet',
        path: 'puppet.tmLanguage.json'
    },
    {
        id: 'purescript',
        scopeName: 'source.purescript',
        path: 'purescript.tmLanguage.json'
    },
    {
        id: 'python',
        scopeName: 'source.python',
        path: 'python.tmLanguage.json',
        samplePath: 'python.sample',
        aliases: ['py']
    },
    {
        id: 'r',
        scopeName: 'source.r',
        path: 'r.tmLanguage.json'
    },
    {
        id: 'raku',
        scopeName: 'source.perl.6',
        path: 'raku.tmLanguage.json',
        aliases: ['perl6']
    },
    {
        id: 'razor',
        scopeName: 'text.aspnetcorerazor',
        path: 'razor.tmLanguage.json',
        embeddedLangs: ['html', 'csharp']
    },
    {
        id: 'riscv',
        scopeName: 'source.riscv',
        path: 'riscv.tmLanguage.json'
    },
    {
        id: 'ruby',
        scopeName: 'source.ruby',
        path: 'ruby.tmLanguage.json',
        samplePath: 'ruby.sample',
        aliases: ['rb'],
        embeddedLangs: ['html', 'xml', 'sql', 'css', 'c', 'javascript', 'shellscript', 'lua']
    },
    {
        id: 'rust',
        scopeName: 'source.rust',
        path: 'rust.tmLanguage.json'
    },
    {
        id: 'sas',
        scopeName: 'source.sas',
        path: 'sas.tmLanguage.json',
        embeddedLangs: ['sql']
    },
    {
        id: 'sass',
        scopeName: 'source.sass',
        path: 'sass.tmLanguage.json'
    },
    {
        id: 'scala',
        scopeName: 'source.scala',
        path: 'scala.tmLanguage.json'
    },
    {
        id: 'scheme',
        scopeName: 'source.scheme',
        path: 'scheme.tmLanguage.json'
    },
    {
        id: 'scss',
        scopeName: 'source.css.scss',
        path: 'scss.tmLanguage.json',
        embeddedLangs: ['css']
    },
    {
        id: 'shaderlab',
        scopeName: 'source.shaderlab',
        path: 'shaderlab.tmLanguage.json',
        aliases: ['shader'],
        embeddedLangs: ['hlsl']
    },
    {
        id: 'shellscript',
        scopeName: 'source.shell',
        path: 'shellscript.tmLanguage.json',
        aliases: ['shell', 'bash', 'sh', 'zsh'],
        embeddedLangs: ['ruby', 'python', 'applescript', 'html', 'markdown']
    },
    {
        id: 'smalltalk',
        scopeName: 'source.smalltalk',
        path: 'smalltalk.tmLanguage.json'
    },
    {
        id: 'solidity',
        scopeName: 'source.solidity',
        path: 'solidity.tmLanguage.json'
    },
    {
        id: 'sparql',
        scopeName: 'source.sparql',
        path: 'sparql.tmLanguage.json',
        samplePath: 'sparql.sample',
        embeddedLangs: ['turtle']
    },
    {
        id: 'sql',
        scopeName: 'source.sql',
        path: 'sql.tmLanguage.json'
    },
    {
        id: 'ssh-config',
        scopeName: 'source.ssh-config',
        path: 'ssh-config.tmLanguage.json'
    },
    {
        id: 'stylus',
        scopeName: 'source.stylus',
        path: 'stylus.tmLanguage.json',
        aliases: ['styl']
    },
    {
        id: 'svelte',
        scopeName: 'source.svelte',
        path: 'svelte.tmLanguage.json',
        embeddedLangs: ['javascript', 'typescript', 'coffee', 'stylus', 'sass', 'css', 'scss', 'less', 'postcss', 'pug', 'markdown']
    },
    {
        id: 'swift',
        scopeName: 'source.swift',
        path: 'swift.tmLanguage.json'
    },
    {
        id: 'system-verilog',
        scopeName: 'source.systemverilog',
        path: 'system-verilog.tmLanguage.json'
    },
    {
        id: 'tcl',
        scopeName: 'source.tcl',
        path: 'tcl.tmLanguage.json'
    },
    {
        id: 'tex',
        scopeName: 'text.tex',
        path: 'tex.tmLanguage.json',
        embeddedLangs: ['r']
    },
    {
        id: 'toml',
        scopeName: 'source.toml',
        path: 'toml.tmLanguage.json'
    },
    {
        id: 'tsx',
        scopeName: 'source.tsx',
        path: 'tsx.tmLanguage.json',
        samplePath: 'tsx.sample'
    },
    {
        id: 'turtle',
        scopeName: 'source.turtle',
        path: 'turtle.tmLanguage.json',
        samplePath: 'turtle.sample'
    },
    {
        id: 'twig',
        scopeName: 'text.html.twig',
        path: 'twig.tmLanguage.json',
        embeddedLangs: ['css', 'javascript', 'php', 'python', 'ruby']
    },
    {
        id: 'typescript',
        scopeName: 'source.ts',
        path: 'typescript.tmLanguage.json',
        aliases: ['ts']
    },
    {
        id: 'vb',
        scopeName: 'source.asp.vb.net',
        path: 'vb.tmLanguage.json',
        aliases: ['cmd']
    },
    {
        id: 'verilog',
        scopeName: 'source.verilog',
        path: 'verilog.tmLanguage.json'
    },
    {
        id: 'vhdl',
        scopeName: 'source.vhdl',
        path: 'vhdl.tmLanguage.json'
    },
    {
        id: 'viml',
        scopeName: 'source.viml',
        path: 'viml.tmLanguage.json'
    },
    {
        id: 'vue-html',
        scopeName: 'text.html.vue-html',
        path: 'vue-html.tmLanguage.json',
        embeddedLangs: ['vue', 'javascript']
    },
    {
        id: 'vue',
        scopeName: 'source.vue',
        path: 'vue.tmLanguage.json',
        embeddedLangs: ['json', 'markdown', 'pug', 'haml', 'vue-html', 'sass', 'scss', 'less', 'stylus', 'postcss', 'css', 'typescript', 'coffee', 'javascript']
    },
    {
        id: 'wasm',
        scopeName: 'source.wat',
        path: 'wasm.tmLanguage.json'
    },
    {
        id: 'wenyan',
        scopeName: 'source.wenyan',
        path: 'wenyan.tmLanguage.json',
        aliases: ['文言']
    },
    {
        id: 'xml',
        scopeName: 'text.xml',
        path: 'xml.tmLanguage.json',
        embeddedLangs: ['java']
    },
    {
        id: 'xsl',
        scopeName: 'text.xml.xsl',
        path: 'xsl.tmLanguage.json',
        embeddedLangs: ['xml']
    },
    {
        id: 'yaml',
        scopeName: 'source.yaml',
        path: 'yaml.tmLanguage.json'
    }
];

exports.FontStyle = void 0;
(function (FontStyle) {
    FontStyle[FontStyle["NotSet"] = -1] = "NotSet";
    FontStyle[FontStyle["None"] = 0] = "None";
    FontStyle[FontStyle["Italic"] = 1] = "Italic";
    FontStyle[FontStyle["Bold"] = 2] = "Bold";
    FontStyle[FontStyle["Underline"] = 4] = "Underline";
})(exports.FontStyle || (exports.FontStyle = {}));
class StackElementMetadata {
    static toBinaryStr(metadata) {
        let r = metadata.toString(2);
        while (r.length < 32) {
            r = '0' + r;
        }
        return r;
    }
    static printMetadata(metadata) {
        let languageId = StackElementMetadata.getLanguageId(metadata);
        let tokenType = StackElementMetadata.getTokenType(metadata);
        let fontStyle = StackElementMetadata.getFontStyle(metadata);
        let foreground = StackElementMetadata.getForeground(metadata);
        let background = StackElementMetadata.getBackground(metadata);
        console.log({
            languageId: languageId,
            tokenType: tokenType,
            fontStyle: fontStyle,
            foreground: foreground,
            background: background
        });
    }
    static getLanguageId(metadata) {
        return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
    }
    static getTokenType(metadata) {
        return (metadata & 1792 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
    }
    static getFontStyle(metadata) {
        return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
    }
    static getForeground(metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    }
    static getBackground(metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    }
    static set(metadata, languageId, tokenType, fontStyle, foreground, background) {
        let _languageId = StackElementMetadata.getLanguageId(metadata);
        let _tokenType = StackElementMetadata.getTokenType(metadata);
        let _fontStyle = StackElementMetadata.getFontStyle(metadata);
        let _foreground = StackElementMetadata.getForeground(metadata);
        let _background = StackElementMetadata.getBackground(metadata);
        if (languageId !== 0) {
            _languageId = languageId;
        }
        if (tokenType !== 0 /* Other */) {
            _tokenType =
                tokenType === 8 /* MetaEmbedded */ ? 0 /* Other */ : tokenType;
        }
        if (fontStyle !== exports.FontStyle.NotSet) {
            _fontStyle = fontStyle;
        }
        if (foreground !== 0) {
            _foreground = foreground;
        }
        if (background !== 0) {
            _background = background;
        }
        return (((_languageId << 0 /* LANGUAGEID_OFFSET */) |
            (_tokenType << 8 /* TOKEN_TYPE_OFFSET */) |
            (_fontStyle << 11 /* FONT_STYLE_OFFSET */) |
            (_foreground << 14 /* FOREGROUND_OFFSET */) |
            (_background << 23 /* BACKGROUND_OFFSET */)) >>>
            0);
    }
}

// This is a generated file. Do not edit.
var Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
var ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
var ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;

var unicode = {
	Space_Separator: Space_Separator,
	ID_Start: ID_Start,
	ID_Continue: ID_Continue
};

var util = {
    isSpaceSeparator (c) {
        return typeof c === 'string' && unicode.Space_Separator.test(c)
    },

    isIdStartChar (c) {
        return typeof c === 'string' && (
            (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c === '$') || (c === '_') ||
        unicode.ID_Start.test(c)
        )
    },

    isIdContinueChar (c) {
        return typeof c === 'string' && (
            (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        (c === '$') || (c === '_') ||
        (c === '\u200C') || (c === '\u200D') ||
        unicode.ID_Continue.test(c)
        )
    },

    isDigit (c) {
        return typeof c === 'string' && /[0-9]/.test(c)
    },

    isHexDigit (c) {
        return typeof c === 'string' && /[0-9A-Fa-f]/.test(c)
    },
};

let source;
let parseState;
let stack;
let pos;
let line;
let column;
let token;
let key;
let root;

var parse = function parse (text, reviver) {
    source = String(text);
    parseState = 'start';
    stack = [];
    pos = 0;
    line = 1;
    column = 0;
    token = undefined;
    key = undefined;
    root = undefined;

    do {
        token = lex();

        // This code is unreachable.
        // if (!parseStates[parseState]) {
        //     throw invalidParseState()
        // }

        parseStates[parseState]();
    } while (token.type !== 'eof')

    if (typeof reviver === 'function') {
        return internalize({'': root}, '', reviver)
    }

    return root
};

function internalize (holder, name, reviver) {
    const value = holder[name];
    if (value != null && typeof value === 'object') {
        for (const key in value) {
            const replacement = internalize(value, key, reviver);
            if (replacement === undefined) {
                delete value[key];
            } else {
                value[key] = replacement;
            }
        }
    }

    return reviver.call(holder, name, value)
}

let lexState;
let buffer;
let doubleQuote;
let sign;
let c;

function lex () {
    lexState = 'default';
    buffer = '';
    doubleQuote = false;
    sign = 1;

    for (;;) {
        c = peek();

        // This code is unreachable.
        // if (!lexStates[lexState]) {
        //     throw invalidLexState(lexState)
        // }

        const token = lexStates[lexState]();
        if (token) {
            return token
        }
    }
}

function peek () {
    if (source[pos]) {
        return String.fromCodePoint(source.codePointAt(pos))
    }
}

function read () {
    const c = peek();

    if (c === '\n') {
        line++;
        column = 0;
    } else if (c) {
        column += c.length;
    } else {
        column++;
    }

    if (c) {
        pos += c.length;
    }

    return c
}

const lexStates = {
    default () {
        switch (c) {
        case '\t':
        case '\v':
        case '\f':
        case ' ':
        case '\u00A0':
        case '\uFEFF':
        case '\n':
        case '\r':
        case '\u2028':
        case '\u2029':
            read();
            return

        case '/':
            read();
            lexState = 'comment';
            return

        case undefined:
            read();
            return newToken('eof')
        }

        if (util.isSpaceSeparator(c)) {
            read();
            return
        }

        // This code is unreachable.
        // if (!lexStates[parseState]) {
        //     throw invalidLexState(parseState)
        // }

        return lexStates[parseState]()
    },

    comment () {
        switch (c) {
        case '*':
            read();
            lexState = 'multiLineComment';
            return

        case '/':
            read();
            lexState = 'singleLineComment';
            return
        }

        throw invalidChar(read())
    },

    multiLineComment () {
        switch (c) {
        case '*':
            read();
            lexState = 'multiLineCommentAsterisk';
            return

        case undefined:
            throw invalidChar(read())
        }

        read();
    },

    multiLineCommentAsterisk () {
        switch (c) {
        case '*':
            read();
            return

        case '/':
            read();
            lexState = 'default';
            return

        case undefined:
            throw invalidChar(read())
        }

        read();
        lexState = 'multiLineComment';
    },

    singleLineComment () {
        switch (c) {
        case '\n':
        case '\r':
        case '\u2028':
        case '\u2029':
            read();
            lexState = 'default';
            return

        case undefined:
            read();
            return newToken('eof')
        }

        read();
    },

    value () {
        switch (c) {
        case '{':
        case '[':
            return newToken('punctuator', read())

        case 'n':
            read();
            literal('ull');
            return newToken('null', null)

        case 't':
            read();
            literal('rue');
            return newToken('boolean', true)

        case 'f':
            read();
            literal('alse');
            return newToken('boolean', false)

        case '-':
        case '+':
            if (read() === '-') {
                sign = -1;
            }

            lexState = 'sign';
            return

        case '.':
            buffer = read();
            lexState = 'decimalPointLeading';
            return

        case '0':
            buffer = read();
            lexState = 'zero';
            return

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            buffer = read();
            lexState = 'decimalInteger';
            return

        case 'I':
            read();
            literal('nfinity');
            return newToken('numeric', Infinity)

        case 'N':
            read();
            literal('aN');
            return newToken('numeric', NaN)

        case '"':
        case "'":
            doubleQuote = (read() === '"');
            buffer = '';
            lexState = 'string';
            return
        }

        throw invalidChar(read())
    },

    identifierNameStartEscape () {
        if (c !== 'u') {
            throw invalidChar(read())
        }

        read();
        const u = unicodeEscape();
        switch (u) {
        case '$':
        case '_':
            break

        default:
            if (!util.isIdStartChar(u)) {
                throw invalidIdentifier()
            }

            break
        }

        buffer += u;
        lexState = 'identifierName';
    },

    identifierName () {
        switch (c) {
        case '$':
        case '_':
        case '\u200C':
        case '\u200D':
            buffer += read();
            return

        case '\\':
            read();
            lexState = 'identifierNameEscape';
            return
        }

        if (util.isIdContinueChar(c)) {
            buffer += read();
            return
        }

        return newToken('identifier', buffer)
    },

    identifierNameEscape () {
        if (c !== 'u') {
            throw invalidChar(read())
        }

        read();
        const u = unicodeEscape();
        switch (u) {
        case '$':
        case '_':
        case '\u200C':
        case '\u200D':
            break

        default:
            if (!util.isIdContinueChar(u)) {
                throw invalidIdentifier()
            }

            break
        }

        buffer += u;
        lexState = 'identifierName';
    },

    sign () {
        switch (c) {
        case '.':
            buffer = read();
            lexState = 'decimalPointLeading';
            return

        case '0':
            buffer = read();
            lexState = 'zero';
            return

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            buffer = read();
            lexState = 'decimalInteger';
            return

        case 'I':
            read();
            literal('nfinity');
            return newToken('numeric', sign * Infinity)

        case 'N':
            read();
            literal('aN');
            return newToken('numeric', NaN)
        }

        throw invalidChar(read())
    },

    zero () {
        switch (c) {
        case '.':
            buffer += read();
            lexState = 'decimalPoint';
            return

        case 'e':
        case 'E':
            buffer += read();
            lexState = 'decimalExponent';
            return

        case 'x':
        case 'X':
            buffer += read();
            lexState = 'hexadecimal';
            return
        }

        return newToken('numeric', sign * 0)
    },

    decimalInteger () {
        switch (c) {
        case '.':
            buffer += read();
            lexState = 'decimalPoint';
            return

        case 'e':
        case 'E':
            buffer += read();
            lexState = 'decimalExponent';
            return
        }

        if (util.isDigit(c)) {
            buffer += read();
            return
        }

        return newToken('numeric', sign * Number(buffer))
    },

    decimalPointLeading () {
        if (util.isDigit(c)) {
            buffer += read();
            lexState = 'decimalFraction';
            return
        }

        throw invalidChar(read())
    },

    decimalPoint () {
        switch (c) {
        case 'e':
        case 'E':
            buffer += read();
            lexState = 'decimalExponent';
            return
        }

        if (util.isDigit(c)) {
            buffer += read();
            lexState = 'decimalFraction';
            return
        }

        return newToken('numeric', sign * Number(buffer))
    },

    decimalFraction () {
        switch (c) {
        case 'e':
        case 'E':
            buffer += read();
            lexState = 'decimalExponent';
            return
        }

        if (util.isDigit(c)) {
            buffer += read();
            return
        }

        return newToken('numeric', sign * Number(buffer))
    },

    decimalExponent () {
        switch (c) {
        case '+':
        case '-':
            buffer += read();
            lexState = 'decimalExponentSign';
            return
        }

        if (util.isDigit(c)) {
            buffer += read();
            lexState = 'decimalExponentInteger';
            return
        }

        throw invalidChar(read())
    },

    decimalExponentSign () {
        if (util.isDigit(c)) {
            buffer += read();
            lexState = 'decimalExponentInteger';
            return
        }

        throw invalidChar(read())
    },

    decimalExponentInteger () {
        if (util.isDigit(c)) {
            buffer += read();
            return
        }

        return newToken('numeric', sign * Number(buffer))
    },

    hexadecimal () {
        if (util.isHexDigit(c)) {
            buffer += read();
            lexState = 'hexadecimalInteger';
            return
        }

        throw invalidChar(read())
    },

    hexadecimalInteger () {
        if (util.isHexDigit(c)) {
            buffer += read();
            return
        }

        return newToken('numeric', sign * Number(buffer))
    },

    string () {
        switch (c) {
        case '\\':
            read();
            buffer += escape();
            return

        case '"':
            if (doubleQuote) {
                read();
                return newToken('string', buffer)
            }

            buffer += read();
            return

        case "'":
            if (!doubleQuote) {
                read();
                return newToken('string', buffer)
            }

            buffer += read();
            return

        case '\n':
        case '\r':
            throw invalidChar(read())

        case '\u2028':
        case '\u2029':
            separatorChar(c);
            break

        case undefined:
            throw invalidChar(read())
        }

        buffer += read();
    },

    start () {
        switch (c) {
        case '{':
        case '[':
            return newToken('punctuator', read())

        // This code is unreachable since the default lexState handles eof.
        // case undefined:
        //     return newToken('eof')
        }

        lexState = 'value';
    },

    beforePropertyName () {
        switch (c) {
        case '$':
        case '_':
            buffer = read();
            lexState = 'identifierName';
            return

        case '\\':
            read();
            lexState = 'identifierNameStartEscape';
            return

        case '}':
            return newToken('punctuator', read())

        case '"':
        case "'":
            doubleQuote = (read() === '"');
            lexState = 'string';
            return
        }

        if (util.isIdStartChar(c)) {
            buffer += read();
            lexState = 'identifierName';
            return
        }

        throw invalidChar(read())
    },

    afterPropertyName () {
        if (c === ':') {
            return newToken('punctuator', read())
        }

        throw invalidChar(read())
    },

    beforePropertyValue () {
        lexState = 'value';
    },

    afterPropertyValue () {
        switch (c) {
        case ',':
        case '}':
            return newToken('punctuator', read())
        }

        throw invalidChar(read())
    },

    beforeArrayValue () {
        if (c === ']') {
            return newToken('punctuator', read())
        }

        lexState = 'value';
    },

    afterArrayValue () {
        switch (c) {
        case ',':
        case ']':
            return newToken('punctuator', read())
        }

        throw invalidChar(read())
    },

    end () {
        // This code is unreachable since it's handled by the default lexState.
        // if (c === undefined) {
        //     read()
        //     return newToken('eof')
        // }

        throw invalidChar(read())
    },
};

function newToken (type, value) {
    return {
        type,
        value,
        line,
        column,
    }
}

function literal (s) {
    for (const c of s) {
        const p = peek();

        if (p !== c) {
            throw invalidChar(read())
        }

        read();
    }
}

function escape () {
    const c = peek();
    switch (c) {
    case 'b':
        read();
        return '\b'

    case 'f':
        read();
        return '\f'

    case 'n':
        read();
        return '\n'

    case 'r':
        read();
        return '\r'

    case 't':
        read();
        return '\t'

    case 'v':
        read();
        return '\v'

    case '0':
        read();
        if (util.isDigit(peek())) {
            throw invalidChar(read())
        }

        return '\0'

    case 'x':
        read();
        return hexEscape()

    case 'u':
        read();
        return unicodeEscape()

    case '\n':
    case '\u2028':
    case '\u2029':
        read();
        return ''

    case '\r':
        read();
        if (peek() === '\n') {
            read();
        }

        return ''

    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
        throw invalidChar(read())

    case undefined:
        throw invalidChar(read())
    }

    return read()
}

function hexEscape () {
    let buffer = '';
    let c = peek();

    if (!util.isHexDigit(c)) {
        throw invalidChar(read())
    }

    buffer += read();

    c = peek();
    if (!util.isHexDigit(c)) {
        throw invalidChar(read())
    }

    buffer += read();

    return String.fromCodePoint(parseInt(buffer, 16))
}

function unicodeEscape () {
    let buffer = '';
    let count = 4;

    while (count-- > 0) {
        const c = peek();
        if (!util.isHexDigit(c)) {
            throw invalidChar(read())
        }

        buffer += read();
    }

    return String.fromCodePoint(parseInt(buffer, 16))
}

const parseStates = {
    start () {
        if (token.type === 'eof') {
            throw invalidEOF()
        }

        push();
    },

    beforePropertyName () {
        switch (token.type) {
        case 'identifier':
        case 'string':
            key = token.value;
            parseState = 'afterPropertyName';
            return

        case 'punctuator':
            // This code is unreachable since it's handled by the lexState.
            // if (token.value !== '}') {
            //     throw invalidToken()
            // }

            pop();
            return

        case 'eof':
            throw invalidEOF()
        }

        // This code is unreachable since it's handled by the lexState.
        // throw invalidToken()
    },

    afterPropertyName () {
        // This code is unreachable since it's handled by the lexState.
        // if (token.type !== 'punctuator' || token.value !== ':') {
        //     throw invalidToken()
        // }

        if (token.type === 'eof') {
            throw invalidEOF()
        }

        parseState = 'beforePropertyValue';
    },

    beforePropertyValue () {
        if (token.type === 'eof') {
            throw invalidEOF()
        }

        push();
    },

    beforeArrayValue () {
        if (token.type === 'eof') {
            throw invalidEOF()
        }

        if (token.type === 'punctuator' && token.value === ']') {
            pop();
            return
        }

        push();
    },

    afterPropertyValue () {
        // This code is unreachable since it's handled by the lexState.
        // if (token.type !== 'punctuator') {
        //     throw invalidToken()
        // }

        if (token.type === 'eof') {
            throw invalidEOF()
        }

        switch (token.value) {
        case ',':
            parseState = 'beforePropertyName';
            return

        case '}':
            pop();
        }

        // This code is unreachable since it's handled by the lexState.
        // throw invalidToken()
    },

    afterArrayValue () {
        // This code is unreachable since it's handled by the lexState.
        // if (token.type !== 'punctuator') {
        //     throw invalidToken()
        // }

        if (token.type === 'eof') {
            throw invalidEOF()
        }

        switch (token.value) {
        case ',':
            parseState = 'beforeArrayValue';
            return

        case ']':
            pop();
        }

        // This code is unreachable since it's handled by the lexState.
        // throw invalidToken()
    },

    end () {
        // This code is unreachable since it's handled by the lexState.
        // if (token.type !== 'eof') {
        //     throw invalidToken()
        // }
    },
};

function push () {
    let value;

    switch (token.type) {
    case 'punctuator':
        switch (token.value) {
        case '{':
            value = {};
            break

        case '[':
            value = [];
            break
        }

        break

    case 'null':
    case 'boolean':
    case 'numeric':
    case 'string':
        value = token.value;
        break

    // This code is unreachable.
    // default:
    //     throw invalidToken()
    }

    if (root === undefined) {
        root = value;
    } else {
        const parent = stack[stack.length - 1];
        if (Array.isArray(parent)) {
            parent.push(value);
        } else {
            parent[key] = value;
        }
    }

    if (value !== null && typeof value === 'object') {
        stack.push(value);

        if (Array.isArray(value)) {
            parseState = 'beforeArrayValue';
        } else {
            parseState = 'beforePropertyName';
        }
    } else {
        const current = stack[stack.length - 1];
        if (current == null) {
            parseState = 'end';
        } else if (Array.isArray(current)) {
            parseState = 'afterArrayValue';
        } else {
            parseState = 'afterPropertyValue';
        }
    }
}

function pop () {
    stack.pop();

    const current = stack[stack.length - 1];
    if (current == null) {
        parseState = 'end';
    } else if (Array.isArray(current)) {
        parseState = 'afterArrayValue';
    } else {
        parseState = 'afterPropertyValue';
    }
}

// This code is unreachable.
// function invalidParseState () {
//     return new Error(`JSON5: invalid parse state '${parseState}'`)
// }

// This code is unreachable.
// function invalidLexState (state) {
//     return new Error(`JSON5: invalid lex state '${state}'`)
// }

function invalidChar (c) {
    if (c === undefined) {
        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
    }

    return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`)
}

function invalidEOF () {
    return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
}

// This code is unreachable.
// function invalidToken () {
//     if (token.type === 'eof') {
//         return syntaxError(`JSON5: invalid end of input at ${line}:${column}`)
//     }

//     const c = String.fromCodePoint(token.value.codePointAt(0))
//     return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`)
// }

function invalidIdentifier () {
    column -= 5;
    return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`)
}

function separatorChar (c) {
    console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
}

function formatChar (c) {
    const replacements = {
        "'": "\\'",
        '"': '\\"',
        '\\': '\\\\',
        '\b': '\\b',
        '\f': '\\f',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\v': '\\v',
        '\0': '\\0',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029',
    };

    if (replacements[c]) {
        return replacements[c]
    }

    if (c < ' ') {
        const hexString = c.charCodeAt(0).toString(16);
        return '\\x' + ('00' + hexString).substring(hexString.length)
    }

    return c
}

function syntaxError (message) {
    const err = new SyntaxError(message);
    err.lineNumber = line;
    err.columnNumber = column;
    return err
}

var stringify = function stringify (value, replacer, space) {
    const stack = [];
    let indent = '';
    let propertyList;
    let replacerFunc;
    let gap = '';
    let quote;

    if (
        replacer != null &&
        typeof replacer === 'object' &&
        !Array.isArray(replacer)
    ) {
        space = replacer.space;
        quote = replacer.quote;
        replacer = replacer.replacer;
    }

    if (typeof replacer === 'function') {
        replacerFunc = replacer;
    } else if (Array.isArray(replacer)) {
        propertyList = [];
        for (const v of replacer) {
            let item;

            if (typeof v === 'string') {
                item = v;
            } else if (
                typeof v === 'number' ||
                v instanceof String ||
                v instanceof Number
            ) {
                item = String(v);
            }

            if (item !== undefined && propertyList.indexOf(item) < 0) {
                propertyList.push(item);
            }
        }
    }

    if (space instanceof Number) {
        space = Number(space);
    } else if (space instanceof String) {
        space = String(space);
    }

    if (typeof space === 'number') {
        if (space > 0) {
            space = Math.min(10, Math.floor(space));
            gap = '          '.substr(0, space);
        }
    } else if (typeof space === 'string') {
        gap = space.substr(0, 10);
    }

    return serializeProperty('', {'': value})

    function serializeProperty (key, holder) {
        let value = holder[key];
        if (value != null) {
            if (typeof value.toJSON5 === 'function') {
                value = value.toJSON5(key);
            } else if (typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
        }

        if (replacerFunc) {
            value = replacerFunc.call(holder, key, value);
        }

        if (value instanceof Number) {
            value = Number(value);
        } else if (value instanceof String) {
            value = String(value);
        } else if (value instanceof Boolean) {
            value = value.valueOf();
        }

        switch (value) {
        case null: return 'null'
        case true: return 'true'
        case false: return 'false'
        }

        if (typeof value === 'string') {
            return quoteString(value)
        }

        if (typeof value === 'number') {
            return String(value)
        }

        if (typeof value === 'object') {
            return Array.isArray(value) ? serializeArray(value) : serializeObject(value)
        }

        return undefined
    }

    function quoteString (value) {
        const quotes = {
            "'": 0.1,
            '"': 0.2,
        };

        const replacements = {
            "'": "\\'",
            '"': '\\"',
            '\\': '\\\\',
            '\b': '\\b',
            '\f': '\\f',
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            '\v': '\\v',
            '\0': '\\0',
            '\u2028': '\\u2028',
            '\u2029': '\\u2029',
        };

        let product = '';

        for (let i = 0; i < value.length; i++) {
            const c = value[i];
            switch (c) {
            case "'":
            case '"':
                quotes[c]++;
                product += c;
                continue

            case '\0':
                if (util.isDigit(value[i + 1])) {
                    product += '\\x00';
                    continue
                }
            }

            if (replacements[c]) {
                product += replacements[c];
                continue
            }

            if (c < ' ') {
                let hexString = c.charCodeAt(0).toString(16);
                product += '\\x' + ('00' + hexString).substring(hexString.length);
                continue
            }

            product += c;
        }

        const quoteChar = quote || Object.keys(quotes).reduce((a, b) => (quotes[a] < quotes[b]) ? a : b);

        product = product.replace(new RegExp(quoteChar, 'g'), replacements[quoteChar]);

        return quoteChar + product + quoteChar
    }

    function serializeObject (value) {
        if (stack.indexOf(value) >= 0) {
            throw TypeError('Converting circular structure to JSON5')
        }

        stack.push(value);

        let stepback = indent;
        indent = indent + gap;

        let keys = propertyList || Object.keys(value);
        let partial = [];
        for (const key of keys) {
            const propertyString = serializeProperty(key, value);
            if (propertyString !== undefined) {
                let member = serializeKey(key) + ':';
                if (gap !== '') {
                    member += ' ';
                }
                member += propertyString;
                partial.push(member);
            }
        }

        let final;
        if (partial.length === 0) {
            final = '{}';
        } else {
            let properties;
            if (gap === '') {
                properties = partial.join(',');
                final = '{' + properties + '}';
            } else {
                let separator = ',\n' + indent;
                properties = partial.join(separator);
                final = '{\n' + indent + properties + ',\n' + stepback + '}';
            }
        }

        stack.pop();
        indent = stepback;
        return final
    }

    function serializeKey (key) {
        if (key.length === 0) {
            return quoteString(key)
        }

        const firstChar = String.fromCodePoint(key.codePointAt(0));
        if (!util.isIdStartChar(firstChar)) {
            return quoteString(key)
        }

        for (let i = firstChar.length; i < key.length; i++) {
            if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
                return quoteString(key)
            }
        }

        return key
    }

    function serializeArray (value) {
        if (stack.indexOf(value) >= 0) {
            throw TypeError('Converting circular structure to JSON5')
        }

        stack.push(value);

        let stepback = indent;
        indent = indent + gap;

        let partial = [];
        for (let i = 0; i < value.length; i++) {
            const propertyString = serializeProperty(String(i), value);
            partial.push((propertyString !== undefined) ? propertyString : 'null');
        }

        let final;
        if (partial.length === 0) {
            final = '[]';
        } else {
            if (gap === '') {
                let properties = partial.join(',');
                final = '[' + properties + ']';
            } else {
                let separator = ',\n' + indent;
                let properties = partial.join(separator);
                final = '[\n' + indent + properties + ',\n' + stepback + ']';
            }
        }

        stack.pop();
        indent = stepback;
        return final
    }
};

const JSON5 = {
    parse,
    stringify,
};

var lib = JSON5;

function trimEndSlash(str) {
    if (str.endsWith('/') || str.endsWith('\\'))
        return str.slice(0, -1);
    return str;
}
function trimStartDot(str) {
    if (str.startsWith('./'))
        return str.slice(2);
    return str;
}
function dirname(str) {
    const parts = str.split(/[\/\\]/g);
    return parts[parts.length - 2];
}
function join(...parts) {
    return parts.map(trimEndSlash).map(trimStartDot).join('/');
}

const isWebWorker = typeof self !== 'undefined' && typeof self.WorkerGlobalScope !== 'undefined';
const isBrowser = isWebWorker ||
    (typeof window !== 'undefined' &&
        typeof window.document !== 'undefined' &&
        typeof fetch !== 'undefined');
// to be replaced by rollup
let CDN_ROOT = '';
let ONIGASM_WASM = '';
/**
 * Set the route for loading the assets
 * URL should end with `/`
 *
 * For example:
 * ```ts
 * setCDN('https://unpkg.com/shiki/') // use unpkg
 * setCDN('/assets/shiki/') // serve by yourself
 * ```
 */
function setCDN(root) {
    CDN_ROOT = root;
}
/**
 * Explicitly set the source for loading the OnigasmWASM
 *
 * Accepts Url or ArrayBuffer
 */
function setOnigasmWASM(path) {
    ONIGASM_WASM = path;
}
let _onigasmPromise = null;
async function getOnigasm() {
    if (!_onigasmPromise) {
        let loader;
        if (isBrowser) {
            loader = onigasm.loadWASM(ONIGASM_WASM || _resolvePath('dist/onigasm.wasm'));
        }
        else {
            const path = require('path');
            const onigasmPath = path.join(require.resolve('onigasm'), '../onigasm.wasm');
            const fs = require('fs');
            const wasmBin = fs.readFileSync(onigasmPath).buffer;
            loader = onigasm.loadWASM(wasmBin);
        }
        _onigasmPromise = loader.then(() => {
            return {
                createOnigScanner(patterns) {
                    return new onigasm.OnigScanner(patterns);
                },
                createOnigString(s) {
                    return new onigasm.OnigString(s);
                }
            };
        });
    }
    return _onigasmPromise;
}
function _resolvePath(filepath) {
    if (isBrowser) {
        if (!CDN_ROOT) {
            console.warn('[Shiki] no CDN provider found, use `setCDN()` to specify the CDN for loading the resources before calling `getHighlighter()`');
        }
        return `${CDN_ROOT}${filepath}`;
    }
    else {
        const path = require('path');
        if (path.isAbsolute(filepath)) {
            return filepath;
        }
        else {
            return path.resolve(__dirname, '..', filepath);
        }
    }
}
/**
 * @param filepath assert path related to ./packages/shiki
 */
async function _fetchAssets(filepath) {
    const path = _resolvePath(filepath);
    if (isBrowser) {
        return await fetch(path).then(r => r.text());
    }
    else {
        const fs = require('fs');
        return await fs.promises.readFile(path, 'utf-8');
    }
}
async function _fetchJSONAssets(filepath) {
    return lib.parse(await _fetchAssets(filepath));
}
/**
 * @param themePath related path to theme.json
 */
async function fetchTheme(themePath) {
    let theme = await _fetchJSONAssets(themePath);
    const shikiTheme = toShikiTheme(theme);
    if (shikiTheme.include) {
        const includedTheme = await fetchTheme(join(dirname(themePath), shikiTheme.include));
        if (includedTheme.settings) {
            shikiTheme.settings = includedTheme.settings.concat(shikiTheme.settings);
        }
        if (includedTheme.bg && !shikiTheme.bg) {
            shikiTheme.bg = includedTheme.bg;
        }
        if (includedTheme.colors) {
            shikiTheme.colors = Object.assign(Object.assign({}, includedTheme.colors), shikiTheme.colors);
        }
        delete shikiTheme.include;
    }
    return shikiTheme;
}
async function fetchGrammar(filepath) {
    return await _fetchJSONAssets(filepath);
}
function repairTheme(theme) {
    // Has the default no-scope setting with fallback colors
    if (!theme.settings)
        theme.settings = [];
    if (theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope) {
        return;
    }
    // Push a no-scope setting with fallback colors
    theme.settings.unshift({
        settings: {
            foreground: theme.fg,
            background: theme.bg
        }
    });
}
function toShikiTheme(rawTheme) {
    const type = rawTheme.type || 'dark';
    const shikiTheme = Object.assign(Object.assign({ name: rawTheme.name, type }, rawTheme), getThemeDefaultColors(rawTheme));
    if (rawTheme.include) {
        shikiTheme.include = rawTheme.include;
    }
    if (rawTheme.tokenColors) {
        shikiTheme.settings = rawTheme.tokenColors;
        delete shikiTheme.tokenColors;
    }
    repairTheme(shikiTheme);
    return shikiTheme;
}
/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' };
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' };
function getThemeDefaultColors(theme) {
    var _a, _b, _c, _d, _e, _f;
    let fg, bg;
    /**
     * First try:
     * Theme might contain a global `tokenColor` without `name` or `scope`
     * Used as default value for foreground/background
     */
    let settings = theme.settings ? theme.settings : theme.tokenColors;
    const globalSetting = settings
        ? settings.find(s => {
            return !s.name && !s.scope;
        })
        : undefined;
    if ((_a = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _a === void 0 ? void 0 : _a.foreground) {
        fg = globalSetting.settings.foreground;
    }
    if ((_b = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _b === void 0 ? void 0 : _b.background) {
        bg = globalSetting.settings.background;
    }
    /**
     * Second try:
     * If there's no global `tokenColor` without `name` or `scope`
     * Use `editor.foreground` and `editor.background`
     */
    if (!fg && ((_d = (_c = theme) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d['editor.foreground'])) {
        fg = theme.colors['editor.foreground'];
    }
    if (!bg && ((_f = (_e = theme) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f['editor.background'])) {
        bg = theme.colors['editor.background'];
    }
    /**
     * Last try:
     * If there's no fg/bg color specified in theme, use default
     */
    if (!fg) {
        fg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
    }
    if (!bg) {
        bg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
    }
    return {
        fg,
        bg
    };
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
class Resolver {
    constructor(onigLibPromise, onigLibName) {
        this.languagesPath = 'languages/';
        this.languageMap = {};
        this.scopeToLangMap = {};
        this._onigLibPromise = onigLibPromise;
        this._onigLibName = onigLibName;
    }
    get onigLib() {
        return this._onigLibPromise;
    }
    getOnigLibName() {
        return this._onigLibName;
    }
    getLangRegistration(langIdOrAlias) {
        return this.languageMap[langIdOrAlias];
    }
    async loadGrammar(scopeName) {
        const lang = this.scopeToLangMap[scopeName];
        if (!lang) {
            return null;
        }
        if (lang.grammar) {
            return lang.grammar;
        }
        const g = await fetchGrammar(languages.includes(lang) ? `${this.languagesPath}${lang.path}` : lang.path);
        lang.grammar = g;
        return g;
    }
    addLanguage(l) {
        this.languageMap[l.id] = l;
        if (l.aliases) {
            l.aliases.forEach(a => {
                this.languageMap[a] = l;
            });
        }
        this.scopeToLangMap[l.scopeName] = l;
    }
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
function tokenizeWithTheme(theme, colorMap, fileContents, grammar, options) {
    let lines = fileContents.split(/\r\n|\r|\n/);
    let ruleStack = vscodeTextmate.INITIAL;
    let actual = [];
    let final = [];
    for (let i = 0, len = lines.length; i < len; i++) {
        let line = lines[i];
        if (line === '') {
            actual = [];
            final.push([]);
            continue;
        }
        let resultWithScopes;
        let tokensWithScopes;
        let tokensWithScopesIndex;
        if (options.includeExplanation) {
            resultWithScopes = grammar.tokenizeLine(line, ruleStack);
            tokensWithScopes = resultWithScopes.tokens;
            tokensWithScopesIndex = 0;
        }
        let result = grammar.tokenizeLine2(line, ruleStack);
        let tokensLength = result.tokens.length / 2;
        for (let j = 0; j < tokensLength; j++) {
            let startIndex = result.tokens[2 * j];
            let nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length;
            if (startIndex === nextStartIndex) {
                continue;
            }
            let metadata = result.tokens[2 * j + 1];
            let foreground = StackElementMetadata.getForeground(metadata);
            let foregroundColor = colorMap[foreground];
            let fontStyle = StackElementMetadata.getFontStyle(metadata);
            let explanation = [];
            if (options.includeExplanation) {
                let offset = 0;
                while (startIndex + offset < nextStartIndex) {
                    let tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
                    let tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
                    offset += tokenWithScopesText.length;
                    explanation.push({
                        content: tokenWithScopesText,
                        scopes: explainThemeScopes(theme, tokenWithScopes.scopes)
                    });
                    tokensWithScopesIndex++;
                }
            }
            actual.push({
                content: line.substring(startIndex, nextStartIndex),
                color: foregroundColor,
                fontStyle,
                explanation: explanation
            });
        }
        final.push(actual);
        actual = [];
        ruleStack = result.ruleStack;
    }
    return final;
}
function explainThemeScopes(theme, scopes) {
    let result = [];
    for (let i = 0, len = scopes.length; i < len; i++) {
        let parentScopes = scopes.slice(0, i);
        let scope = scopes[i];
        result[i] = {
            scopeName: scope,
            themeMatches: explainThemeScope(theme, scope, parentScopes)
        };
    }
    return result;
}
function matchesOne(selector, scope) {
    let selectorPrefix = selector + '.';
    if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
        return true;
    }
    return false;
}
function matches(selector, selectorParentScopes, scope, parentScopes) {
    if (!matchesOne(selector, scope)) {
        return false;
    }
    let selectorParentIndex = selectorParentScopes.length - 1;
    let parentIndex = parentScopes.length - 1;
    while (selectorParentIndex >= 0 && parentIndex >= 0) {
        if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
            selectorParentIndex--;
        }
        parentIndex--;
    }
    if (selectorParentIndex === -1) {
        return true;
    }
    return false;
}
function explainThemeScope(theme, scope, parentScopes) {
    let result = [], resultLen = 0;
    for (let i = 0, len = theme.settings.length; i < len; i++) {
        let setting = theme.settings[i];
        let selectors;
        if (typeof setting.scope === 'string') {
            selectors = setting.scope.split(/,/).map(scope => scope.trim());
        }
        else if (Array.isArray(setting.scope)) {
            selectors = setting.scope;
        }
        else {
            continue;
        }
        for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
            let rawSelector = selectors[j];
            let rawSelectorPieces = rawSelector.split(/ /);
            let selector = rawSelectorPieces[rawSelectorPieces.length - 1];
            let selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
            if (matches(selector, selectorParentScopes, scope, parentScopes)) {
                // match!
                result[resultLen++] = setting;
                // break the loop
                j = lenJ;
            }
        }
    }
    return result;
}

const FONT_STYLE_TO_CSS = {
    [exports.FontStyle.Italic]: 'font-style: italic',
    [exports.FontStyle.Bold]: 'font-weight: bold',
    [exports.FontStyle.Underline]: 'text-decoration: underline'
};
function renderToHtml(lines, options = {}) {
    const bg = options.bg || '#fff';
    let html = '';
    html += `<pre class="shiki" style="background-color: ${bg}">`;
    if (options.langId) {
        html += `<div class="language-id">${options.langId}</div>`;
    }
    html += `<code>`;
    lines.forEach((l) => {
        html += `<span class="line">`;
        l.forEach(token => {
            const cssDeclarations = [`color: ${token.color || options.fg}`];
            if (token.fontStyle > exports.FontStyle.None) {
                cssDeclarations.push(FONT_STYLE_TO_CSS[token.fontStyle]);
            }
            html += `<span style="${cssDeclarations.join('; ')}">${escapeHtml(token.content)}</span>`;
        });
        html += `</span>\n`;
    });
    html = html.replace(/\n*$/, ''); // Get rid of final new lines
    html += `</code></pre>`;
    return html;
}
const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
function escapeHtml(html) {
    return html.replace(/[&<>"']/g, chr => htmlEscapes[chr]);
}

class Registry extends vscodeTextmate.Registry {
    constructor(_resolver) {
        super(_resolver);
        this._resolver = _resolver;
        this.themesPath = 'themes/';
        this._resolvedThemes = {};
        this._resolvedGrammars = {};
    }
    getTheme(theme) {
        if (typeof theme === 'string') {
            return this._resolvedThemes[theme];
        }
        else {
            return theme;
        }
    }
    async loadTheme(theme) {
        if (typeof theme === 'string') {
            if (!this._resolvedThemes[theme]) {
                this._resolvedThemes[theme] = await fetchTheme(`${this.themesPath}${theme}.json`);
            }
            return this._resolvedThemes[theme];
        }
        else {
            theme = toShikiTheme(theme);
            if (theme.name) {
                this._resolvedThemes[theme.name] = theme;
            }
            return theme;
        }
    }
    async loadThemes(themes) {
        return await Promise.all(themes.map(theme => this.loadTheme(theme)));
    }
    getLoadedThemes() {
        return Object.keys(this._resolvedThemes);
    }
    getGrammer(name) {
        return this._resolvedGrammars[name];
    }
    async loadLanguage(lang) {
        const g = await this.loadGrammar(lang.scopeName);
        this._resolvedGrammars[lang.id] = g;
        if (lang.aliases) {
            lang.aliases.forEach(la => {
                this._resolvedGrammars[la] = g;
            });
        }
    }
    async loadLanguages(langs) {
        for (const lang of langs) {
            this._resolver.addLanguage(lang);
        }
        for (const lang of langs) {
            await this.loadLanguage(lang);
        }
    }
    getLoadedLanguages() {
        return Object.keys(this._resolvedGrammars);
    }
}

function resolveLang(lang) {
    return typeof lang === 'string'
        ? languages.find(l => { var _a; return l.id === lang || ((_a = l.aliases) === null || _a === void 0 ? void 0 : _a.includes(lang)); })
        : lang;
}
function resolveOptions(options) {
    var _a;
    let _languages = languages;
    let _themes = options.themes || [];
    if ((_a = options.langs) === null || _a === void 0 ? void 0 : _a.length) {
        _languages = options.langs.map(resolveLang);
    }
    if (options.theme) {
        _themes.unshift(options.theme);
    }
    if (!_themes.length) {
        _themes = ['nord'];
    }
    return { _languages, _themes };
}
async function getHighlighter(options) {
    var _a, _b;
    const { _languages, _themes } = resolveOptions(options);
    const _resolver = new Resolver(getOnigasm(), 'onigasm');
    const _registry = new Registry(_resolver);
    if ((_a = options.paths) === null || _a === void 0 ? void 0 : _a.themes) {
        _registry.themesPath = options.paths.themes;
    }
    if ((_b = options.paths) === null || _b === void 0 ? void 0 : _b.languages) {
        _resolver.languagesPath = options.paths.languages;
    }
    const themes = await _registry.loadThemes(_themes);
    const _defaultTheme = themes[0];
    let _currentTheme;
    await _registry.loadLanguages(_languages);
    /**
     * Shiki was designed for VSCode, so CSS variables are not currently supported.
     * See: https://github.com/shikijs/shiki/pull/212#issuecomment-906924986
     *
     * Instead, we work around this by using valid hex color codes as lookups in a
     * final "repair" step which translates those codes to the correct CSS variables.
     */
    const COLOR_REPLACEMENTS = {
        '#000001': 'var(--shiki-color-text)',
        '#000002': 'var(--shiki-color-background)',
        '#000004': 'var(--shiki-token-constant)',
        '#000005': 'var(--shiki-token-string)',
        '#000006': 'var(--shiki-token-comment)',
        '#000007': 'var(--shiki-token-keyword)',
        '#000008': 'var(--shiki-token-parameter)',
        '#000009': 'var(--shiki-token-function)',
        '#000010': 'var(--shiki-token-string-expression)',
        '#000011': 'var(--shiki-token-punctuation)',
        '#000012': 'var(--shiki-token-link)'
    };
    function fixCssVariablesTheme(theme, colorMap) {
        theme.bg = COLOR_REPLACEMENTS[theme.bg] || theme.bg;
        theme.fg = COLOR_REPLACEMENTS[theme.fg] || theme.fg;
        colorMap.forEach((val, i) => {
            colorMap[i] = COLOR_REPLACEMENTS[val] || val;
        });
    }
    function getTheme(theme) {
        const _theme = theme ? _registry.getTheme(theme) : _defaultTheme;
        if (!_theme) {
            throw Error(`No theme registration for ${theme}`);
        }
        if (!_currentTheme || _currentTheme.name !== _theme.name) {
            _registry.setTheme(_theme);
            _currentTheme = _theme;
        }
        const _colorMap = _registry.getColorMap();
        if (_theme.name === 'css-variables') {
            fixCssVariablesTheme(_theme, _colorMap);
        }
        return { _theme, _colorMap };
    }
    function getGrammer(lang) {
        const _grammer = _registry.getGrammer(lang);
        if (!_grammer) {
            throw Error(`No language registration for ${lang}`);
        }
        return { _grammer };
    }
    function codeToThemedTokens(code, lang = 'text', theme, options = { includeExplanation: true }) {
        if (isPlaintext(lang)) {
            return [[{ content: code }]];
        }
        const { _grammer } = getGrammer(lang);
        const { _theme, _colorMap } = getTheme(theme);
        return tokenizeWithTheme(_theme, _colorMap, code, _grammer, options);
    }
    function codeToHtml(code, lang = 'text', theme) {
        const tokens = codeToThemedTokens(code, lang, theme, {
            includeExplanation: false
        });
        const { _theme } = getTheme(theme);
        return renderToHtml(tokens, {
            fg: _theme.fg,
            bg: _theme.bg
        });
    }
    async function loadTheme(theme) {
        await _registry.loadTheme(theme);
    }
    async function loadLanguage(lang) {
        const _lang = resolveLang(lang);
        _resolver.addLanguage(_lang);
        await _registry.loadLanguage(_lang);
    }
    function getLoadedThemes() {
        return _registry.getLoadedThemes();
    }
    function getLoadedLanguages() {
        return _registry.getLoadedLanguages();
    }
    function getBackgroundColor(theme) {
        const { _theme } = getTheme(theme);
        return _theme.bg;
    }
    function getForegroundColor(theme) {
        const { _theme } = getTheme(theme);
        return _theme.fg;
    }
    return {
        codeToThemedTokens,
        codeToHtml,
        getTheme: (theme) => {
            return getTheme(theme)._theme;
        },
        loadTheme,
        loadLanguage,
        getBackgroundColor,
        getForegroundColor,
        getLoadedThemes,
        getLoadedLanguages
    };
}
function isPlaintext(lang) {
    return !lang || ['plaintext', 'txt', 'text'].includes(lang);
}

exports.BUNDLED_LANGUAGES = languages;
exports.BUNDLED_THEMES = themes;
exports.getHighlighter = getHighlighter;
exports.loadTheme = fetchTheme;
exports.renderToHtml = renderToHtml;
exports.setCDN = setCDN;
exports.setOnigasmWASM = setOnigasmWASM;
