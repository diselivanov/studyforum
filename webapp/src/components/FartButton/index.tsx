import { useRef, useState, useEffect } from 'react';
import fartSound from '../../assets/sounds/fart.mp3';
import endSound from '../../assets/sounds/end.wav';
import ponosImage from '../../assets/images/ponos.png';
import dikiyImage from '../../assets/images/dikiy.jpg';
import skeletImage from '../../assets/images/skelet.gif';
import css from './index.module.scss';

// Интерфейс для объекта какашки
interface PoopEmoji {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  createdAt: number;
  lifeTime: number;
}

export const FartButton = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const endAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPonos, setShowPonos] = useState(false);
  const [showDikiy, setShowDikiy] = useState(false);
  const [showSkelet, setShowSkelet] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleText, setConsoleText] = useState<string[]>([]);
  const [poopEmojis, setPoopEmojis] = useState<PoopEmoji[]>([]);

  useEffect(() => {
    // Добавляем класс пульсации при монтировании компонента
    const button = document.querySelector(`.${css.fartButton}`);
    if (button) {
      button.classList.add(css.pulsating);
    }

    return () => {
      // Очистка при размонтировании
      if (button) {
        button.classList.remove(css.pulsating);
      }
    };
  }, []);

  // Эффект для создания и управления анимацией какашек
  useEffect(() => {
    if (!isPlaying) return;

    const createPoop = (): PoopEmoji => {
      const id = Date.now() + Math.random();
      const size = Math.random() * 30 + 20; // Размер между 20 и 50px
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight / 3 + Math.random() * 100; // Начинаем ниже экрана
      
      // Случайная траектория
      const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // Угол между 60 и 120 градусами
      const speed = Math.random() * 3 + 2; // Скорость между 2 и 5
      const vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
      const vy = -Math.sin(angle) * speed;
      
      // Вращение
      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 10;
      
      return {
        id,
        x: startX,
        y: startY,
        size,
        vx,
        vy,
        rotation,
        rotationSpeed,
        createdAt: Date.now(),
        lifeTime: Math.random() * 3000 + 4000 // Время жизни между 4 и 7 секундами
      };
    };

    const interval = setInterval(() => {
      if (isPlaying) {
        setPoopEmojis(prev => [...prev, createPoop()]);
      }
    }, 300); // Создаем новую какашку каждые 300мс

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Эффект для анимации какашек
  useEffect(() => {
    if (poopEmojis.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      const now = Date.now();
      setPoopEmojis(prev => {
        return prev
          .map(poop => {
            // Обновляем позицию
            const newX = poop.x + poop.vx;
            const newY = poop.y + poop.vy;
            const newRotation = poop.rotation + poop.rotationSpeed;
            
            // Добавляем гравитацию
            const newVy = poop.vy + 0.1;
            
            return {
              ...poop,
              x: newX,
              y: newY,
              vy: newVy,
              rotation: newRotation
            };
          })
          .filter(poop => {
            // Удаляем если время истекло или вышли за пределы экрана
            return now - poop.createdAt < poop.lifeTime && 
                   poop.y < window.innerHeight + 100;
          });
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [poopEmojis]);

  // Эффект для хакерской консоли
  useEffect(() => {
    if (!showConsole) return;

    const hackingMessages = [
      "> Initialization sequence started...",
      "> Establishing secure connection...",
      "> Bypassing firewall protection...",
      "> Decrypting security protocols...",
      "> Accessing mainframe...",
      "> Injecting payload into system kernel...",
      "> Overriding authentication...",
      "> Root access granted...",
      "> Scanning network infrastructure...",
      "> Locating target directories...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Terminating system processes...",
      "> Corrupting registry entries...",
      "> Deploying fragmentation algorithm...",
      "> Overwriting boot sector...",
      "> Initiating Windows destruction sequence...",
      "> System integrity compromised...",
      "> Finalizing destruction protocol...",
       "> Scanning network infrastructure...",
      "> Locating target directories...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Corrupting registry entries...",
      "> Deploying fragmentation algorithm...",
      "> Overwriting boot sector...",
      "> Initiating Windows destruction sequence...",
      "> System integrity compromised...",
      "> Finalizing destruction protocol...",
       "> Scanning network infrastructure...",
      "> Locating target directories...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Terminating system processes...",
      "> Corrupting registry entries...",
      "> Deploying fragmentation algorithm...",
      "> Overwriting boot sector...",
      "> Initiating Windows destruction sequence...",
      "> System integrity compromised...",
      "> Finalizing destruction protocol...",
      "> Operation completed successfully",
      "> Covering tracks...",
      "> Disconnecting from network...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Terminating system processes...",
      "> Corrupting registry entries...",
      "> Deploying fragmentation algorithm...",
      "> Overwriting boot sector...",
      "> Initiating Windows destruction sequence...",
      "> System integrity compromised...",
      "> Finalizing destruction protocol...",
      "> Operation completed successfully",
      "> Covering tracks...",
      "> Disconnecting from network...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Terminating system processes...",
      "> Corrupting registry entries...",
      "> Deploying fragmentation algorithm...",
      "> Operation completed successfully",
      "> Covering tracks...",
      "> Disconnecting from network...",
      "> Desktop scanning in progress...",
      "> Identifying critical system files...",
      "> FL Studio instance detected...",
      "> FL Studio has been successfully deleted",
      "> Terminating system processes...",
      "> Corrupting registry entries...",
      "> FL Studio instance detected...",
      "> Disconnecting from network...",
      "> All traces erased successfully"
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < hackingMessages.length) {
        setConsoleText(prev => [...prev, hackingMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [showConsole]);

  const playFart = () => {
    if (audioRef.current && endAudioRef.current) {
      setIsPlaying(true);
      setShowPonos(true);
      setShowSkelet(true); // Показываем скелет
      setShowDikiy(false);
      setShowConsole(true);
      setConsoleText([]);
      setPoopEmojis([]); // Очищаем предыдущие какашки

      // Проигрываем fart звук один раз
      audioRef.current!.src = fartSound;
      audioRef.current!.play()
        .then(() => {
          audioRef.current!.onended = () => {
            // После окончания fart звука проигрываем end звук
            endAudioRef.current!.src = endSound;
            endAudioRef.current!.play()
              .then(() => {
                endAudioRef.current!.onended = () => {
                  setIsPlaying(false);
                  setShowPonos(false);
                  setShowSkelet(false); // Скрываем скелет
                  setShowDikiy(true);
                  
                  // Через 3 секунды скрываем изображение dikiy и консоль
                  setTimeout(() => {
                    setShowDikiy(false);
                    setShowConsole(false);
                  }, 3000);
                };
              })
              .catch((error: Error) => {
                console.error('Ошибка воспроизведения end.wav:', error);
                setIsPlaying(false);
                setShowPonos(false);
                setShowSkelet(false);
                setShowConsole(false);
              });
          };
        })
        .catch((error: Error) => {
          console.error('Ошибка воспроизведения fart.mp3:', error);
          setIsPlaying(false);
          setShowPonos(false);
          setShowSkelet(false);
          setShowConsole(false);
        });
    }
  };

  return (
    <>
      {/* Фоновое изображение ponos (прозрачное на 50%) */}
      {showPonos && (
        <div 
          className={css.backgroundImage}
          style={{
            backgroundImage: `url(${ponosImage})`,
            opacity: 0.8
          }}
        />
      )}
      
      {/* Изображение dikiy с анимацией bounce */}
      {showDikiy && (
        <div className={css.dikiyContainer}>
          <img 
            src={dikiyImage} 
            alt="Dikiy" 
            className={css.dikiyImage}
          />
        </div>
      )}
      
      {/* Изображение skelet в правом верхнем углу */}
      {showSkelet && (
        <div className={css.skeletContainer}>
          <img 
            src={skeletImage} 
            alt="Skelet" 
            className={css.skeletImage}
          />
        </div>
      )}
      
      {/* Хакерская консоль */}
      {showConsole && (
        <div className={css.hackerConsole}>
          <div className={css.consoleHeader}>
            <div className={css.consoleButtons}>
              <span className={css.closeButton}></span>
              <span className={css.minimizeButton}></span>
              <span className={css.expandButton}></span>
            </div>
            <span className={css.consoleTitle}>root@hacker:~</span>
          </div>
          <div className={css.consoleContent}>
            {consoleText.map((text, index) => (
              <div key={index} className={css.consoleLine}>
                {text}
              </div>
            ))}
            {consoleText.length > 0 && (
              <div className={css.consoleLine}>
                {"> "}
                <span className={css.blinkingCursor}>_</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Контейнер для летающих какашек */}
      <div className={css.poopContainer}>
        {poopEmojis.map(poop => (
          <div
            key={poop.id}
            className={css.poop}
            style={{
              left: `${poop.x}px`,
              top: `${poop.y}px`,
              fontSize: `${poop.size}px`,
              transform: `rotate(${poop.rotation}deg)`,
              opacity: 1 - (Date.now() - poop.createdAt) / poop.lifeTime
            }}
          >
            💩
          </div>
        ))}
      </div>
      
      <div className={css.container}>
        <button
          className={`${css.fartButton} ${isPlaying ? css.playing : ''}`}
          onClick={playFart}
          disabled={isPlaying}
          aria-label="Воспроизвести звук пердежа"
        >
          {isPlaying ? 'о дааааа 💨' : '⚡️'}
        </button>
        
        <audio
          ref={audioRef}
          preload="auto"
          style={{ display: 'none' }}
        />
        
        <audio
          ref={endAudioRef}
          preload="auto"
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
};