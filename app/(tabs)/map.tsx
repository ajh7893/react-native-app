// 지도 탭: OBIS API에서 실제 관측 위치를 가져와 지도 위에 마커로 보여줍니다.
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { FISH_LIST } from '@/data/fish';
import { fetchObservations } from '@/lib/obis';

// 지도에 찍을 마커 한 개의 모양. 어떤 어류(fishId)의 어떤 위치인지 함께 갖고 있습니다.
type FishMarker = {
  key: string;
  fishId: string;
  name: string;
  emoji: string;
  image?: ImageSourcePropType; // 마커에 보여줄 사진 (없으면 이모지)
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const router = useRouter();

  // 마커 목록과 "지금 불러오는 중인지" 상태를 각각 관리합니다.
  const [markers, setMarkers] = useState<FishMarker[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect: "화면이 처음 나타날 때 딱 한 번 실행할 일"을 등록하는 훅.
  // 두 번째 인자 []가 빈 배열이라서 "처음 한 번만" 실행됩니다.
  useEffect(() => {
    let cancelled = false; // 화면을 벗어났는데 응답이 늦게 와서 상태를 덮어쓰는 걸 방지

    async function loadAllObservations() {
      // Promise.allSettled: 어류 10종을 동시에(병렬로) 요청합니다.
      // 하나가 실패해도 나머지 결과는 그대로 받을 수 있어요 (all과의 차이).
      const results = await Promise.allSettled(
        FISH_LIST.map((fish) => fetchObservations(fish.scientificName))
      );

      const nextMarkers: FishMarker[] = [];

      results.forEach((result, index) => {
        const fish = FISH_LIST[index];

        if (result.status === 'fulfilled') {
          result.value.forEach((obs, i) => {
            nextMarkers.push({
              key: `${fish.id}-${i}`,
              fishId: fish.id,
              name: fish.name,
              emoji: fish.emoji,
              image: fish.image,
              latitude: obs.latitude,
              longitude: obs.longitude,
            });
          });
        } else {
          // 실패한 어종은 그냥 건너뜁니다. 콘솔에만 기록.
          console.warn(`${fish.name} 관측 데이터 로드 실패:`, result.reason);
        }
      });

      if (!cancelled) {
        setMarkers(nextMarkers);
        setLoading(false);
      }
    }

    loadAllObservations();

    // cleanup 함수: 화면을 나갈 때 실행됨
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.0,
          longitude: 127.8,
          latitudeDelta: 5.5,
          longitudeDelta: 5.5,
        }}>
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker}
            title={`${marker.emoji} ${marker.name}`}
            description="눌러서 자세히 보기"
            onCalloutPress={() => router.push(`/fish/${marker.fishId}`)}>
            {/* Marker 안에 요소를 넣으면 기본 핀 대신 그 요소가 마커가 됩니다.
                여기서는 물고기 사진을 동그란 테두리 안에 넣었어요. */}
            <View style={styles.markerBubble}>
              {marker.image ? (
                <Image source={marker.image} style={styles.markerImage} />
              ) : (
                <Text style={styles.markerEmoji}>{marker.emoji}</Text>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1D3D47" />
          <Text style={styles.loadingText}>실제 관측 데이터 불러오는 중...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerBubble: {
    width: 44,
    height: 44,
    borderRadius: 22, // 너비의 절반 = 완전한 원
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    overflow: 'hidden', // 사진이 원 밖으로 삐져나가지 않게 잘라냄
    alignItems: 'center',
    justifyContent: 'center',
    // 지도 위에서 잘 보이도록 그림자
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  markerEmoji: {
    fontSize: 22,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingText: {
    fontSize: 14,
    color: '#333',
  },
});
