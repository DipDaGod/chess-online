import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@latest/+esm";

const board = document.getElementById("board");
const game = new Chess();

const pieces = {
    r: "Chess_rdt45.svg",
    n: "Chess_ndt45.svg",
    b: "Chess_bdt45.svg",
    q: "Chess_qdt45.svg",
    k: "Chess_kdt45.svg",
    p: "Chess_pdt45.svg",

    R: "Chess_rlt45.svg",
    N: "Chess_nlt45.svg",
    B: "Chess_blt45.svg",
    Q: "Chess_qlt45.svg",
    K: "Chess_klt45.svg",
    P: "Chess_plt45.svg"
};

let selectedSquare = null;

function renderBoard() {
    board.innerHTML = "";

    document.getElementById("turn").textContent =
        game.turn() === "w"
            ? "White to move"
            : "Black to move";

    if (game.isCheckmate()) {
        document.getElementById("turn").textContent =
            game.turn() === "w"
                ? "Checkmate — Black wins!"
                : "Checkmate — White wins!";
    } else if (game.isDraw()) {
        document.getElementById("turn").textContent = "Draw!";
    } else if (game.isCheck()) {
        document.getElementById("turn").textContent =
            game.turn() === "w"
                ? "White to move — Check!"
                : "Black to move — Check!";
    }

    const boardState = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");
            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            square.dataset.row = row;
            square.dataset.col = col;
            square.dataset.square =
                String.fromCharCode(97 + col) + (8 - row);

            if (row === 7) {
                const letter = document.createElement("span");
                letter.textContent = String.fromCharCode(97 + col);
                letter.classList.add("coordinate");
                square.appendChild(letter);
            }

            if (col === 0) {
                const number = document.createElement("span");
                number.textContent = 8 - row;
                number.classList.add("number");
                square.appendChild(number);
            }

            const currentPiece = boardState[row][col];

            if (currentPiece) {
                const pieceCode =
                    currentPiece.color === "w"
                        ? currentPiece.type.toUpperCase()
                        : currentPiece.type;

                const pieceElement = document.createElement("img");
                pieceElement.src = `pieces/${pieces[pieceCode]}`;
                pieceElement.classList.add("piece");
                square.appendChild(pieceElement);
            }

            square.addEventListener("click", () => {

                // Try move first
                if (
                    selectedSquare &&
                    selectedSquare !== square.dataset.square
                ) {
                    const move = game.move({
                        from: selectedSquare,
                        to: square.dataset.square,
                        promotion: "q"
                    });

                    if (move) {
                        selectedSquare = null;
                        renderBoard();
                        return;
                    }
                }

                document.querySelectorAll(".move-dot").forEach(dot => {
                    dot.remove();
                });

                document.querySelectorAll(".selected").forEach(sq => {
                    sq.classList.remove("selected");
                });

                // Empty square clears selection
                if (!currentPiece) {
                    selectedSquare = null;
                    return;
                }

                // Wrong color piece clears selection
                if (currentPiece.color !== game.turn()) {
                    selectedSquare = null;
                    return;
                }

                // Same piece deselects
                if (selectedSquare === square.dataset.square) {
                    selectedSquare = null;
                    return;
                }

                // Select piece
                selectedSquare = square.dataset.square;
                square.classList.add("selected");

                const moves = game.moves({
                    square: selectedSquare,
                    verbose: true
                });

                moves.forEach(move => {
                    const target = document.querySelector(
                        `[data-square="${move.to}"]`
                    );

                    if (!target) return;

                    const dot = document.createElement("div");
                    dot.classList.add("move-dot");
                    target.appendChild(dot);
                });
            });

            board.appendChild(square);
        }
    }
}

document.getElementById("reset-btn").addEventListener("click", () => {
    game.reset();
    selectedSquare = null;
    renderBoard();
});

renderBoard();