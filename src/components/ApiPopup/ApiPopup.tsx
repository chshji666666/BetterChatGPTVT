import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import { useTranslation, Trans } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import CrossIcon from '@icon/CrossIcon';

const ApiPopup = () => {
  const { t } = useTranslation(['main', 'api']);

  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const firstVisit = useStore((state) => state.firstVisit);
  const setFirstVisit = useStore((state) => state.setFirstVisit);

  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(firstVisit);
  const [error, setError] = useState<string>('');

  const handleConfirm = () => {
      if ((_apiKey.length === 0)) {
      setError(t('noApiKeyWarning', { ns: 'api' }) as string);
    } else {
      setError('');
      setApiKey(_apiKey);
      setIsModalOpen(false);
    }
    };



 /*   const handlepromptcankey = async () => {
        const inputElement = document.getElementById("inputpromptkey");
        const inputValueX = inputElement.value;
        console.log(inputValueX);
        console.log("inputValueX");
        const apiUrl = "https://hn216.api.yesapi.cn/?s=SVIP.Svantoo2014_MyApi.APromptcankey&return_data=0&app_key=660D1DD124DC1EF00F3EC3B8344333D3&sign=2AD0290B255FA5AE2967E8727E314CC5&Promptcankey=";
        const apiurlt = apiUrl + inputValueX;
        console.log(apiurlt);
        const response = await fetch(apiurlt);
        const userData = await response.json();
        const promptcankey = userData.data.Promptcankey;
        const usecount = userData.data.Promptcankey.usecount;
        console.log(usecount);
        if ((promptcankey != false) && (usecount > 0)) {
            alert("验证成功,请使用")
        }
        else {
            if (usecount <= 0) {
                alert("次数已用完")
            }
            else {
                alert("key 不存在")
            }

        }

    }; */

  useEffect(() => {
    setFirstVisit(false);
  }, []);

  return isModalOpen ? (
    <PopupModal
      title='Setup your API key'
      handleConfirm={handleConfirm}
      setIsModalOpen={setIsModalOpen}
      cancelButton={false}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        <div className='flex gap-2 items-center justify-center mt-2'>
          <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            {t('apiKey.inputLabel', { ns: 'api' })}
          </div>
          <input
            type='text'
            className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            value={_apiKey}
            onChange={(e) => {
              _setApiKey(e.target.value);
            }}
          />
        </div>

        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          <Trans
            i18nKey='apiKey.howTo'
            ns='api'
            components={[
              <a
                    href='http://www.promptcan.com/product/view378.html'
                className='link'
                target='_blank'
              />,
            ]}
          />
        </div>
        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          <Trans
            i18nKey='advancedConfig'
            ns='api'
            components={[
              <a
                className='link cursor-pointer'
                onClick={() => {
                  setIsModalOpen(false);
                  document.getElementById('api-menu')?.click();
                }}
              />,
            ]}
          />
        </div>

        <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
          {t('securityMessage', { ns: 'api' })}
        </div>

        {error.length > 0 && (
          <div className='relative py-2 px-3 w-full mt-3 border rounded-md border-red-500 bg-red-500/10'>
            <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
              {error}
            </div>
            <div
              className='text-white absolute top-1 right-1 cursor-pointer'
              onClick={() => {
                setError('');
              }}
            >
              <CrossIcon />
            </div>
          </div>
        )}
      </div>
    </PopupModal>
  ) : (
    <></>
  );
};

export default ApiPopup;
