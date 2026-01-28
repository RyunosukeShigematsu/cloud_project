// Check.js
const shapeContainer = document.getElementById('shapeContainer');
const optionsContainer = document.getElementById('optionsContainer');

// 図形のデータリスト
// labelをシンプルな「丸」「四角」などに変更しました
const shapes = [
    { id: 'circle',   class: 'shape-circle',   label: '丸' },
    { id: 'square',   class: 'shape-square',   label: '四角' },
    { id: 'triangle', class: 'shape-triangle', label: '三角' },
    { id: 'diamond',  class: 'shape-diamond',  label: 'ひし形' }
];

window.onload = () => {
    // 1. 表示する図形を固定（0番目＝丸）
    const targetShape = shapes[0]; 
    
    // 2. 画面中央に図形を描画
    const shapeElement = document.createElement('div');
    shapeElement.classList.add('shape', targetShape.class);
    shapeContainer.appendChild(shapeElement);

    // 3. 選択肢ボタンを作成
    shapes.forEach(option => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        
        // 【変更】文字を表示する
        btn.innerText = option.label;

        // クリック時の動作
        btn.addEventListener('click', () => {
            // ログだけ残して進む
            const isCorrect = (option.id === targetShape.id);
            console.log(`選択: ${option.label}, 正解: ${targetShape.label}, 結果: ${isCorrect}`);

            window.location.href = '../Task/Task.html';
        });

        optionsContainer.appendChild(btn);
    });
};