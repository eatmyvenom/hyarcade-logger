const {
    argv
} = require("process");
let name = argv[2];
name = name == "bot" ? argv[argv.length - 1] : name;
name = name == undefined ? "hyarcade" : name;

/**
 * @returns {string} Formatted time
 */
function daytime() {
    let d = new Date();
    return `${("0" + d.getMonth()).slice(-2)}/${("0" +d.getDate()).slice(-2)}-${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}:${("00" + d.getMilliseconds()).slice(-3)}`;
}

/**
 * @param {string} type
 * @param {string} string
 * @param {string} color
 */
function print(type, string, color = "\x1b[0m") {
    string = "" + string;
    for(let s of string.split("\n")) {
        println(type, s, color);
    }
}

/**
 * @param {string} type
 * @param {string} string
 * @param {string} color
 */
function println(type, string, color = "\x1b[0m") {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [${color}${type}\x1b[0m]${color} ${string}\x1b[0m`;
    console.log(str);
    require("fs").writeFile("stdout.log", str + "\n", {
        flag: "a"
    }, () => {});
}

/**
 * @param {string} string
 */
function error(string) {
    string = "" + string;
    for(let s of string.split("\n")) {
        errorln(s);
    }
}

/**
 * @param {string} string
 */
function errorln(string) {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [\x1b[31mERROR\x1b[0m]\x1b[31m ${string}\x1b[0m`;
    console.log(str);
    require("fs").writeFile("stderr.log", str + "\n", {
        flag: "a"
    }, () => {});
}

module.exports = class Logger {
    /**
     * Log content to stdout or a file
     *
     * @param {string[]} content
     */
    static log(...content) {
        print("LOG", content.join(" "));
    }

    static out = this.log;

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static info(...content) {
        print("INFO", content.join(" "), "\x1b[32m");
    }

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static warn(...content) {
        print("WARN", content.join(" "), "\x1b[33m");
    }

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static debug(...content) {
        print("DEBUG", content.join(" "), "\x1b[95m");
    }

    static dbg = this.debug;

    /**
     * Log content to stderr or a file
     *
     * @param {string} content
     */
    static error(...content) {
        error(content.join(" "));
    }

    static err = this.error;
};
