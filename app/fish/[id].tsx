// 어류 상세 화면.
// 파일 이름이 [id].tsx 인 것이 포인트! expo-router의 "동적 라우트"로,
// /fish/1, /fish/2 ... 처럼 어떤 id로 접근해도 이 화면 하나가 처리합니다.
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/context/favorites';
import { FISH_LIST } from '@/data/fish';

export default function FishDetailScreen() {
  // 주소의 [id] 부분 값을 꺼냅니다. /fish/3 으로 왔다면 id === '3'
  const { id } = useLocalSearchParams<{ id: string }>();

  // 즐겨찾기 통로에서 필요한 것만 꺼냅니다.
  const { isFavorite, toggleFavorite } = useFavorites();

  const fish = FISH_LIST.find((f) => f.id === id);

  if (!fish) {
    return (
      <View style={styles.center}>
        <Text>어류를 찾을 수 없어요 🥲</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 화면 상단 헤더의 제목을 어류 이름으로 설정.
          headerRight: 헤더 오른쪽에 별표 버튼을 넣습니다. 누르면 즐겨찾기 토글. */}
      <Stack.Screen
        options={{
          title: fish.name,
          headerBackTitle: '도감',
          headerRight: () => (
            <Pressable onPress={() => toggleFavorite(fish.id)} hitSlop={12}>
              <Text style={styles.headerStar}>{isFavorite(fish.id) ? '⭐' : '☆'}</Text>
            </Pressable>
          ),
        }}
      />

      {fish.image ? (
        <Image source={fish.image} style={styles.photo} />
      ) : (
        <Text style={styles.emoji}>{fish.emoji}</Text>
      )}
      <Text style={styles.name}>{fish.name}</Text>
      <Text style={styles.scientificName}>{fish.scientificName}</Text>

      <View style={styles.infoBox}>
        <InfoRow label="서식지" value={fish.habitat} />
        <InfoRow label="크기" value={fish.size} />
      </View>

      <Text style={styles.description}>{fish.description}</Text>
    </ScrollView>
  );
}

// 같은 모양이 반복될 때는 이렇게 작은 컴포넌트로 뽑아냅니다. React의 기본기!
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7fa',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStar: {
    fontSize: 22,
  },
  emoji: {
    fontSize: 80,
    marginTop: 12,
  },
  photo: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginTop: 12,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 12,
  },
  scientificName: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoLabel: {
    width: 70,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    marginTop: 24,
  },
});
