var chalk = require("chalk");
var prefix = '   GomePlus';
var sep = chalk.gray('·');
exports.log = function (msg) {
    console.log(chalk.white(prefix), '✨ ', sep, msg);
};
exports.fatal = function (msg) {
    if (msg instanceof Error)
        msg = msg.message.trim();
    console.error(chalk.red(prefix), '💩 ', sep, msg);
};
exports.success = function (msg) {
    console.log(chalk.green(prefix), '🎉 ', sep, msg);
};
