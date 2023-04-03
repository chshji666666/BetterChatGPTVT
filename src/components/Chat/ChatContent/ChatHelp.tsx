import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';

import TickIcon from '@icon/TickIcon';
const ShareGPT = React.memo(() => {

    return (
        <>
            <button
                className='btn btn-neutral'
                onClick={() => {
                    window.open('http://www.promptcan.com/help/view10.html', '_blank');
                }}
            >
                {t('使用帮助')}
            </button>
        </>
    );
});

export default ChatHelp;
