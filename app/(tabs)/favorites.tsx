// 즐겨찾기 탭: 별표한 어류만 모아서 보여줍니다.
import { useRouter } from 'expo-router';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/context/favorites';
import { FISH_LIST, Fish } from '@/data/fish';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds } = useFavorites();

  // 전체 어류 중에서 즐겨찾기 목록에 id가 들어있는 것만 골라냅니다.
  const favoriteFish = FISH_LIST.filter((fish) => favoriteIds.includes(fish.id));

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
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>⭐ 즐겨찾기</Text>
      <FlatList
        data={favoriteFish}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            아직 즐겨찾기한 어류가 없어요.{'\n'}도감에서 어류를 열고 별표(☆)를 눌러보세요!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
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
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 14,
  },
  cardText: {
    flex: 1,
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
  chevron: {
    fontSize: 24,
    color: '#bbb',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
});
