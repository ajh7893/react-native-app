// 본적이 있는지 없는지를 나타  내는 Context를 만든다. (즐겨찾기와 비슷한 개념)

// 구조: Context(통로) 만들기 -> Provider(데이터 보관소)로 앱을 감싸기 ->
// 화면에서 useSeen()으로 꺼내쓴다.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useState}  from 'react';

// 이 context가 화면들에게 제공할 것들의 모양(타입).
type SeenContextValue = {
    seenIds: string[]; //본 어류 id 목록
    isSeen: (id: string) => boolean; //특정 어류가 본것인지 확인
    toggleSeen: (id: string) => void; // 봣다 켯다 하기
}

const STORAGE_KEY = 'seen';

const SeenContext = createContext<SeenContextValue | undefined>(undefined);

export function SeenProvider({children}: {children: React.ReactNode}){
    const [seenIds, setSeenIds] = useState<string[]>([]);

    // 앱이 처음 켜질 때, 폰에 저장대 있던 즐겨찾기를 불러온다.
    useEffect(() =>{
        AsyncStorage.getItem(STORAGE_KEY).then((saved) =>{
            if(saved){
                // 저장은 문자열로만 되기 때문에, JSON 문자열 -> 배열로 되될린다.
                setSeenIds(JSON.parse(saved));
            }
        });
    }, []);

    const isSeen = (id: string) => seenIds.includes(id);

    const toggleSeen = (id: string) => {
        // 이미 있으면 빼고, 없으면 더한 "새 배열"을 만든다.
        // (React에서는 기존 배열을 직접 바꾸지 않고 항상 새 배열로 교체하는 게 규칙이다)
        const next = isSeen(id)
            ? seenIds.filter((seenId) => seenId !== id)
            : [...seenIds,id];

        setSeenIds(next); // 화면 갱신
        // 바뀐 목록을 폰에 저장(문자열로 변환). 앱을 껏다 켜도 남아있게.

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    return (
        <SeenContext.Provider value ={{ seenIds, isSeen, toggleSeen}}>
            {children}
        </SeenContext.Provider>

    );

}

// 3) 각 화면에서 간편하게 꺼내 쓰기 위한 함수.
// 화면에서 const {toggleSeen} =useSeen(); 처럼 사용합니다.
export function useSeen() {
    const context = useContext(SeenContext);
    if(!context){
        // Provider로 감싸지 않은 곳에서 실수로 쓰면 알려주는 안전장치
        throw new Error('useSeen은 SeenProvider 안에서만 쓸 수 있습니다. ')
    }
    return context;
}