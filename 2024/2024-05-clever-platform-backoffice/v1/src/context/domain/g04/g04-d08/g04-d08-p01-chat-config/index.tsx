import { useCallback, useEffect, useState, useMemo } from 'react';
import { Curriculum } from '../local/type';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButtonSwitch from '../local/components/web/organism/SwitchToggle';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { IChatConfig } from '@domain/g04/g04-d05/local/type';

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const [useChatConfigData, setChatConfigData] = useState<IChatConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMockData = async () => {
    try {
      const res = await API.chatConfig.GetG04D08A01({
        page: '1',
        limit: '10',
      });
      if (res.status_code === 200) {
        setChatConfigData(res.data);
      }
    } catch (error) {
      showMessage(`Failed to fetch chat config: ${error}`, 'error');
    }
  };

  const checkIsStatusActive = (
    chatConfig: IChatConfig[],
    chatLevel: 'subject' | 'class' | 'group' | 'private',
  ): boolean => {
    if (!chatConfig) return false;
    const chatItem = chatConfig.find((item) => item.chat_level === chatLevel);
    return chatItem ? chatItem.status : false;
  };

  useEffect(() => {
    if (useChatConfigData.length === 0) {
      fetchMockData();
    }
  }, [useChatConfigData]);

  const onClickToggle = useCallback(
    async (chatLevel: 'subject' | 'class' | 'group' | 'private', value: boolean) => {
      if (!isLoading) {
        try {
          const res = await API.chatConfig.PatchG04D08A02({
            chat_level: chatLevel,
            status: value,
          });
          if (res.status_code === 200) {
            fetchMockData();
            showMessage('บันทึกสำเร็จ', 'success');
          }
          setIsLoading(false);
        } catch (error) {
          showMessage(`Failed to fetch chat config: ${error}`, 'error');
        }
      }
    },
    [isLoading],
  );

  const memoizedSwitches = useMemo(() => {
    return (
      <>
        <div className="flex h-[40px] w-full items-center gap-2 border-b-[1px] border-[#E5E5E5] p-2 leading-5 text-[#0E1726]">
          <span className="w-full flex-1">แชทประจำวิชา</span>
          <span className="min-[100px] flex w-[100px] items-center">
            <CWButtonSwitch
              initialState={checkIsStatusActive(useChatConfigData, 'subject')}
              onChange={(value) => {
                setIsLoading(true);
                onClickToggle('subject', value);
              }}
            />
          </span>
        </div>
        <div className="flex h-[40px] w-full items-center gap-2 border-b-[1px] border-[#E5E5E5] p-2 leading-5 text-[#0E1726]">
          <span className="w-full flex-1">แชทประจำชั้น</span>
          <span className="min-[100px] flex w-[100px] items-center">
            <CWButtonSwitch
              initialState={checkIsStatusActive(useChatConfigData, 'class')}
              onChange={(value) => {
                setIsLoading(true);
                onClickToggle('class', value);
              }}
            />
          </span>
        </div>
        <div className="flex h-[40px] w-full items-center gap-2 border-b-[1px] border-[#E5E5E5] p-2 leading-5 text-[#0E1726]">
          <span className="w-full flex-1">แชทประจำกลุ่มเรียน</span>
          <span className="min-[100px] flex w-[100px] items-center">
            <CWButtonSwitch
              initialState={checkIsStatusActive(useChatConfigData, 'group')}
              onChange={(value) => {
                setIsLoading(true);
                onClickToggle('group', value);
              }}
            />
          </span>
        </div>
        <div className="flex h-[40px] w-full items-center gap-2 border-b-[1px] border-[#E5E5E5] p-2 leading-5 text-[#0E1726]">
          <span className="w-full flex-1">แชทตัวต่อตัวครู</span>
          <span className="min-[100px] flex w-[100px] items-center">
            <CWButtonSwitch
              initialState={checkIsStatusActive(useChatConfigData, 'private')}
              onChange={(value) => {
                setIsLoading(true);
                onClickToggle('private', value);
              }}
            />
          </span>
        </div>
      </>
    );
  }, [useChatConfigData, onClickToggle]);

  return (
    <div className="flex h-[602px] w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-[23px]">
        <CWBreadcrumbs
          links={[
            { label: 'การเรียนการสอน', href: '#' },
            { label: 'แชทนักเรียน', href: '#' },
          ]}
        />
        <p className="text-[24px] font-semibold leading-8 text-[#0E1726]">แชท</p>
      </div>

      <CWWhiteBox className="flex h-full flex-col p-5">
        <div className="flex h-[40px] w-full items-center gap-2 bg-[#F5F5F5] p-2 leading-5 text-[#0E1726]">
          <span className="w-full flex-1">ระดับแชท</span>
          <span className="min-[100px] flex w-[100px] items-center">เปิดใช้งาน</span>
        </div>
        {memoizedSwitches}
      </CWWhiteBox>
    </div>
  );
};

export default DomainJSX;
