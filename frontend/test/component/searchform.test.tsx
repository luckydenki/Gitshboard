import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SearchForm from '../../app/components/page/home/SearchForm';

describe('SearchForm', () => {
  let container: HTMLDivElement;
  let root: Root;

  //beforeEach는 각 테스트 케이스가 실행하기 전에 실행되는 함수.
  //이 안에서는 테스트 환경을 설정하는 작업을 수행합니다 : root.render()를 사용하여 React 컴포넌트를 렌더링할 수 있는 root를 생성합니다.
  beforeEach(() => {
    vi.useFakeTimers(); 
    //useFakeTimers를 사용하여 setTimeout, setInterval 등을 가짜 타이머로 대체합니다. 
    //이를 통해 테스트에서 시간 관련 동작을 제어할 수 있습니다.

    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    // stubGlobal을 사용하여 전역 변수를 설정합니다.

    container = document.createElement('div');
    // 테스트를 위한 DOM 컨테이너를 생성합니다.

    document.body.appendChild(container);
    // 생성한 컨테이너를 document.body에 추가합니다.

    root = createRoot(container);
    // createRoot를 사용하여 React 18의 새로운 root API를 사용하여 
    // 컨테이너에 React 컴포넌트를 렌더링할 수 있는 root를 생성합니다.
  });


  //afterEach는 각 테스트 케이스가 실행한 후에 실행되는 함수.
  //이 안에서는 테스트 환경을 정리하는 작업을 수행합니다.
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });



  it('입력 후 디바운스 시간이 지나면 자동완성 목록을 표시한다', async () => {

    //fn()은 Vitest에서 제공하는 함수로, 테스트에서 모의(mock) 함수를 생성할 때 사용됩니다.
    //mockResolvedValue()는 모의 함수가 호출될 때 반환할 값을 설정하는 메서드입니다.
    //fetchMock은 fetch 함수의 동작을 모의(mock)로 대체하기 위해 사용됩니다.
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: { 
          total_count: 2,
          incomplete_results: false,
          items: [
            {
              login: 'octocat',
              id: 1,
              avatar_url: 'https://github.com/octocat.png',
              html_url: 'https://github.com/octocat',
              type: 'User',
            },
            {
              login: 'octodog',
              id: 2,
              avatar_url: 'https://github.com/octodog.png',
              html_url: 'https://github.com/octodog',
              type: 'User',
            },
          ],
        },
      }),
    });

    
    vi.stubGlobal('fetch', fetchMock);

    //act()는 React의 테스트 유틸리티 함수로, 컴포넌트의 상태 업데이트나 렌더링과 관련된 작업을 수행할 때 사용됩니다.
    //이 때 MemoryRouter는 React Router의 라우팅 기능을 테스트 환경에서 사용할 수 있도록 해주는 컴포넌트입니다.
    //이게 없다면 SearchForm 컴포넌트에서 useNavigate 훅을 사용할 때 에러가 발생합니다. 
    // (navigate는 라우터 컨텍스트가 필요하기 때문)
    await act(async () => {
      root.render(
        <MemoryRouter>
          <SearchForm />
        </MemoryRouter>,
      );
    });

    const input = container.querySelector<HTMLInputElement>(
      '[aria-label="Search for github users input field"]',
    );
    if (!input) {
      throw new Error('검색어 입력창을 찾을 수 없습니다.');
    }


    await act(async () => {
      input.focus();

      const setValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set;
      // Object.getOwnPropertyDescriptor를 사용하여 HTMLInputElement의 value 속성에 대한 setter를 가져옵니다.
      //getOwnPropertyDescriptor는 객체의 속성에 대한 설명자를 반환하는 메서드입니다.

      setValue?.call(input, 'octo');

      input.dispatchEvent(new Event('input', { bubbles: true }));
      //dispatchEvent를 사용하여 input 이벤트를 수동으로 발생시킵니다.

      await vi.advanceTimersByTimeAsync(1500);
      //advanceTimersByTimeAsync를 사용하여 가짜 타이머를 1500ms(1.5초)만큼 진행시킵니다.
    });

    expect(fetchMock).toHaveBeenCalledOnce(); 
    //toHaveBeenCalledOnce()는 인자로 넣은 함수가 정확히 한 번 호출되었는지 확인하는 Jest/Vitest의 matcher입니다.
    //여기선 fetchMock이 정확히 한 번 호출되었는지 확인합니다.

    expect(container.textContent).toContain('octocat');
    //toContain()는 인자로 넣은 문자열이 실제 값에 포함되어 있는지 확인하는 Jest/Vitest의 matcher입니다.

    expect(container.textContent).toContain('octodog');
    //여기선 container.textContent에 'octocat'과 'octodog'이 포함되어 있는지 확인합니다.
  });
});
