// REQUISIÇÕES DA BAILEYS

const {
WAConnection,
MessageType,
Presence,
Mimetype,
GroupSettingChange
} = require('@adiwajshing/baileys')

// REQUISIÇÕES DE ARQUIVOS PRÓPRIOS

const cor = require('./funcoes/cores')
const getBuffer = require('./funcoes/getbuffer')
const banner = require('./funcoes/banner')
const { start, sucesso } = require('./funcoes/start')

// REQUISIÇÕES DE MÓDULOS

const fs = require('fs')
const moment = require('moment-timezone')
const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss')

// PREFIXO

prefixo = '!'

// FUNÇÕES BÁSICAS

function contar_hms(segundos){
function exe(hms){
return (hms < 10 ? '0' : '') + hms
}

var horas = Math.floor(segundos / (60*60));
var minutos = Math.floor(segundos % (60*60) / 60);
var segundos = Math.floor(segundos % 60);

return `${exe(horas)} Hora(s) ${exe(minutos)} Minuto(s) e ${exe(segundos)} Segundo(s)`
}

// FUNÇÃO DE START

async function iniciamento() {

const client = new WAConnection()
client.logger.level = 'warn'
console.log(banner.string)
client.on('qr', () => {
console.log(cor('[','white'), cor('!','red'), cor(']','white'), cor('Escaneie o QRCode abaixo...'))
}) 

fs.existsSync('./qr.json') && client.loadAuthInfo('./qr.json')

client.on('connecting', () => {
start('2', 'Tentando conectar...')
})
client.on('open', () => {
sucesso('2', 'Feito, conectado com sucesso!')
})

await client.connect({timeoutMs: 30*1000})
fs.writeFileSync('./qr.json',
JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

// EVENTOS

client.on('chat-update', async (mek) => {
try {
if (!mek.hasNewMessage) return
mek = JSON.parse(JSON.stringify(mek)).messages[0]
if (!mek.message) return
if (mek.key && mek.key.remoteJid == 'status@broadcast') return
if (mek.key.fromMe) return
global.prefixo

const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const type = Object.keys(mek.message)[0]
var body = (type === 'conversation') ?
mek.message.conversation : (type == 'imageMessage') ?
mek.message.imageMessage.caption : (type == 'videoMessage') ?
mek.message.videoMessage.caption : (type == 'extendedTextMessage') ?
mek.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
mek.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ?
mek.message.listResponseMessage.singleSelectReply.selectedRowId : ''
const args = body.trim().split(/ +/).slice(1)
const isCmd = body.startsWith(prefixo)
const comando = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''

// TIPOS DE ENVIO DE MENSAGEM

const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

// VARIÁVEIS DE INFORMAÇÃO

const proprietario = ["557599056928@s.whatsapp.net"]
const numeroBOT = client.user.jid
const isGroup = from.endsWith('@g.us')
const sender = isGroup ? mek.participant : mek.key.remoteJid
const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupDesc = isGroup ? groupMetadata.desc : ''

// VARIÁVEIS DE CONFIRMAÇÃO

const isBotGroupAdmins = groupAdmins.includes(numeroBOT) || false
const isGroupAdmins = groupAdmins.includes(sender) || false
const isDono = proprietario.includes(sender)

// PUSHNAME

pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : 'Indefinido'

// AÇÕES ENCURTADAS

const reply = (texto) => {
client.sendMessage(from, texto, text, {quoted:mek})
}

// MARCAÇÃO - TIPOS DE MENSAGENS

const isMedia = (type === 'imageMessage' || type === 'videoMessage')
const isMFoto = type === 'extendedTextMessage' && content.includes('imageMessage')
const isMVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isMSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

// CONSOLE MOSTRANDO COMANDOS EXECUTADOS

if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mSucesso\x1b[1;37m]', time, cor(comando), 'Recebido de', cor(sender.split('@')[0]), 'args :', cor(args.length))
if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRecebido\x1b[1;37m]', time, cor('Mensagem'), 'Recebida de', cor(sender.split('@')[0]), 'args :', cor(args.length))
if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mSucesso\x1b[1;37m]', time, cor(comando), 'Recebido de', cor(sender.split('@')[0]), 'Grupo ➸', cor(groupName), 'args :', cor(args.length))
if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRecebido\x1b[1;37m]', time, cor('Mensagem'), 'Recebida de', cor(sender.split('@')[0]), 'Grupo ➸', cor(groupName), 'args :', cor(args.length))

// INÍCIO DA SWITCH PARA : CASES

switch(comando) {

// COMANDOS DE PROPRIETÁRIO

case 'tms': case 'transmitir':
chats = await client.chats.all()
if ( isMedia && !mek.message.videoMessage || isMFoto ) {
let contexto = isMFoto ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
let base64 = await client.downloadMediaMessage(contexto)
for ( let x of chats ) {
client.sendMessage(x.jid, base64, image, { caption: `*TRANSMISSÃO PARA CHATS.*\n\n${args.join(' ')}`, text)
}
reply('Transmissão enviada com sucesso.')
} else {
for ( let x of chats ) {
client.sendMessage(x.jid, `*TRANSMISSÃO PARA CHATS.*\n\n${args.join(' ')}`})
}
reply('Transmissão enviada com sucesso.')
}
break

}
// FECHA A SWITCH

// FECHANDO EVENTO E TRY [ ... ]

} catch (erro) {
console.log('Erro : %s', cor(erro, 'red'))
}
})
}
iniciamento()


