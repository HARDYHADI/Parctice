const player=1, dealer=2, none = 0;   //플레이어, 딜러의 값이 같으면 누가 이겼는지 판별 불가능 
let turn_player, player_card, dealer_card=0, winner; //현재 턴 주인공
let win=0, lose=0, draw = 0, i, j;    //승점 각각 0으로 초기화해야함. 안하면 undefined, NaN오류 출력
let card = [, 'A','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']    //카드 배열 배열은 0부터 시작하기에 1부터 시작하도록 변경
let standing, turnEnd, gameOver= false;   //stand 버튼 눌렀을 떄 활성화, 딜러 턴 끝났을때 활성화
let BlackJack = {
  'Player' : {'scorespan' : '#player_blackjack_point', 'div' : '#player_area', 'score' : 0, 'win' : '#win', 'draw' : '#draw', 'lose' : '#lose'},
  'Dealer' : {'scorespan' : '#dealer_blackjack_point', 'div' : '#dealer_area', 'score' : 0},
  'Card' : [, 'A','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  'Value' : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,'8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': [1, 11]},
} ;


//Hit 버튼을 눌렀을 경우에 발생하는 이벤트 => 플레이어에게 카드 배분
document.querySelector('#hit_btn').addEventListener('click', Hit); 

//Stand 버튼을 눌렀을 경우에 발생하는 이벤트 => 딜러 파트로 넘어감
document.querySelector('#stand_btn').addEventListener('click', Stand);

//Deal 버튼을 눌렀을 경우에 발생하는 이벤트 => 초기화 후 게임 시작
document.querySelector('#deal_btn').addEventListener('click', Deal);


//stand 상태 아닐 때 램덤한 카드 나눠주기
function Hit() { //딜러가 Hit을 할 리는 없으니 player로 
    
    if(!standing && !turnEnd){
      const card = Rand();
            showcard(card, BlackJack.Player);
            score(card, BlackJack.Player);
       }
    if (BlackJack.Player.score > 21) {
            standing = true;
       }
}

  
//카드 보여주기
function showcard(card, turn_player) {
  const cardimg = document.createElement('img'); //카드 이미지 엘리먼트 만들기
  cardimg.src = `img/${card}.png`;                //randomnumber에서 리턴한 값으로 카드 뽑기
  cardimg.style = 'width:150px';                 
    document.querySelector(turn_player.div).appendChild(cardimg);    //카드 이미지 #turn_player_area에 출력
  if(turn_player == BlackJack.Player)
    i++;
  else if(turn_player == BlackJack.Dealer)
    j++;
}


//랜덤 값 뽑기
const Rand = () => {
  const randomnumber = Math.floor(Math.random()*13)+1;
  console.log(randomnumber);
  return BlackJack.Card[randomnumber];
}

//딜러 턴으로
function Stand(){
    console.log('stand')
        standing = true;
        turnEnd = true;
        DealerTurn();
}


//점수 
function score(card, turn_player){

    if(card=='A')
        calculateAceValue(turn_player);
    else if(card == 'J' || card == 'Q' || card == 'K')
        calculateCardValue(card, turn_player)
    else {
        turn_player.score+=parseInt(card);
    }
    if(turn_player.score>21)
    {
        document.querySelector(turn_player.scorespan).textContent = '버스트';
        Stand();
    }
    else if(turn_player.score === 21) {
        document.querySelector(turn_player.scorespan).textContent = '블랙잭!';      //블랙잭일경우 추가
        Stand();
    }
    else
        document.querySelector(turn_player.scorespan).textContent = turn_player.score;
}

//Ace 카드 값 결정
function calculateAceValue(turn_player) {
  
      if (turn_player.score < 11) 
        turn_player.score += 11;
    else
        turn_player.score+=1;
    return turn_player.score;
}

//문자로 설정된 카드값 변환
function calculateCardValue(card, turn_player) {

    let cardValue;
  switch(card)
  {
    case 'J' :
        cardValue = 11;
    case 'Q' :
        cardValue = 12;
    case 'K' :
        cardValue = 13;
  }

  turn_player.score = turn_player.score + parseInt(cardValue);        //turn_player일 경우 카드가 그림카드면 오류 출력
    return turn_player.score;
}

//딜러 턴
function DealerTurn() {
    while (BlackJack.Dealer.score < 17) {
        const card = Rand();
        showcard(card, BlackJack.Dealer);
        score(card, BlackJack.Dealer);

    }
        turnEnd = true;
    Winner();
}


//승자 판별 if문의 어디가 작동안하는지 판별하기 위해 switch문으로 바꿔서 판별, 블랙잭일 경우 승/패 계산
function Winner() {
    switch (true) {
      case (BlackJack.Player.score > 21 && BlackJack.Dealer.score > 21):
        // 둘 다 버스트
        winner = none;
        draw++;
        break;
      case (BlackJack.Player.score > 21 && BlackJack.Dealer.score < 21):
        // 플레이어만 버스트 -> 패
        winner = dealer;
        lose++;
        break;
      case (BlackJack.Player.score < 21 && BlackJack.Dealer.score > 21):
        //딜러 버스트 -> 
        winner = player;
        win++;
        break;
      case (BlackJack.Player.score == 21 && BlackJack.Dealer.score != 21):
        // 플레이어 버스트 X, 딜러 버스트 -> 승
        winner = player;
        win++;
        break;
      case (BlackJack.Player.score != 21 && BlackJack.Dealer.score == 21):
        // 플레이어 버스트 X, 딜러 블랙잭 -> 패
        winner = dealer;
        lose++;
        break;
      case (BlackJack.Player.score == 21 && BlackJack.Dealer.score == 21):
        // 블랙잭 동점 -> 무승부
        winner = none;
        draw++;
        break;
      default:
        // 플레이어 버스트 X, 딜러 버스트 X
        if (BlackJack.Player.score < BlackJack.Dealer.score) {
          // 딜러 카드값이 근접 -> 패
          winner = dealer;
          lose++;
        } else if (BlackJack.Player.score > BlackJack.Dealer.score) {
          // 플레이어 카드값이 근접 -> 승
          winner = player;
          win++;
        } else if (BlackJack.Player.score == BlackJack.Dealer.score) {
          // 동점 -> 무승부
          winner = none;
          draw++;
        }
        break;
    }
    // 함수가 정상 작동 했는지 판별
    console.log(BlackJack.Player.score);
    console.log(BlackJack.Dealer.score);
    console.log(winner);
    console.log(win);
    console.log(lose);
    console.log(draw);
    result();
  }
//결과 보여주기
function result() {
    let msg;

    if(turnEnd == true) 
    {
        if(winner == player)
        {
            document.querySelector('#win').textContent = win;
            msg = '이겼습니다!'
        } else if (winner == none)
        {
            document.querySelector('#draw').textContent = draw;
            msg = '무승부입니다'
        } else if (winner == dealer)
        {
            document.querySelector('#lose').textContent = lose;
            msg = '졌습니다...'
        }

        document.querySelector('#Result').textContent = msg;
    }
    
    gameOver = true;
}



//초기화
function Deal() {

    if(gameOver === true)
    {
        standing, turnEnd = false;
        let player_img = document.querySelector(BlackJack.Player.div).querySelectorAll('img');
        let dealer_img = document.querySelector(BlackJack.Dealer.div).querySelectorAll('img');

        for(i=0 ; i<player_img.length ; i++) 
        {
            player_img[i].remove();
        }
        for(i=0 ; i<dealer_img.length ; i++)  //카드 이미지 삭제 함수
        {
            dealer_img[i].remove();
        }
      
        // 사용한 값들 전부 초기화
        msg = 0;
        

        BlackJack.Player.score = 0;
        BlackJack.Dealer.score = 0;

        document.querySelector('#player_blackjack_point').textContent = 0;
        document.querySelector('#dealer_blackjack_point').textContent = 0;
      
        document.querySelector('#Result').textContent = 'BlackJack';


    }
    
    winner = none;
    standing = false;
    turnEnd = false;
}

