import React, { useState } from 'react';
import { Volume2, Star, RefreshCw, Trophy } from 'lucide-react';

interface Letter {
  upper: string;
  lower: string;
  word: string;
}

const alphabet: Letter[] = [
  { upper: 'A', lower: 'a', word: 'Apple' },
  { upper: 'B', lower: 'b', word: 'Ball' },
  { upper: 'C', lower: 'c', word: 'Cat' },
  { upper: 'D', lower: 'd', word: 'Dog' },
  { upper: 'E', lower: 'e', word: 'Egg' },
  { upper: 'F', lower: 'f', word: 'Fish' },
  { upper: 'G', lower: 'g', word: 'Grape' },
  { upper: 'H', lower: 'h', word: 'Hat' },
  { upper: 'I', lower: 'i', word: 'Ice' },
  { upper: 'J', lower: 'j', word: 'Juice' },
  { upper: 'K', lower: 'k', word: 'Kite' },
  { upper: 'L', lower: 'l', word: 'Lion' },
  { upper: 'M', lower: 'm', word: 'Moon' },
  { upper: 'N', lower: 'n', word: 'Nose' },
  { upper: 'O', lower: 'o', word: 'Orange' },
  { upper: 'P', lower: 'p', word: 'Pen' },
  { upper: 'Q', lower: 'q', word: 'Queen' },
  { upper: 'R', lower: 'r', word: 'Rose' },
  { upper: 'S', lower: 's', word: 'Sun' },
  { upper: 'T', lower: 't', word: 'Tree' },
  { upper: 'U', lower: 'u', word: 'Umbrella' },
  { upper: 'V', lower: 'v', word: 'Violin' },
  { upper: 'W', lower: 'w', word: 'Water' },
  { upper: 'X', lower: 'x', word: 'Xylophone' },
  { upper: 'Y', lower: 'y', word: 'Yellow' },
  { upper: 'Z', lower: 'z', word: 'Zebra' },
];

type Mode = 'learn' | 'game';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameQuestion, setGameQuestion] = useState<Letter | null>(null);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentLetter = alphabet[currentIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev + 1) % alphabet.length);
  };

  const prevLetter = () => {
    setCurrentIndex((prev) => (prev - 1 + alphabet.length) % alphabet.length);
  };

  const startGame = () => {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    setGameQuestion(randomLetter);
    
    const wrongOptions = alphabet
      .filter(l => l.upper !== randomLetter.upper)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(l => l.lower);
    
    const allOptions = [...wrongOptions, randomLetter.lower].sort(() => Math.random() - 0.5);
    setGameOptions(allOptions);
    setShowFeedback(false);
    setFeedback('');
  };

  const checkAnswer = (selected: string) => {
    if (!gameQuestion) return;
    
    if (selected === gameQuestion.lower) {
      setFeedback('🎉 太棒了！答对了！');
      setScore(score + 1);
      speak('Correct! Well done!');
    } else {
      setFeedback(`💡 再试试！正确答案是 ${gameQuestion.lower}`);
      speak('Try again!');
    }
    
    setShowFeedback(true);
    setTimeout(() => {
      startGame();
    }, 2000);
  };

  React.useEffect(() => {
    if (mode === 'game' && !gameQuestion) {
      startGame();
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600">学习英文字母</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('learn')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  mode === 'learn'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                学习模式
              </button>
              <button
                onClick={() => setMode('game')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  mode === 'game'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                游戏模式
              </button>
            </div>
          </div>

          {mode === 'learn' ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-12 shadow-xl mb-6">
                  <div className="text-9xl font-bold text-white mb-4">
                    {currentLetter.upper}
                  </div>
                  <div className="text-7xl font-bold text-white opacity-80">
                    {currentLetter.lower}
                  </div>
                </div>
                
                <button
                  onClick={() => speak(`${currentLetter.upper}. ${currentLetter.word}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold flex items-center gap-3 mx-auto transition-all transform hover:scale-105"
                >
                  <Volume2 size={28} />
                  听发音
                </button>

                <div className="mt-6 text-3xl font-semibold text-gray-700">
                  {currentLetter.word}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={prevLetter}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all"
                >
                  ← 上一个
                </button>
                <button
                  onClick={nextLetter}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all"
                >
                  下一个 →
                </button>
              </div>

              <div className="grid grid-cols-13 gap-2 max-w-3xl mx-auto">
                {alphabet.map((letter, idx) => (
                  <button
                    key={letter.upper}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-2 rounded-lg font-bold text-lg transition-all ${
                      idx === currentIndex
                        ? 'bg-purple-500 text-white scale-110'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {letter.upper}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 bg-yellow-100 px-6 py-3 rounded-full">
                  <Trophy className="text-yellow-600" size={32} />
                  <span className="text-3xl font-bold text-yellow-700">{score}</span>
                </div>
                <button
                  onClick={() => setScore(0)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
                >
                  重新开始
                </button>
              </div>

              {gameQuestion && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-700 mb-6">
                    找出 <span className="text-purple-600 text-5xl">{gameQuestion.upper}</span> 的小写字母
                  </h2>

                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-6">
                    {gameOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !showFeedback && checkAnswer(option)}
                        disabled={showFeedback}
                        className="bg-gradient-to-br from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white text-6xl font-bold p-12 rounded-3xl shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showFeedback && (
                    <div
                      className={`text-center p-6 rounded-2xl text-2xl font-bold ${
                        feedback.includes('太棒了')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-lg">
            💡 <strong>小提示：</strong>
            {mode === 'learn'
              ? '点击字母卡片可以切换，点击"听发音"按钮可以听字母的读音！'
              : '找出大写字母对应的小写字母，答对得分！'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
