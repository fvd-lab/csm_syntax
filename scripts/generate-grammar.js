#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function readKeywordsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return [];
  }
}

function makePatternCaseInsensitive(keyword) {
  return keyword.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      return `[${char.toLowerCase()}${char.toUpperCase()}]`;
    }
    return char;
  }).join('');
}

const controlKeywords = [
  "cfgpmtr", "dimension", "despmtr", "outpmtr", "udparg", "udprim", "store", "restore",
  "extrude", "set", "mark", "select", "translate", "rotate", "scale", "union", "subtract",
  "intersect", "fillet", "chamfer", "sweep", "revolve", "loft", "blend", "pathrule",
  "import", "catbeg", "catend", "ifthen", "elseif", "else", "endif", "foreach", "endfor",
  "while", "endwhile", "break", "continue", "throw", "try", "catch", "endtry"
];

const functionKeywords = [
  "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "cosh", "exp", "floor", 
  "log", "log10", "max", "min", "mod", "pow", "random", "round", "sign", "sin", 
  "sinh", "sqrt", "tan", "tanh", "trim", "patbeg", "patend", "dump", "val2str", 
  "str2val", "getattr", "setattr", "applycsys", "evaluate", "getbbox", "getlength", 
  "getarea", "getvolume", "getmomnt", "getcg", "split", "join", "mirror", "hollow", 
  "thicken", "extract", "rule", "attribute", "cfgpmtr", "interface", "point", "line", 
  "spline", "cirarc", "ellipse", "parabola", "hyperbola", "box", "cylinder", "sphere", 
  "cone", "torus", "ruled", "revolved"
];

const allCsmCommands = [
  "cfgpmtr", "dimension", "despmtr", "outpmtr", "store", "restore", "extrude", "set",
  "mark", "select", "translate", "rotate", "scale", "union", "subtract", "intersect",
  "fillet", "chamfer", "sweep", "revolve", "loft", "blend", "pathrule", "import",
  "catbeg", "catend", "ifthen", "elseif", "else", "endif", "foreach", "endfor",
  "while", "endwhile", "break", "continue", "throw", "try", "catch", "endtry",
  "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "cosh", "exp", "floor",
  "log", "log10", "max", "min", "mod", "pow", "random", "round", "sign", "sin",
  "sinh", "sqrt", "tan", "tanh", "trim", "patbeg", "patend", "dump", "val2str",
  "str2val", "getattr", "setattr", "applycsys", "evaluate", "getbbox", "getlength",
  "getarea", "getvolume", "getmomnt", "getcg", "split", "join", "mirror", "hollow",
  "thicken", "extract", "rule", "attribute", "interface", "point", "line", "spline",
  "cirarc", "ellipse", "parabola", "hyperbola", "box", "cylinder", "sphere", "cone",
  "torus", "ruled", "revolved", "node", "wire", "sheet", "solid", "a", "end",
  "arc", "assert", "bezier", "blend", "catbeg", "chamfer", "combine", "cone",
  "connect", "conpmtr", "csystem", "cylinder", "despmtr", "dimension", "dump",
  "elseif", "evaluate", "extract", "extrude", "fillet", "getattr", "group",
  "hollow", "ifthen", "import", "interface", "intersect", "join", "lbound",
  "linseg", "loft", "macbeg", "message", "mirror", "name", "outpmtr", "patbeg",
  "patbreak", "point", "project", "recall", "reorder", "restore", "revolve",
  "rotatex", "rotatey", "rotatez", "rule", "scale", "select", "skbeg", "skcon",
  "skend", "skvar", "solbeg", "solcon", "sphere", "spline", "sslope", "store",
  "subtract", "throw", "torus", "translate", "ubound", "union"
];

