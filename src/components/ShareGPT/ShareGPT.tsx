import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';
import { submitShareGPT } from '@api/api';
import { ShareGPTSubmitBodyInterface } from '@type/api';

const ShareGPT = React.memo(() => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = async () => {
    const chats = useStore.getState().chats;
    const currentChatIndex = useStore.getState().currentChatIndex;
    if (chats) {
      try {
        const items: ShareGPTSubmitBodyInterface['items'] = [];
        const messages = document.querySelectorAll('.share-gpt-message');

        messages.forEach((message, index) => {
          items.push({
            from: 'gpt',
            value: `<p><b>${t(
              chats[currentChatIndex].messages[index].role
            )}</b></p>${message.innerHTML}`,
          });
        });

        await submitShareGPT({
          avatarUrl: '',
          items,
        });
        setIsModalOpen(false);
      } catch (e: unknown) {
        console.log(e);
      }
    }
    };

    const handleClick = () => {
        setIsModalOpen(false);
        window.open('http://www.promptcan.com', '_blank');
    };

  return (
    <>
      <button
        className='btn btn-neutral'
        onClick={() => {
               setIsModalOpen(true);
        }}
      >
        {t('发布赚收益')}
      </button>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('发布至PromptCan') as string}
          message={t('发布你的有创意的文本提示词赚取收益') as string}
          handleConfirm={handleClick}
        />
      )}
    </>
  );
});

export default ShareGPT;
