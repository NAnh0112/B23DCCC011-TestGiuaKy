import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        startNewGame();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const startNewGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(10);
    setGameOver(false);
    setGameWon(false);
    setGuess('');
  };

  const handleGuess = () => {
    const guessNumber = parseInt(guess);
  
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      message.error('Vui lòng nhập một số từ 1 đến 100!');
      setGuess('');
      return;
    }

  
    setAttempts(prev => prev - 1);
  
    if (guessNumber === randomNumber) {
      setGameWon(true);
      setGameOver(true);
      message.success('🎉 Chúc mừng! Bạn đã đoán đúng!');
    } else {
      if (attempts <= 1) {
        setGameOver(true);
        message.error(` Bạn đã hết lượt! Số đúng là ${randomNumber}. Nhấn R để chơi lại`);
      } else {
        message.warning(
          guessNumber > randomNumber ? '📈 Bạn đoán quá cao!' : '📉 Bạn đoán quá thấp!'
        );
      }
    }
    setGuess('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 Trò chơi đoán số</h1>
      <p className={styles.info}>🔢 Đoán một số từ 1 đến 100</p>
      <p className={styles.info} style={{ color: attempts === 2 || attempts === 1 ? 'red' : 'inherit' }}>
        {(attempts === 2 || attempts === 1) && <ExclamationCircleOutlined />} 📌 Số lượt còn lại: {attempts}
      </p>

      <Input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleGuess();
          }
        }}
        placeholder="Nhập số dự đoán của bạn"
        disabled={gameOver}
        className={styles.input}
      />

      <div>
        <Button 
          className={`${styles.button} ${styles.guessButton}`} 
          onClick={handleGuess}
          disabled={gameOver || !guess}
        >
          <ArrowRightOutlined />
          Đoán
        </Button>

        <Button 
          className={`${styles.button} ${styles.resetButton}`} 
          onClick={startNewGame}
          style={{ marginLeft: '10px' }}
        >
          <ReloadOutlined />
          Chơi lại (R)
        </Button>
      </div>
    </div>
  );
};

export default Game;