function generateGrammar() {
  console.log(`Loaded ${controlKeywords.length} control keywords and ${functionKeywords.length} function keywords`);

  // Load CSM commands from documentation for function call highlighting
  const docPath = path.join(__dirname, '../csm-documentation.json');
  let csmCommands = [];
  try {
    if (fs.existsSync(docPath)) {
      const docContent = fs.readFileSync(docPath, 'utf8');
      const documentation = JSON.parse(docContent);
      csmCommands = Object.keys(documentation);
      console.log(`Loaded ${csmCommands.length} CSM commands from documentation`);
    }
  } catch (error) {
    console.warn('Could not load CSM commands from documentation, using keywords only');
  }

  // Create regex patterns for keywords (word boundaries)
  // Make control keywords case insensitive
  const controlPatternCaseInsensitive = controlKeywords.map(makePatternCaseInsensitive);
  const controlPattern = controlKeywords.length > 0 ? 
    `\\b(${controlPatternCaseInsensitive.join('|')})\\b` : '__NO_CONTROL_KEYWORDS__';
  const functionPattern = functionKeywords.length > 0 ? 
    `\\b(${functionKeywords.join('|')})\\b` : '__NO_FUNCTION_KEYWORDS__';

  // Create case-insensitive patterns for CSM commands (for function calls)
  const allCommands = [...new Set([...controlKeywords, ...functionKeywords, ...csmCommands, ...allCsmCommands])];
  // Exclude commands that have specific patterns
  const generalCommands = allCommands.filter(cmd => 
    !['udparg', 'UDPARG', 'udprim', 'UDPRIM'].includes(cmd)
  );
  const commandPatternCaseInsensitive = generalCommands.map(makePatternCaseInsensitive);
  const commandCallPattern = commandPatternCaseInsensitive.length > 0 ? 
    `(${commandPatternCaseInsensitive.join('|')})` : '__NO_COMMANDS__';

  const grammar = {
    "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    "name": "CSM",
    "patterns": [
      {
        "include": "#udp-commands"
      },
      {
        "include": "#csm-parameter-commands"
      },
      {
        "include": "#comments"
      },
      {
        "include": "#strings"
      },
      {
        "include": "#numbers"
      },
      {
        "include": "#at-variables"
      },
      {
        "include": "#function-calls"
      },
      {
        "include": "#control-keywords"
      },
      {
        "include": "#function-keywords"
      },
      {
        "include": "#operators"
      },
      {
        "include": "#invalid-lines"
      },
      {
        "include": "#variables"
      }
    ],
    "repository": {
      "comments": {
        "patterns": [
          {
            "name": "comment.line.number-sign.csm",
            "begin": "#",
            "end": "$",
            "patterns": [
              {
                "name": "constant.character.escape.csm",
                "match": "\\\\."
              }
            ]
          }
        ]
      },
      "strings": {
        "patterns": [
          {
            "name": "string.quoted.double.csm",
            "begin": "\"",
            "end": "\"",
            "patterns": [
              {
                "name": "constant.character.escape.csm",
                "match": "\\\\."
              }
            ]
          },
          {
            "name": "string.quoted.single.csm",
            "begin": "'",
            "end": "'",
            "patterns": [
              {
                "name": "constant.character.escape.csm",
                "match": "\\\\."
              }
            ]
          }
        ]
      },
      "numbers": {
        "patterns": [
          {
            "name": "constant.numeric.float.csm",
            "match": "\\b\\d+\\.\\d+([eE][+-]?\\d+)?\\b"
          },
          {
            "name": "constant.numeric.integer.csm",
            "match": "\\b\\d+\\b"
          }
        ]
      },
      "at-variables": {
        "patterns": [
          {
            "name": "entity.name.tag.csm",
            "match": "@[a-zA-Z_][a-zA-Z0-9_]*"
          }
        ]
      },
      "udp-commands": {
        "patterns": [
          {
            "name": "meta.function-call.udparg.csm",
            "begin": "^\\s*((?i:udparg))\\s+",
            "beginCaptures": {
              "1": {
                "name": "keyword.control.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "match": "\\G([a-zA-Z_][a-zA-Z0-9_]*)",
                "captures": {
                  "1": {
                    "name": "entity.name.type.csm"
                  }
                }
              },
              {
                "match": "\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s+([a-zA-Z_][a-zA-Z0-9_]*)",
                "captures": {
                  "1": {
                    "name": "support.type.csm"
                  },
                  "2": {
                    "name": "variable.other.csm"
                  }
                }
              }
            ]
          },
          {
            "name": "meta.function-call.udprim.csm",
            "begin": "^\\s*((?i:udprim))\\s+",
            "beginCaptures": {
              "1": {
                "name": "keyword.control.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "match": "\\G([a-zA-Z_][a-zA-Z0-9_]*)",
                "captures": {
                  "1": {
                    "name": "entity.name.type.csm"
                  }
                }
              },
              {
                "match": "\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s+([a-zA-Z_][a-zA-Z0-9_]*)",
                "captures": {
                  "1": {
                    "name": "support.type.csm"
                  },
                  "2": {
                    "name": "variable.other.csm"
                  }
                }
              }
            ]
          }
        ]
      },
      "csm-parameter-commands": {
        "patterns": [
          {
            "name": "meta.function-call.parameter.csm",
            "begin": "^\\s*((?i:ATTRIBUTE|CFGPMTR|DESPMTR|OUTPMTR|PATBEG))\\s+",
            "beginCaptures": {
              "1": {
                "name": "keyword.control.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "match": "(\\$[a-zA-Z_][a-zA-Z0-9_]*)\\s+(.+?)(?=\\s*(?:#|$))",
                "captures": {
                  "1": {
                    "name": "entity.name.tag.csm"
                  },
                  "2": {
                    "name": "string.quoted.csm"
                  }
                }
              },
              {
                "match": "([a-zA-Z_][a-zA-Z0-9_]*)\\s+([-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)(?=\\s*(?:#|$))",
                "captures": {
                  "1": {
                    "name": "variable.other.csm"
                  },
                  "2": {
                    "name": "constant.numeric.csm"
                  }
                }
              },
              {
                "match": "([a-zA-Z_][a-zA-Z0-9_]*)\\s+(.+?)(?=\\s*(?:#|$))",
                "captures": {
                  "1": {
                    "name": "variable.other.csm"
                  },
                  "2": {
                    "name": "string.quoted.csm"
                  }
                }
              },
              {
                "match": "(\\$[a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*(?:#|$))",
                "captures": {
                  "1": {
                    "name": "entity.name.tag.csm"
                  }
                }
              },
              {
                "match": "([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*(?:#|$))",
                "captures": {
                  "1": {
                    "name": "variable.other.csm"
                  }
                }
              }
            ]
          },
          {
            "name": "meta.function-call.geometry.csm",
            "begin": "^\\s*((?i:BOX|CYLINDER|SPHERE|CONE|TORUS))\\s+",
            "beginCaptures": {
              "1": {
                "name": "keyword.control.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "match": "([a-zA-Z_][a-zA-Z0-9_]*|[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",
                "captures": {
                  "1": {
                    "name": "constant.numeric.csm"
                  }
                }
              }
            ]
          },
          {
            "name": "meta.function-call.ifthen.csm",
            "begin": "^\\s*((?i:IFTHEN))\\s+",
            "beginCaptures": {
              "1": {
                "name": "keyword.control.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "match": "(\\$(?:op[0-9]+|type))(?:=([a-zA-Z]+))?",
                "captures": {
                  "1": {
                    "name": "keyword.operator.csm"
                  },
                  "2": {
                    "name": "constant.language.csm"
                  }
                }
              },
              {
                "match": "\\b(lt|LT|le|LE|eq|EQ|ge|GE|gt|GT|ne|NE|or|OR|and|AND|xor|XOR)\\b",
                "captures": {
                  "1": {
                    "name": "keyword.operator.csm"
                  }
                }
              }
            ]
          }
        ]
      },
      "function-calls": {
        "patterns": [
          {
            "begin": `^\\s*(${commandCallPattern})\\s+`,
            "beginCaptures": {
              "1": {
                "name": "entity.name.function.csm"
              }
            },
            "end": "(?=#|$)",
            "patterns": [
              {
                "include": "#function-parameters"
              }
            ]
          }
        ]
      },
      "function-parameters": {
        "patterns": [
          {
            "name": "variable.parameter.csm",
            "match": "\\$[a-zA-Z_][a-zA-Z0-9_]*"
          },
          {
            "name": "constant.numeric.parameter.csm",
            "match": "\\b[-+]?\\d+(\\.\\d+)?([eE][-+]?\\d+)?\\b"
          },
          {
            "name": "string.quoted.parameter.csm",
            "match": "\"[^\"]*\""
          },
          {
            "name": "punctuation.separator.parameter.csm",
            "match": "[=;,()]"
          },
          {
            "include": "#at-variables"
          }
        ]
      },
      "control-keywords": {
        "patterns": [
          {
            "name": "keyword.control.csm",
            "match": controlPattern
          }
        ]
      },
      "function-keywords": {
        "patterns": [
          {
            "name": "entity.name.tag.csm",
            "match": functionPattern
          }
        ]
      },
      "operators": {
        "patterns": [
          {
            "name": "keyword.operator.csm",
            "match": "[+\\-*/=<>!&|^%~]+"
          }
        ]
      },
      "variables": {
        "patterns": [
          {
            "name": "variable.other.csm",
            "match": "\\b[a-zA-Z_][a-zA-Z0-9_]*\\b"
          }
        ]
      },
      "invalid-lines": {
        "patterns": [
          {
            "name": "invalid.csm",
            "match": "^\\s*[^#\\s].*$"
          }
        ]
      }
    },
    "scopeName": "source.csm"
  };

  fs.writeFileSync(path.join(__dirname, '../csm.tmLanguage.json'), JSON.stringify(grammar, null, 2));
  console.log('Grammar file generated successfully!');
}

generateGrammar();
