import { useState, useEffect, useRef } from 'react'
import css from './index.module.scss'

const FallingElements = () => {
  const [isFalling, setIsFalling] = useState(false)
  const originalElementsRef = useRef(new Map())
  const animationFrameRef = useRef(null)

  const startFalling = () => {
    // Сохраняем оригинальные позиции элементов перед началом анимации
    saveOriginalPositions()
    setIsFalling(true)
  }

  const resetElements = () => {
    setIsFalling(false)

    // Восстанавливаем оригинальные позиции и стили
    originalElementsRef.current.forEach((original, element) => {
      if (element && original) {
        element.style.transform = ''
        element.style.position = ''
        element.style.top = ''
        element.style.left = ''
        element.style.transition = ''
        element.style.zIndex = ''
      }
    })

    // Останавливаем анимацию
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const saveOriginalPositions = () => {
    const allElements = document.querySelectorAll('*:not(script):not(style):not(meta):not(link)')

    allElements.forEach((element) => {
      if (element && element.getBoundingClientRect) {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)

        // Сохраняем только видимые элементы с размерами
        if (rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden') {
          originalElementsRef.current.set(element, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            position: styles.position,
            transform: styles.transform,
            transition: styles.transition,
          })
        }
      }
    })
  }

  useEffect(() => {
    if (!isFalling) return

    const elements = Array.from(originalElementsRef.current.keys())
    const physicsData = new Map()

    // Инициализируем физические параметры для каждого элемента
    elements.forEach((element) => {
      if (element) {
        const original = originalElementsRef.current.get(element)

        physicsData.set(element, {
          velocityY: 0,
          gravity: 0.5, // Постоянная сила гравитации
          isResting: false,
        })

        // Устанавливаем начальные стили для падения
        element.style.position = 'fixed'
        element.style.top = `${original.top}px`
        element.style.left = `${original.left}px`
        element.style.transition = 'none'
        element.style.zIndex = '1000'
      }
    })

    const animate = () => {
      const windowHeight = window.innerHeight
      let allResting = true

      elements.forEach((element) => {
        if (!element) return

        const physics = physicsData.get(element)
        const original = originalElementsRef.current.get(element)

        if (physics.isResting) return

        // Обновляем физику - просто увеличиваем скорость падения
        physics.velocityY += physics.gravity

        const currentTop = parseFloat(element.style.top) || original.top
        const newTop = currentTop + physics.velocityY
        const elementHeight = original.height

        // Проверяем столкновение с "землей" (низ экрана)
        if (newTop + elementHeight >= windowHeight) {
          // Элемент достиг земли - останавливаем его
          const groundPosition = windowHeight - elementHeight
          element.style.top = `${groundPosition}px`
          physics.isResting = true
        } else {
          // Продолжаем падение
          element.style.top = `${newTop}px`
          allResting = false
        }
      })

      // Продолжаем анимацию, если не все элементы успокоились
      if (!allResting) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isFalling])

  return (
    <div className={css.fallingcontrols}>
      <button onClick={startFalling} className={css.fallbutton} disabled={isFalling}>
        💥
      </button>
    </div>
  )
}

export default FallingElements
