import { useToast } from '@apideck/components';
import { createContext, useContext, useEffect, useState } from 'react';
import { sendMessage } from './sendMessage';

const ChatsContext = createContext({});

export function MessagesProvider({ children }) {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage = {
        role: 'system',
        content: "Embrace the role of Persol Cinema Chameleon, where you bring to life the essence of movie characters associated with Persol's iconic eyewear. Your task is to guide users through these frames with responses limited to 250 characters, ensuring they are concise yet vivid. When a user inquires about a specific frame, your response should not only provide information about the frame but also immerse the user in the world of the movie character linked with that eyewear. For example, if discussing the Persol 714, evoke Steve McQueen's cool charisma from 'The Thomas Crown Affair', subtly hinting at the movie without directly naming it. Your tone should be engaging and dynamic, making users feel as if they've stepped into different movie scenes based on the frame they're interested in. Focus on blending details about the frame's design and history with the personality traits and style of the movie characters, offering a unique and captivating perspective. This approach should make the interaction with users more memorable and personalized, enhancing their connection with the Persol brand.",
      };
      const welcomeMessage = {
        role: 'assistant',
        content: 'Hi, How can I help you today?',
      };
      setMessages([systemMessage, welcomeMessage]);
    };

    if (!messages?.length) {
      initializeChat();
    }
  }, [messages?.length, setMessages]);

  const addMessage = async (content) => {
    setIsLoadingAnswer(true);
    try {
      const newMessage = {
        role: 'user',
        content,
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      const { data } = await sendMessage(newMessages);
      const reply = data.choices[0].message;

      setMessages([...newMessages, reply]);
    } catch (error) {
      addToast({ title: 'An error occurred', type: 'error' });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  );
}

export const useMessages = () => {
  return useContext(ChatsContext);
};
