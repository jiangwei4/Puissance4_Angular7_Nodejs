const express = require('express')
const dbGame = require('simpledb')
const app = express()
const bodyParser = require('body-parser')
const uuidV4 = require('uuid/v4');

const PORT = 8083


const ws = require('ws')

const wss = new ws.Server({port: 8084})
const client = []
wss.on('connection', (webSocket) => {
    console.log('nouveau client')
    webSocket.send('bonjour')
	client.push(webSocket)
})


dbGame.initSync('dbGame.json')	
dbGame.set('utilisateur',[])	
dbGame.set('session',[])	
dbGame.set('games',[])

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

app.use(bodyParser.json())

function envoyerMess(message){
	
	for(i = 0; i < client.length ; i++){
		if(client[i].OPEN == client[i].readyState){
			client[i].send(message)
		} else {
			console.log('le client'+client[i]+' websocket not open')
		}
	}
}
function UtilisateurExist(login){
	let tab  = dbGame.get('utilisateur')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].login == login)
			return true
	}
	return false
}

function returnMdp(login){
	let tab  = dbGame.get('utilisateur')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].login == login)
			return tab[i].password
	}
	return false
}

function nonConnecte(login){
	let tab  = dbGame.get('session')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].login == login)
			if(tab[i].uuid != ''){
				return -2
			} else {
				return i
			}
	}
	return -1
}

function uuidConnecte(login,uuid){
	let tab  = dbGame.get('session')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].uuid == uuid)
			return true
	}
	return false
}

function uuidConnecteReturnLogin(uuid){
	let tab  = dbGame.get('session')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].uuid == uuid)
			return tab[i].login 
	}
	return ''
}

function colonnePasPleine(game,position,i){
	for( j = game.game.length-1 ; j > -1 ; j--){
		if(game.game[j][position] == 2)
			return true
	}
	return false
}

function tabPlein(game){
	for( i = 0; i < game.game[0].length; i++){
		if(game.game[0][i] == 2)
			return false
	}
	return true
}

function gagne(game){
	for( x = game.game.length-1 ; x > -1 ; x--){
		for( y = 0; y < game.game[x].length ; y++){
			if(y+3 < game.game[x].length){
				if(game.game[x][y] == game.game[x][y+1] && game.game[x][y+1] == game.game[x][y+2] && game.game[x][y+2] == game.game[x][y+3] && game.game[x][y] != 2){
					return true
				}
			}
			if(y+3 < game.game[x].length && x-3 > -1){
				if(game.game[x][y] == game.game[x-1][y+1] && game.game[x-1][y+1] == game.game[x-2][y+2] && game.game[x-2][y+2] == game.game[x-3][y+3] && game.game[x][y] != 2){
					return true
				}
			}
			if(x-3 > -1){
				if(game.game[x][y] == game.game[x-1][y] && game.game[x-1][y] == game.game[x-2][y] && game.game[x-2][y] == game.game[x-3][y] && game.game[x][y] != 2){
					return true
				}
			}
			if(y+3 < game.game[x].length && x+3 < game.game.length){
				if(game.game[x][y] == game.game[x+1][y+1] && game.game[x+1][y+1] == game.game[x+2][y+2] && game.game[x+2][y+2] == game.game[x+3][y+3] && game.game[x][y] != 2){
					return true
				}
			}
		}
	}
	return false
}

function placerPion(game,position,i){
	let tmp = dbGame.get('games')
	let autreJoueur = tmp[i].playe == tmp[i].loginA ? tmp[i].loginB : tmp[i].loginA;
	let couleur  = tmp[i].playe == tmp[i].loginA ? 1 : 0;
	if(colonnePasPleine(game,position,i)){
		for( j = tmp[i].game.length-1 ; j > -1 ; j--){
			if(tmp[i].game[j][position] == 2){
				tmp[i].game[j][position] = couleur
				break
			}
		}
		if(gagne(game)){
			tmp[i] = {'id':tmp[i].id,'playe':'','loginA':tmp[i].loginA,'loginB':tmp[i].loginB,'game':tmp[i].game}
			dbGame.set('games',tmp)
			dbGame.write()
			envoyerMess('reload '+autreJoueur)
			return {'bug':'Vous avez Gagné'}
		} else {
			if(tabPlein(game)){
				tmp[i] = {'id':tmp[i].id,'playe':'','loginA':tmp[i].loginA,'loginB':tmp[i].loginB,'game':tmp[i].game}
				dbGame.set('games',tmp)
				dbGame.write()
				envoyerMess('reload '+autreJoueur)
				return {'bug':'match nul'}
			} else {
				tmp[i] = {'id':tmp[i].id,'playe':autreJoueur,'loginA':tmp[i].loginA,'loginB':tmp[i].loginB,'game':tmp[i].game}
				dbGame.set('games',tmp)
				dbGame.write()
				envoyerMess('reload '+autreJoueur)
				return {'bug':'Vous avez joué'}
			}
		}
	} else {
		return {'bug':'impossible de jouer ici'}
	}
}

