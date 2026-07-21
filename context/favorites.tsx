// 즐겨찾기 "Context" — 여러 화면이 같은 즐겨찾기 목록을 공유하게 해주는 장치입니다.
//
// 지금까지 useState는 한 화면 안에서만 살아있었어요. 그런데 즐겨찾기는
// 상세 화면(별표 누르기), 도감 목록(별 표시), 즐겨찾기 탭(목록) 이 세 화면이
// 모두 같은 데이터를 봐야 합니다. 이럴 때 쓰는 게 Context예요.
//
// 구조: Context(통로) 만들기 → Provider(데이터 보관소)로 앱을 감싸기 →
//       각 화면에서 useFavorites()로 꺼내 쓰기
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

// 이 Context가 화면들에게 제공할 것들의 모양(타입).
type FavoritesContextValue = {
  favoriteIds: string[]; // 즐겨찾기한 어류 id 목록
  isFavorite: (id: string) => boolean; // 특정 어류가 즐겨찾기인지 확인
  toggleFavorite: (id: string) => void; // 즐겨찾기 켜고/끄기
};

// 폰 안에 저장할 때 쓸 이름표(key). 이 이름으로 저장하고 이 이름으로 꺼냅니다.
const STORAGE_KEY = 'favorites';

// 1) Context라는 "통로"를 만듭니다. 아직 데이터는 없고, 통로만.
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

// 2) Provider: 실제 데이터를 담아두고 자식 화면들에게 나눠주는 보관소.
//    이 컴포넌트로 앱 전체를 감싸면, 안쪽 어느 화면에서든 즐겨찾기에 접근할 수 있어요.
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // 앱이 처음 켜질 때, 폰에 저장돼 있던 즐겨찾기를 불러옵니다.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) {
        // 저장은 문자열로만 되기 때문에, JSON 문자열 → 배열로 되돌립니다.
        setFavoriteIds(JSON.parse(saved));
      }
    });
  }, []);

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const toggleFavorite = (id: string) => {
    // 이미 있으면 빼고, 없으면 더한 "새 배열"을 만듭니다.
    // (React에서는 기존 배열을 직접 바꾸지 않고 항상 새 배열로 교체하는 게 규칙이에요)
    const next = isFavorite(id)
      ? favoriteIds.filter((favId) => favId !== id)
      : [...favoriteIds, id];

    setFavoriteIds(next); // 화면 갱신
    // 바뀐 목록을 폰에 저장(문자열로 변환해서). 앱을 껐다 켜도 남아있게.
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 3) 각 화면에서 간편하게 꺼내 쓰기 위한 함수.
//    화면에서 const { toggleFavorite } = useFavorites(); 처럼 사용합니다.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    // Provider로 감싸지 않은 곳에서 실수로 쓰면 알려주는 안전장치.
    throw new Error('useFavorites는 FavoritesProvider 안에서만 쓸 수 있어요');
  }
  return context;
}
