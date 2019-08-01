module.exports = async function (ws, isWSS) {
    console.log('init ' + (isWSS ? 'ws' : 'ws')+ ' server');
    return ws;
}