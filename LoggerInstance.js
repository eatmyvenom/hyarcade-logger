/* eslint-disable no-undef */
const path = require("path");
const { argv, stdout, stderr } = require("process");
const { writeFile } = require("fs-extra");

let logLevel = 5;

if (argv.includes("--verbose") || argv.includes("-v")) {
  logLevel = 6;
}

const levels = ["ERROR", "WARN", "LOG", "INFO", "DEBUG", "VERBOSE"];

/**
 * @param {string} type
 * @returns {boolean}
 */
function shouldLog(type) {
  return levels.slice(0, logLevel).includes(type);
}

/**
 * @returns {string} Formatted time
 */
function daytime() {
  const d = new Date();
  return `${`0${d.getMonth() + 1}`.slice(-2)}/${`0${d.getDate()}`.slice(-2)}-${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(-2)}:${`0${d.getSeconds()}`.slice(
    -2,
  )}:${`00${d.getMilliseconds()}`.slice(-3)}`;
}

/**
 * @param {string} string
 * @param {string} name
 */
function errorln(string, name) {
  if (shouldLog("ERROR")) {
    const str = `❌ [\u001B[36m${daytime().trim()}\u001B[0m] [\u001B[36m${name.trim()}\u001B[0m] [\u001B[31mERROR\u001B[0m]\u001B[31m ${string}\u001B[0m\n`;
    stderr.write(str, () => {});
  }

  writeFile(path.join(process.cwd(), "logs", `${name.trim()}-err.log`), `${daytime().trim()} - ${string}\n`, {
    flag: "a",
  })
    .then(() => {})
    .catch(console.error);
}

/**
 * @param {string} type
 * @param {string} string
 * @param {string} name
 * @param {string} color
 * @param {string} emoji
 */
function println(type, string, name, color = "\u001B[0m", emoji = "") {
  let realEmoji = emoji ? `${emoji} ` : "";
  if (shouldLog(type)) {
    const str = `${realEmoji}[\u001B[36m${daytime().trim()}\u001B[0m] [\u001B[36m${name.trim()}\u001B[0m] [${color}${type}\u001B[0m]${color} ${string}\u001B[0m\n`;
    stdout.write(str, () => {});
  }

  writeFile(path.join(process.cwd(), "logs", `${name.trim()}-out.log`), `${daytime().trim()} - ${string}\n`, {
    flag: "a",
  })
    .then(() => {})
    .catch(console.error);
}

/**
 * @param {string} type
 * @param {*} string
 * @param {string} name
 * @param {string} color
 * @param {string} emoji
 */
function print(type, string, name, color = "\u001B[0m", emoji = "") {
  for (const s of string?.toString()?.split("\n") ?? "") {
    println(type, s, name, color, emoji);
  }
}

/**
 * @param {string} string
 * @param {string} name
 */
function error(string, name) {
  for (const s of string?.toString()?.split("\n") ?? "") {
    errorln(s, name);
  }
}

module.exports = class LoggerInstance {
  name;
  emoji = "🎮";

  constructor(name, emoji) {
    this.name = name;
    this.emoji = emoji;
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string[]} content
   */
  log(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "hyarcade" : this.name;
    }

    print("LOG", content.join(" "), this.name);
  }

  out = this.log;

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  info(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "hyarcade" : this.name;
    }

    print("INFO", content.join(" "), this.name, "\u001B[32m");
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  warn(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "hyarcade" : this.name;
    }

    print("WARN", content.join(" "), this.name, "\u001B[33m");
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  debug(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "HyArcade" : this.name;
    }

    print("DEBUG", content.join(" "), this.name, "\u001B[95m");
  }

  dbg = this.debug;

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  verbose(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "HyArcade" : this.name;
    }

    print("VERBOSE", content.join(" "), this.name, "\u001B[90m");
  }

  /**
   * Log content to stderr or a file
   *
   * @param {string} content
   */
  error(...content) {
    if (this.name == undefined) {
      this.name = argv[2];
      this.name = this.name == "bot" ? argv[argv.length - 1] : this.name;
      this.name = this.name == undefined ? "HyArcade" : this.name;
    }

    error(content.join(" "), this.name);
  }

  err = this.error;
};