app.post('/subscription',(request,response) => {
	if( UtilisateurExist(request.body.login)){
		response.send({'response':'utilisateur existe déjà'})
	} else {
		let tmp2 = dbGame.get('utilisateur')
		tmp2.push({'login':request.body.login,'password':request.body.password,'avatar':request.body.avatar})
		dbGame.set('utilisateur',tmp2)
		dbGame.write()
		response.send({'response':'Bravo vous êtes enregistré'})
	}
})

function recupererAvatar(login){
	let tab  = dbGame.get('utilisateur')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].login == login)
			return tab[i].avatar 
	}
	return ''
}

app.post('/login',(request,response) => {
	if(returnMdp(request.body.login) == request.body.password ){
		let position = nonConnecte(request.body.login)
		let tmp2 = dbGame.get('session')
		let uui = uuidV4()
		if(position == -1){
			tmp2.push({'uuid':uui,'login':request.body.login})
			dbGame.set('session',tmp2)
			dbGame.write()
			response.send({'response':'Connexion reussi','token':uui,'avatar':recupererAvatar(request.body.login)})
		} else {
			if (position != -2){
				tmp2[position].uuid = uui
				dbGame.set('session',tmp2)
				dbGame.write()
				response.send({'response':'Bravo vous êtes connecté','token':uui,'avatar':recupererAvatar(request.body.login)})
			}
			response.send({'response':'Connexion reussi','avatar':recupererAvatar(request.body.login)})
		}
	} else {
		response.send({'response':'mauvais mot de passe ou mauvais login'})
	}
})

app.post('/deconnexion',(request,response) => {
	let tab  = dbGame.get('session')
	for(let i = 0; i <tab.length; i++ ){
		if (tab[i].uuid == request.headers.authorization)
			tab[i].uuid = ''
	}
	dbGame.set('session',tab)
	dbGame.write()
	response.send({'response':'Bravo vous êtes deconnecté'})
})
	
app.post('/joueurs',(request,response) => {
	let login = uuidConnecteReturnLogin(request.headers.authorization)
	let tab  = dbGame.get('utilisateur')
	let utilisateur = new Array()
	for(let i = 0; i <tab.length; i++ ){
		if(tab[i].login != login)
			utilisateur.push(tab[i].login)
	}
	response.send({'utilisateurs':utilisateur})
})

app.post('/newGame',(request,response) => {
	if(uuidConnecte(request.body.login,request.headers.authorization)){
		let tmp = dbGame.get('games')
		let tab = new Array(7)
		let uui = uuidV4()
		for (i=0;i<=6;i++) {
			tab[i]= new Array(8);
			for(j=0;j<=7;j++){
				tab[i][j]=2
			}
		}
		tmp.push({'id':uui,'playe':uuidConnecteReturnLogin(request.headers.authorization),'loginA':uuidConnecteReturnLogin(request.headers.authorization),'loginB':request.body.login,'game':tab})
		dbGame.set('games',tmp)
		dbGame.write()
		response.send({'response':'nouveau jeu crée'})
	} else {
		response.send({'response':'vous n\'etes pas connecte'})
	}
})	

app.post('/games',(request,response) => {
	let login = uuidConnecteReturnLogin(request.headers.authorization)
	
	let tmp = dbGame.get('games')
	let games = new Array();
	for(i = 0; i < tmp.length; i++){
		if(tmp[i].loginA == login || tmp[i].loginB == login){
			games.push(tmp[i])
		}
	}
	response.send({'games':games})
})

app.post('/grilleget',(request,response) => {
	let idGame = request.body.GameId
	let tmp = dbGame.get('games')
	for(i = 0; i < tmp.length; i++){
		if(tmp[i].id == request.body.GameId){
			response.send({'game':tmp[i]})
		}
	}
})

app.post('/grille',(request,response) => {
	let game;
	let str = 'ABCDEFGH'
	let tmp = dbGame.get('games')
	for(i = 0; i < tmp.length; i++){
		if(tmp[i].id == request.body.GameId){
			game = tmp[i]
			break
		}
	}
	if(game.playe == uuidConnecteReturnLogin(request.headers.authorization)){
		response.send(placerPion(game,str.search(request.body.position),i))
	} else {
		response.send({'bug':'ce n\'est pas a vous de jouer '})
	}
})

app.listen(PORT,() => {
    console.log(`ok ${PORT}`)
})