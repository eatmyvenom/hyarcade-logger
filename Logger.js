const {
  argv
} = require("process");
const verbose = argv.includes("--verbose") || argv.includes("-v");
let name = argv[2];
name = name == "bot" ? argv[argv.length - 1] : name;
name = name == undefined ? "hyarcade" : name;

/**
 * @returns {string} Formatted time
 */
function daytime () {
  const d = new Date();
  return `${(`0${d.getMonth() + 1}`).slice(-2)}/${(`0${d.getDate()}`).slice(-2)}-${(`0${d.getHours()}`).slice(-2)}:${(`0${d.getMinutes()}`).slice(-2)}:${(`0${d.getSeconds()}`).slice(-2)}:${(`00${d.getMilliseconds()}`).slice(-3)}`;
}

/**
 * @param {string} type
 * @param {*} string
 * @param {string} color
 */
function print (type, string, color = "\x1b[0m") {
  for(const s of string?.toString()?.split("\n") ?? "") {
    println(type, s, color);
  }
}

/**
 * @param {string} type
 * @param {string} string
 * @param {string} color
 */
function println (type, string, color = "\x1b[0m") {
  const str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [${color}${type}\x1b[0m]${color} ${string}\x1b[0m`;
  console.log(str);
  require("fs").writeFile("stdout.log", `${str}\n`, {
    flag: "a"
  }, () => {});
}

/**
 * @param {string} string
 */
function error (string) {
  for(const s of string?.toString()?.split("\n") ?? "") {
    errorln(s);
  }
}

/**
 * @param {string} string
 */
function errorln (string) {
  const str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [\x1b[31mERROR\x1b[0m]\x1b[31m ${string}\x1b[0m`;
  console.log(str);
  require("fs").writeFile("stderr.log", `${str}\n`, {
    flag: "a"
  }, () => {});
}

module.exports = class Logger {
  /**
   * Log content to stdout or a file
   *
   * @param {string[]} content
   */
  static log (...content) {
    print("LOG", content.join(" "));
  }

    static out = this.log;

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static info (...content) {
      print("INFO", content.join(" "), "\x1b[32m");
    }

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static warn (...content) {
      print("WARN", content.join(" "), "\x1b[33m");
    }

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static debug (...content) {
      print("DEBUG", content.join(" "), "\x1b[95m");
    }

    static dbg = this.debug;

    /**
     * Log content to stdout or a file
     *
     * @param {string} content
     */
    static verbose (...content) {
      if(verbose) {
        print("VERBOSE", content.join(" "), "\x1b[90m");
      }
    }

    /**
     * Log content to stderr or a file
     *
     * @param {string} content
     */
    static error (...content) {
      error(content.join(" "));
    }

    static err = this.error;
};
