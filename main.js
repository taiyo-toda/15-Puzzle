"use strict";

const tiles = []; //タイルの配列
let moveCount = 0; // 移動回数
let timer = null; // タイマー機能
let startTime = null; // 開始時間を保存する変数
let isInitializing = false; // 初期化中フラグ

function init(shuffleCount) {
    isInitializing = true;  // 初期化フラグを立てる
    
    // リセット処理を実行
    reset();
    // テーブルの初期化
    const table = document.getElementById("table");
    
    // 既存の子要素の全削除
    while(table.firstChild) {
        table.removeChild(table.firstChild);
    }

    tiles.length = 0;

    // タイルの生成
    for(let i = 0; i < 4; i++) { // 実際のtableの生成
        let tr = document.createElement("tr") // table_row(行を作るループ)
        for(let j = 0; j < 4; j++) {
            let td = document.createElement("td") // table_data(データを格納するループ)
            let index = i * 4 + j; // この式で4x4の表が生成される
            
            td.className = "tile"; // htmlのclass名を定義
            
            // 初期状態ではどちらも一致するので、indexで代入しておく
            td.index = index;
            td.value = index;

            // 三項演算子
            // indexが0なら空白に、そうでなければindexの中身をテキストとして代入
            td.textContent = index == 0 ? "" : index; 
            td.onclick = click; // セル(パズルのピース)をクリックされたら、クリック関数を呼び出す
            tr.appendChild(td); // 実際にhtmlへ書き出す
            tiles.push(td);
        }

        table.appendChild(tr) // 行をhtmlへ書き出す 
    }

    // シャッフル(実際のクリックを模倣することにより再現)
    for(let i = 0; i < shuffleCount; i++) {
        click({ 
            srcElement: { index: Math.floor(Math.random() * 16) }
        });
    }

    // シャッフル完了後にフラグを解除
    isInitializing = false;
    moveCount = 0;
    document.getElementById('moves').textContent = `移動回数: 0`;
}

function click(e) { // タイルがクリックされたら移動判定を行う関数
    // srcElementとtargetの両方に対応
    let i = (e.srcElement && e.srcElement.index !== undefined) ? e.srcElement.index : e.target.index;

    // クリックの際に4方向どれかの移動が可能であれば、swap関数で入れ替える
    if(i-4 >= 0 && tiles[i-4].value == 0 ) {
        swap(i, i-4); // 上移動
    } else if (i + 4 < 16 && tiles[i+4].value == 0 ) {
        swap(i, i+4); // 下移動
    } else if(i % 4 != 0 && tiles[i-1].value == 0 ) {
        swap(i, i-1); // 左移動
    } else if(i % 4 != 3 && tiles[i+1].value == 0 ) {
        swap(i, i+1); // 右移動
    }
}

function swap(i, j) { // 添字とタイルの入れ替えを行う関数
    let tmp = tiles[i].value;

    tiles[i].textContent = tiles[j].textContent;
    tiles[i].value = tiles[j].value;
    
    tiles[j].textContent = tmp == 0 ? "" : tmp;
    tiles[j].value = tmp;

    // シャッフル中でない場合のみカウント
    if (!isInitializing) {
        moveCount++;
        document.getElementById('moves').textContent = `移動回数: ${moveCount}`;
        checkWin(); // クリア判定
    }
}

function checkWin() { // クリア判定を行う関数
    const isWin = tiles.every((tile, index) => tile.value === index); // タイルが正解の添字と一致するか確認
    if (isWin) {
        clearInterval(timer); // 経過時間のリセット
        const timeText = document.getElementById('timer').textContent;
        alert(`クリア！\n${timeText}\n移動回数: ${moveCount}`);
    }
}

function reset() { // 初期化の関数
    document.getElementById('moves').textContent = `移動回数: 0`;
    if(timer) clearInterval(timer); // タイマーが0でなければリセットを掛ける関数
    startTime = new Date(); // 開始時間
    timer = setInterval(updateTimer, 1000); // タイマーの自動更新を1000msごとに
    moveCount = 0; // 移動回数
}

function updateTimer() { // プレイ時間の更新を行う関数
    const now = new Date(); // 現在時刻
    const diff = Math.floor((now - startTime) / 1000); // 現在時刻から開始時刻を引いてミリ秒に変換
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0'); // 分
    const seconds = (diff % 60).toString().padStart(2, '0'); // 秒
    document.getElementById('timer').textContent = `時間: ${minutes}:${seconds}`; // 出力
}