class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x'; // Le joueur humain commence toujours
        this.gameActive = true;

        // Éléments du DOM
        this.cells = document.querySelectorAll('.cell');
        this.status = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        this.themeToggle = document.getElementById('theme-toggle');

        // Initialisation des événements
        this.initializeEvents();
    }

    initializeEvents() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.board[index] === '' && this.gameActive && this.currentPlayer === 'x') {
            this.makeMove(index);

            if (this.gameActive) {
                // Tour de l'IA
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer);

        if (this.checkWinner()) {
            this.gameActive = false;
            this.status.textContent = `${this.currentPlayer === 'x' ? 'Vous avez' : "L'IA a"} gagné !`;
            return;
        }

        if (this.board.every(cell => cell !== '')) {
            this.gameActive = false;
            this.status.textContent = 'Match nul !';
            return;
        }

        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
        this.status.textContent = this.currentPlayer === 'x' ? 'C\'est votre tour !' : 'Tour de l\'IA...';
    }

    makeAIMove() {
        if (!this.gameActive) return;

        const bestMove = this.findBestMove();
        this.makeMove(bestMove);
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'o';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinner();
        
        if (winner === 'o') return 10 - depth;
        if (winner === 'x') return depth - 10;
        if (board.every(cell => cell !== '')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'o';
                    bestScore = Math.max(bestScore, this.minimax(board, depth + 1, false));
                    board[i] = '';
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'x';
                    bestScore = Math.min(bestScore, this.minimax(board, depth + 1, true));
                    board[i] = '';
                }
            }
            return bestScore;
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }

        return null;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
        this.status.textContent = 'C\'est votre tour !';
        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o');
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

// Initialiser le jeu
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
