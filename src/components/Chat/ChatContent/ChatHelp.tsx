import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';

import TickIcon from '@icon/TickIcon';
const ChatHelp = React.memo(() => {
    const { t } = useTranslation();
    return (
        <>
            <button
                className='btn btn-neutral'
                onClick={() => {
                    window.open('http://www.promptcan.com/help/view10.html', '_blank');
                }}
            >
                {t('API密钥获取')}
            </button>
        </>
    );
});

export default ChatHelp;
