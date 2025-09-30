import { useState, useRef, useEffect } from 'react'
import css from './index.module.scss'
import FallingElements from '../FallingElements'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const predefinedResponses = {
    'о сайте': 'Это современный веб-сайт с инновационными решениями.',
    правила:
      '1. Будьте вежливы\n2. Соблюдайте правила сообщества\n3. Не распространяйте спам\n4. Уважайте других пользователей',
    'обратная связь': 'feedback',
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text, isBot = false) => {
    setMessages((prev) => [...prev, { text, isBot, id: Date.now() }])
  }

  const simulateTyping = (response, delay = 2000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage(response, true)
    }, delay)
  }

  const handleBadgeClick = (badgeType) => {
    addMessage(badgeType, false)

    if (badgeType === 'обратная связь') {
      simulateTyping('Пожалуйста, введите ваше сообщение обратной связи:')
    } else {
      simulateTyping(predefinedResponses[badgeType])
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, false)
    setInputValue('')

    // Проверяем, является ли сообщение ответом на запрос обратной связи
    const lastBotMessage = messages.filter((msg) => msg.isBot).pop()

    if (lastBotMessage?.text === 'Пожалуйста, введите ваше сообщение обратной связи:') {
      simulateTyping('Ваше обращение отправлено! Спасибо за обратную связь.', 800)
    } else {
      simulateTyping('Неизвестная команда. Пожалуйста, выберите вариант из списка ниже.', 600)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleChatToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      simulateTyping('Добро пожаловать! Чем могу помочь?', 500)
    }
  }

  return (
    <div className={css.chatbotContainer}>
      {/* Чат окно */}
      {isOpen && (
        <div className={css.chatWindow}>
          <div className={css.chatHeader}>
            <h3 className={css.chatTitle}>Чат-бот</h3>
            <button className={css.closeButton} onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className={css.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} className={`${css.message} ${message.isBot ? css.botMessage : css.userMessage}`}>
                <div className={css.messageContent}>
                  {message.text.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${css.message} ${css.botMessage}`}>
                <div className={css.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={css.badgesContainer}>
            <button className={css.badge} onClick={() => handleBadgeClick('о сайте')}>
              О сайте
            </button>
            <button className={css.badge} onClick={() => handleBadgeClick('правила')}>
              Правила
            </button>
            <button className={css.badge} onClick={() => handleBadgeClick('обратная связь')}>
              Обратная связь
            </button>
            <FallingElements />
          </div>

          <div className={css.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className={css.messageInput}
            />
            <button onClick={handleSendMessage} disabled={!inputValue.trim()} className={css.sendButton}>
              ↗
            </button>
          </div>
        </div>
      )}

      {/* Кнопка чата */}
      <button className={css.chatToggle} onClick={handleChatToggle}>
        {isOpen ? '×' : '🤖'}
      </button>
    </div>
  )
}

export default ChatBot
