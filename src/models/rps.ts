import { useState, useEffect } from "react";


export type ResultType = "win" | "lose" | "draw" | "";

export interface HistoryItem {
  player: string;
  computer: string;
  result: string;
  resultType: "win" | "lose" | "draw";
}


export const choices: string[] = ["Kéo", "Búa", "Bao"];

export const choiceEmojis: Record<string, string> = {
  "Kéo": "✂️",
  "Búa": "🔨",
  "Bao": "📄"
};


export const useRockPaperScissors = () => {
  const [result, setResult] = useState<string>("");
  const [playerChoice, setPlayerChoice] = useState<string>("");
  const [computerChoice, setComputerChoice] = useState<string>("");
  const [displayedComputerChoice, setDisplayedComputerChoice] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [resultType, setResultType] = useState<ResultType>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("");

  const playGame = (playerChoice: string) => {
    const actualComputerChoice: string = choices[Math.floor(Math.random() * choices.length)];
    
    // Start animation
    setIsAnimating(true);
    setResult("");
    setResultType("");
    setPlayerChoice(playerChoice);
    
    let animationStartTime = Date.now();
    let currentIndex = 0;
    
    // Function to cycle through choices
    const animateChoices = () => {
      if (Date.now() - animationStartTime < 1000) {
        // Display next choice in sequence
        setDisplayedComputerChoice(choices[currentIndex]);
        currentIndex = (currentIndex + 1) % choices.length;
        setTimeout(animateChoices, 50); // 50ms
      } else {
        // Animation complete, show actual result
        setIsAnimating(false);
        setDisplayedComputerChoice(actualComputerChoice);
        setComputerChoice(actualComputerChoice);
        
        // Determine result
        let resultText: string = "";
        let type: "win" | "lose" | "draw" = "draw";

        if (playerChoice === actualComputerChoice) {
          resultText = "Hòa 🤝";
          type = "draw";
        } else if (
          (playerChoice === "Kéo" && actualComputerChoice === "Bao") ||
          (playerChoice === "Búa" && actualComputerChoice === "Kéo") ||
          (playerChoice === "Bao" && actualComputerChoice === "Búa")
        ) {
          resultText = "Bạn Thắng! 🎉";
          type = "win";
        } else {
          resultText = "Bạn Thua! 😢";
          type = "lose";
        }

        setResult(resultText);
        setResultType(type);

        // Update history
        setHistory((prevHistory) => {
          const newHistory = [
            {
              player: playerChoice,
              computer: actualComputerChoice,
              result: resultText,
              resultType: type
            },
            ...prevHistory
          ];
          return newHistory.slice(0, 5); // 5 ván gần nhất
        });
      }
    };
    
    // Start animation cycle
    animateChoices();
  };

  
  const clearHistory = () => {
    setHistory([]);
  };

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      setLastKeyPressed(key);
      
      switch (key) {
        case "1":
          playGame("Kéo");
          break;
        case "2":
          playGame("Búa");
          break;
        case "3":
          playGame("Bao");
          break;
        default:
          // ấn phím khác ko có gì xảy ra
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    result,
    playerChoice,
    computerChoice,
    displayedComputerChoice,
    isAnimating,
    resultType,
    history,
    lastKeyPressed,
    playGame,
    clearHistory
  };
};
