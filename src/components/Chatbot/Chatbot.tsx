import React, { useState, useEffect, useRef } from 'react'
import { Button, TextInput, Spinner } from 'flowbite-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import { TbMessageChatbot } from 'react-icons/tb'
import image from '../../assets/image.png'

import axios from 'axios'

interface Message {
  role: 'user' | 'model'
  text: string
  timestamp: number
}

const GeminiChatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Initialize Gemini AI
  const [chatSession, setChatSession] = useState<any>(null)

  // Fetch services and drugs from API
  const fetchData = async () => {
    try {
      const [servicesResponse, drugsResponse, doctorsResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/dichvukham/'),
        axios.get('http://localhost:4000/api/thuoc/'),
        axios.get('http://localhost:4000/api/bacsi/')
      ])

      const drugs = drugsResponse.data.map((drug: any) => `${drug.ten} (${drug.dang}): ${drug.giaca} VNĐ`).join('\n')
      const services = servicesResponse.data
        .map((service: any) => `${service.ten} - Giá ${service.giaca} VNĐ: ${service.mota}`)
        .join('\n')
      const doctors = doctorsResponse.data
        .map((doctor: any) => `Tên ${doctor.hoten} - Chuyên khoa ${doctor.chuyenkhoa} - Bằng cấp ${doctor.bangcap}`)
        .join('\n')

      return { drugs, services, doctors }
    } catch (error) {
      return {
        drugs: 'Không thể tải dữ liệu thuốc.',
        services: 'Không thể tải dữ liệu dịch vụ.',
        doctors: 'Không thể tải dữ liệu bác sĩ'
      }
    }
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Initialize Gemini AI on component mount
  useEffect(() => {
    const initializeGemini = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) {
          console.error('Gemini API key not found')
          return
        }

        const { drugs, services, doctors } = await fetchData()

        const initPrompt = `
        Bạn là nhân viên tư vấn phòng khám cho bệnh nhi (dưới 18 tuổi) với các dịch vụ khám,
        danh sách thuốc, và bác sĩ của phòng khám được cung cấp như sau:
        \nDanh sách thuốc:\n${drugs}
        \nDanh sách dịch vụ:\n${services}
        \nDanh sách bác sĩ:\n${doctors}
        Hãy trả lời các câu hỏi về để tư vấn dịch vụ và thuốc men bằng tiếng Việt.
        Lưu ý: Khi hỏi về mua bán thuốc, phải hỏi lại tuổi bệnh nhi và giới tính nếu user không cung cấp,
        và không đưa ra câu trả lời trong lúc này cho đến khi biết tuổi và giới tính.
        `

        const generativeAI = new GoogleGenerativeAI(apiKey)
        const model = generativeAI.getGenerativeModel({
          model: 'gemini-1.5-flash'
        })

        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192
        }

        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: 'model',
              parts: [
                {
                  text: `Tôi là trợ lý tư vấn của phòng khám cho các bệnh nhi.
                  Nhiệm vụ của tôi là dùng dữ liệu của phòng khám để trả lời và tư vấn cho người dùng`
                }
              ]
            },
            {
              role: 'user',
              parts: [{ text: initPrompt }]
            }
          ]
        })

        setChatSession(chatSession)
      } catch (error) {
        console.error('Failed to initialize Gemini AI', error)
      }
    }

    initializeGemini()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatSession) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      text: inputMessage,
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Send message to Gemini
      const result = await chatSession.sendMessage(inputMessage)
      const modelResponse = result.response.text()

      // Add model response
      const modelMessage: Message = {
        role: 'model',
        text: modelResponse,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, modelMessage])
    } catch (error) {
      console.error('Error sending message', error)
      const errorMessage: Message = {
        role: 'model',
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {/* Chatbot Window */}
      {isChatOpen && (
        <div className='w-full sm:w-96 h-[500px] bg-white border rounded-lg shadow-lg flex flex-col'>
          <div className='bg-green-500 text-white p-3 flex justify-between items-center rounded-t-lg'>
            <img src={image} alt='doctor' className='w-10 h-10 object-contain rounded-full' />
            <h3 className='font-semibold'>Chatbot Phòng khám</h3>
            <Button size='xs' color='light' onClick={toggleChat}>
              ✕
            </Button>
          </div>

          {/* Chat Messages Area */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.role === 'user' ? 'bg-green-100 self-end ml-auto' : 'bg-gray-100 self-start mr-auto'
                }`}
              >
                {/* Render nội dung Markdown */}
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-center'>
                <Spinner />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className='p-3 border-t flex'>
            <TextInput
              type='text'
              placeholder='Nhập câu hỏi về y tế...'
              className='flex-1 mr-2'
              value={inputMessage}
              onKeyPress={handleKeyPress}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading || !chatSession}
            />
            <Button
              size='sm'
              color='success'
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim() || !chatSession}
            >
              Gửi
            </Button>
          </div>
        </div>
      )}

      {/* Chatbot Launcher Button */}
      {!isChatOpen && (
        <Button className='fixed bottom-4 right-4 rounded-full' color='success' onClick={toggleChat}>
          <TbMessageChatbot className='m-auto text-2xl' />
        </Button>
      )}
    </div>
  )
}

export default GeminiChatbot
