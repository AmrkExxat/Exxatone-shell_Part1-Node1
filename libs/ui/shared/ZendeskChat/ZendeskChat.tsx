'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Tooltip, Button } from '../../components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessagesQuestion } from '@fortawesome/pro-light-svg-icons';

const ZendeskChat = ({
  currentUser,
  accessToken,
  isDisabled,
  zenProduct = 'exxat_one',
  iconConfig = { size: 'lg', className: 'text-default' },
}: {
  currentUser: any;
  accessToken: string;
  isDisabled: boolean;
  zenProduct: string;
  iconConfig: any;
}): JSX.Element => {
  const { email, loggedInUser } = currentUser;

  const loggedUserName =
    (loggedInUser?.firstName ? loggedInUser?.firstName + ' ' : '') + (loggedInUser?.lastName ?? '');

  const chatToggle = () => {
    if (typeof window !== 'undefined' && (window as any).zE) {
      const zE = (window as any).zE;
      zE('webWidget', 'prefill', {
        name: {
          value: `${loggedUserName}`,
          readOnly: true,
        },
        email: {
          value: email,
          readOnly: true,
        },
      });
      zE('webWidget', 'toggle');
      zE('webWidget', 'chat:addTags', [`${zenProduct}`]);
    } else {
      console.warn('Zendesk widget is not ready yet.');
    }
  };
  useEffect(() => {
    if (!accessToken) return;

    const observer = new MutationObserver((_mutations) => {
      const iframe: any = document.getElementById('launcher');
      if (iframe) {
        applyStylesToWidget(iframe);
      }
    });

    const applyStylesToWidget = (iframe: HTMLIFrameElement) => {
      const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
      const btn = innerDoc?.getElementById('Embed')?.querySelector('button');

      if (btn) {
        btn.style.padding = '5px 10px';
        btn.style.marginTop = '20px';
        btn.style.borderRadius = '8px 0px 0px 0px';
      }
      iframe.style.margin = '0px 0px';
      iframe.style.display = 'none';
    };

    const existingScript = document.getElementById('ze-snippet');
    if (existingScript) return; // Prevent adding the script again if it already exists

    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src =
      'https://static.zdassets.com/ekr/snippet.js?key=8475bc19-5545-46e1-8c58-bbf3dde40071';
    script.async = true;
    script.onload = () => {
      if ((window as any).zE) {
        (window as any).zE('webWidget', 'updateSettings', {
          webWidget: {
            authenticate: {
              chat: {
                jwtFn: function (callback: Function) {
                  (async () => {
                    try {
                      callback(accessToken);
                    } catch (err) {
                      console.error('Failed to get Zendesk JWT token:', err);
                    }
                  })();
                },
              },
            },
            launcher: {
              suppress: true, // Suppress the default Zendesk launcher button
            },
            chat: {
              departments: {
                enabled: [''],
                select: 'ExxatOne - Chat Agents',
              },
              suppress: false,
            },
            contactForm: {
              fields: [
                {
                  id: 'description',
                  prefill: {
                    '*': '',
                  },
                },
              ],
            },
            color: {
              theme: '#3F51B5', // blue color
            },
          },
        });
      }
    };
    document.body.appendChild(script);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, [accessToken]);
  return (
    <Tooltip
      triggerElement={() => {
        return (
          <Button
            id="chat_zendesk_btn"
            className={`focus-visible:ring-primary m-0 flex min-h-[32px] items-center justify-center overflow-hidden rounded-md px-2 focus-visible:ring focus-visible:ring-2 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            variant="basic"
            aria-label="Chat"
            onClick={() => {
              if (!isDisabled) {
                chatToggle();
              }
            }}
            disabled={isDisabled}
          >
            <FontAwesomeIcon
              size={iconConfig?.size}
              icon={faMessagesQuestion}
              className={iconConfig?.className}
            />
          </Button>
        );
      }}
      tooltip={() => <div className="w-full p-2">Chat with agent</div>}
    />
  );
};

export default ZendeskChat;
