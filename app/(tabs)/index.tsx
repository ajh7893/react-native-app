// 도감 탭: 어류 목록을 보여주는 화면입니다.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFavorites } from '@/context/favorites';
import { useSeen } from '@/context/seen';
import { FISH_LIST, Fish } from '@/data/fish';

export default function EncyclopediaScreen() {
  // useState: React의 "상태". search 값이 바뀌면 화면이 자동으로 다시 그려집니다.
  const [search, setSearch] = useState('');

  // router: 다른 화면으로 이동할 때 사용합니다.
  const router = useRouter();

  // 즐겨찾기 여부를 목록에서 별표로 표시하기 위해 가져옵니다.
  const { isFavorite } = useFavorites();
  const { isSeen } = useSeen();

  // 검색어가 이름에 포함된 어류만 걸러냅니다.
  // search가 빈 문자열이면 includes('')는 항상 true라서 전체가 보입니다.
  const filteredFish = FISH_LIST.filter((fish) => fish.name.includes(search));

  // 목록의 한 줄(카드)을 그리는 함수입니다.
  const renderItem = ({ item }: { item: Fish }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/fish/${item.id}`)}>
      {item.image ? (
        <Image source={item.image} style={styles.thumbnail} />
      ) : (
        <Text style={styles.emoji}>{item.emoji}</Text>
      )}
      <View style={styles.cardText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.scientificName}>{item.scientificName}</Text>
      </View>
      {/* 즐겨찾기한 어류면 별표를 보여줍니다 */}
      {isFavorite(item.id) && <Text style={styles.star}>⭐</Text>}
      {isSeen(item.id) && <Text style={styles.star}> 👀</Text>}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🐟 어류 도감</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="어류 이름 검색"
        value={search}
        onChangeText={setSearch}
      />
      {/* FlatList: 긴 목록을 효율적으로 그려주는 컴포넌트. 웹의 map()과 비슷한 역할 */}
      <FlatList
        data={filteredFish}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>검색 결과가 없어요 🥲</Text>}
      />
    </SafeAreaView>
  );
}

// 스타일: 웹의 CSS와 비슷하지만 JavaScript 객체로 씁니다. (camelCase 주의: background-color → backgroundColor)
const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지
    backgroundColor: '#f0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row', // 가로 배치 (이모지 | 이름 | 화살표)
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 36,
    marginRight: 14,
  },
  thumbnail: {
    width: 72, // 가로로 긴 3:2 비율 → 물고기 사진이 덜 잘려 보입니다
    height: 48,
    borderRadius: 8,
    marginRight: 14,
  },
  cardText: {
    flex: 1, // 남는 가로 공간을 모두 차지 → 화살표가 오른쪽 끝으로 밀림
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  scientificName: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  star: {
    fontSize: 16,
    marginRight: 6,
  },
  chevron: {
    fontSize: 24,
    color: '#bbb',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
