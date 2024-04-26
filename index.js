const cells=document.querySelectorAll(".cell");
const statusText= document.querySelector("#statusText");
const restartbtn= document.querySelector("#restartbtn");
const scoreText= document.querySelector("#scoreText");



let board=[
    ['','',''],
    ['','',''],
    ['','','']
];

//Score
let aiScore=0
let humanScore=0;

let human="X";
let ai="O";
let currentPlayer= human;
let running=false;

initializeGame();

function initializeGame(){
    
    cells.forEach(cell=> cell.addEventListener("click",cellClicked))
    restartbtn.addEventListener("click",restartGame);
    statusText.textContent= `Your turn`;
    scoreText.textContent=`AI: ${aiScore} | You: ${humanScore}`;
    running=true;
}


function nextTurn(){
    if(currentPlayer==ai && running){
        
        
        let bestScore=-Infinity;
        let move;
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]==''){
                    
                    board[row][col]=ai;
                    let score=minimax(board,0,false);
                    board[row][col]='';
                    if(score>bestScore){
                        bestScore=score;
                        move=[row,col];
                    }
                    
                }
            }
            
        }
        board[move[0]][move[1]]=ai;
        
        for(let k=0;k<cells.length;k++){
            if(cells[k].getAttribute("cellCol")==move[1] && cells[k].getAttribute("cellRow")==move[0] && currentPlayer==ai){
                cells[k].textContent=ai;
                checkWinner();
            }
        }
    }
    

}
let scores={
    X:-1,
    O:1,
    draw:0

}
function minimax(board,depth,isMaximizing){
     let result=aiWinner();
     if(result!==null){
        let score=scores[result];
        return score;
     }
     else if(isMaximizing){
        
        let bestScore=-Infinity;
        
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]==''){
                    
                    board[row][col]=ai;
                    let score=minimax(board,depth+1,false);
                    board[row][col]='';
                    bestScore=Math.max(score,bestScore)
                    
                }
            }
            
        }return bestScore;
     }else{
        
        let bestScore=Infinity;
        
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]==''){
                    
                    board[row][col]=human;
                    let score=minimax(board,depth+1,true);
                    board[row][col]='';
                    bestScore=Math.min(score,bestScore)
                    
                }
            }
            
        }return bestScore;
     }
    
}

function aiWinner(){
    let aiWin=null;
    //vertical
    for(let i=0;i<3;i++){
        if(equals3(board[i][0],board[i][1],board[i][2])){
            aiWin=board[i][0];   
        }
        
    }
    //horizantal
    for(let i=0;i<3;i++){
        if(equals3(board[0][i],board[1][i],board[2][i])){
            aiWin=board[0][i];
        }
    }
    //diagonal
    for(let i=0;i<3;i++){
        if(equals3(board[0][0],board[1][1],board[2][2])){
            aiWin=board[0][0];
        }
    }
    for(let i=0;i<3;i++){
        if(equals3(board[2][0],board[1][1],board[0][2])){
            aiWin=board[2][0];
        }
    }

    let available=[];
    for(let row=0;row<3;row++){
        for(let col=0;col<3;col++){
            if(board[row][col]==''){
                available.push([row,col]);
            }
        }
        
    }

    if(aiWin==null && available.length==0){
        return 'draw';
    }else{
        return aiWin;
    }

}

function cellClicked(){
    if(currentPlayer==human && running){
        const cellCol=this.getAttribute("cellCol");
        const cellRow=this.getAttribute("cellRow");
        if(board[cellRow][cellCol]==''){
            board[cellRow][cellCol]=human;
            this.textContent=human;
            checkWinner();
        }
        
        
    }    
    return;
    
}

//Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changePlayer(){
    if(currentPlayer==human){
        currentPlayer=ai;
        statusText.textContent=`AI's turn`;
        sleep(800).then(()=> {nextTurn();});
        
        
    }else{
        currentPlayer=human;
        statusText.textContent=`Your turn`;
        
        cellClicked();
    }
    
    
}

function equals3(a,b,c){
    return (a==b && b==c && a!='' && b!='');
    
}
function checkWinner(){

    let winner=false;

    //vertical
    for(let i=0;i<3;i++){
        if(equals3(board[i][0],board[i][1],board[i][2])){
            winner=true;
            
            
        }
        
    }
    //horizantal
    for(let i=0;i<3;i++){
        if(equals3(board[0][i],board[1][i],board[2][i])){
            winner=true;
        }
    }
    //diagonal
    for(let i=0;i<3;i++){
        if(equals3(board[0][0],board[1][1],board[2][2])){
            winner=true;
        }
    }
    for(let i=0;i<3;i++){
        if(equals3(board[2][0],board[1][1],board[0][2])){
            winner=true;
        }
    }

    let available=[];
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]==''){
                    available.push([row,col]);
                }
            }
            
        }

    if(winner){
        
        if(currentPlayer==human){
            statusText.textContent=`You Win!`;
            humanScore++;
        }else{
            statusText.textContent=`AI Wins!`;
            aiScore++;
        }
        scoreText.textContent=`AI: ${aiScore} | You: ${humanScore}`;
        running=false;
    }
    else if(available.length==0){
        statusText.textContent=`Draw!`;
        running=false;
    }else{
        
        changePlayer();
        
    }
}
function restartGame(){
    currentPlayer=human;
    
    board=[
        ['','',''],
        ['','',''],
        ['','','']
    ];
    statusText.textContent=`Your turn`;
    cells.forEach(cell=>cell.textContent='');
    running=true;
}