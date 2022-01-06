const chalk = require('chalk')

const cor = (texto, cor) => {
return !cor ? chalk.green(texto) : chalk.keyword(cor)(texto)
}

module.exports = cor