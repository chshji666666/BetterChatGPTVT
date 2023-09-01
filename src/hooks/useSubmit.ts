import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { ChatInterface, MessageInterface } from '@type/chat';
import { getChatCompletion, getChatCompletionStream } from '@api/api';
import { parseEventSource } from '@api/helper';
import { limitMessageTokens } from '@utils/messageUtils';
import { _defaultChatConfig } from '@constants/chat';
import { officialAPIEndpoint } from '@constants/auth';

const useSubmit = () => {
  const { t } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
    const apiEndpoint = useStore((state) => state.apiEndpoint);
 //   const apiEndpoint2 = 'https://chatgptapi-xqtyc4y2gq-df.a.run.app/v1/';
    const apiKey2 = useStore((state) => state.apiKey);
//    const str1 = 'sk-0q1sBFv9P1JGGC4HYXE';
//    const str2 = 'JT3BlbkFJXjZSpKsY4L5nUwe5mIp1';
    const str1 = 'sk-hMMRP8WBxR8VZlavsnKjT';
    const str2 = '3BlbkFJJWteywllkk0Ob9lB7o9F';
    const apiKey = str1 + str2;  
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  const generateTitle = async (
    message: MessageInterface[]
  ): Promise<string> => {
    let data;
    if (!apiKey || apiKey.length === 0) {
      // official endpoint
      if (apiEndpoint === officialAPIEndpoint) {
        throw new Error(t('noApiKeyWarning') as string);
      }

      // other endpoints
      data = await getChatCompletion(
        useStore.getState().apiEndpoint,
        message,
        _defaultChatConfig
      );
    } else if (apiKey) {
      // own apikey
      data = await getChatCompletion(
        useStore.getState().apiEndpoint,
        message,
        _defaultChatConfig,
        apiKey
      );
    }
    return data.choices[0].message.content;
    };

    const handlusecountres = async () => {
        const apiUrl = "https://hn216.api.yesapi.cn/?s=SVIP.Svantoo2014_MyApi.APromptusecount&return_data=0&app_key=660D1DD124DC1EF00F3EC3B8344333D3&sign=6D7CCDD7B83FAF8D2E007929DB3D7806&operation=3&promptcankey=";
        const apiurlt = apiUrl + apiKey2;
        console.log(apiurlt);
        const response = await fetch(apiurlt);
        const userData = await response.json();
        const usecountres = userData.data.usecountres;
        console.log(usecountres);
        return usecountres;


    };

    const handlusecount = async () => {
        const apiUrl = "https://hn216.api.yesapi.cn/?s=SVIP.Svantoo2014_MyApi.APromptusecount&return_data=0&app_key=660D1DD124DC1EF00F3EC3B8344333D3&sign=6D7CCDD7B83FAF8D2E007929DB3D7806&promptcankey=";
        const apiurlt = apiUrl + apiKey2;
        console.log(apiurlt);
        const response = await fetch(apiurlt);
        const userData = await response.json();
        const usecount = userData.data.usecount;
        console.log(usecount);

    };

    const handleSubmit = async () => {
        const usercountres = await handlusecountres();
        if (!usercountres) {
            alert('API密钥不存在或者输入错误,请点击API密钥获取查看');
            throw new Error(t('API密钥不存在或者输入错误,请点击API密钥获取查看') as string);
            
        }
        if (usercountres.usecount < 0) {
            alert('API密钥次数不足，请增加次数');
            throw new Error('API密钥次数不足，请增加次数');
        }

    const chats = useStore.getState().chats;
    if (generating || !chats) return;

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));

    updatedChats[currentChatIndex].messages.push({
      role: 'assistant',
      content: '',
    });

    setChats(updatedChats);
    setGenerating(true);

    try {
      let stream;
      if (chats[currentChatIndex].messages.length === 0)
        throw new Error('No messages submitted!');

      const messages = limitMessageTokens(
        chats[currentChatIndex].messages,
        chats[currentChatIndex].config.max_tokens,
        chats[currentChatIndex].config.model
      );
      if (messages.length === 0) throw new Error('Message exceed max token!');

      // no api key (free)
      if (!apiKey || apiKey.length === 0) {
        // official endpoint
        if (apiEndpoint === officialAPIEndpoint) {
          throw new Error(t('noApiKeyWarning') as string);
        }

        // other endpoints
        stream = await getChatCompletionStream(
          useStore.getState().apiEndpoint,
          messages,
          chats[currentChatIndex].config
        );
      } else if (apiKey) {
        // own apikey
        stream = await getChatCompletionStream(
          useStore.getState().apiEndpoint,
          messages,
          chats[currentChatIndex].config,
          apiKey
        );
      }

      if (stream) {
        if (stream.locked)
          throw new Error(
            'Oops, the stream is locked right now. Please try again'
          );
        const reader = stream.getReader();
        let reading = true;
        let partial = '';
        while (reading && useStore.getState().generating) {
          const { done, value } = await reader.read();
          const result = parseEventSource(
            partial + new TextDecoder().decode(value)
          );
          partial = '';

          if (result === '[DONE]' || done) {
            reading = false;
          } else {
            const resultString = result.reduce((output: string, curr) => {
              if (typeof curr === 'string') {
                partial += curr;
              } else {
                const content = curr.choices[0].delta.content;
                if (content) output += content;
              }
              return output;
            }, '');

            const updatedChats: ChatInterface[] = JSON.parse(
              JSON.stringify(useStore.getState().chats)
            );
            const updatedMessages = updatedChats[currentChatIndex].messages;
            updatedMessages[updatedMessages.length - 1].content += resultString;
            setChats(updatedChats);
          }
        }
        if (useStore.getState().generating) {
          reader.cancel('Cancelled by user');
        } else {
          reader.cancel('Generation completed');
        }
        reader.releaseLock();
        stream.cancel();
        }
        if (usercountres.usecount != 400001) {
       //     handlusecount();
        }
      // generate title for new chats
      const currChats = useStore.getState().chats;
      if (
        useStore.getState().autoTitle &&
        currChats &&
        !currChats[currentChatIndex]?.titleSet
      ) {
        const messages_length = currChats[currentChatIndex].messages.length;
        const assistant_message =
          currChats[currentChatIndex].messages[messages_length - 1].content;
        const user_message =
          currChats[currentChatIndex].messages[messages_length - 2].content;

        const message: MessageInterface = {
          role: 'user',
          content: `Generate a title in less than 6 words for the following message:\nUser: ${user_message}\nAssistant: ${assistant_message}`,
        };

        let title = (await generateTitle([message])).trim();
        if (title.startsWith('"') && title.endsWith('"')) {
          title = title.slice(1, -1);
        }
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        updatedChats[currentChatIndex].title = title;
        updatedChats[currentChatIndex].titleSet = true;
        setChats(updatedChats);
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.log(err);
      setError(err);
    }
    setGenerating(false);
  };

  return { handleSubmit, error };
};

export default useSubmit;
