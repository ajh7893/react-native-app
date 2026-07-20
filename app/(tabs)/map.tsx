// 지도 탭: 어류가 관찰된 위치를 지도 위에 마커로 보여줍니다.
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { FISH_LIST } from '@/data/fish';

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // initialRegion: 지도가 처음 보여줄 영역. 한반도 남부가 다 들어오게 잡았습니다.
        // latitudeDelta/longitudeDelta는 "얼마나 넓게 보여줄지" (줌 레벨)
        initialRegion={{
          latitude: 35.0,
          longitude: 127.8,
          latitudeDelta: 5.5,
          longitudeDelta: 5.5,
        }}>
        {/* 어류마다 locations가 여러 개라서, 반복문이 이중으로 들어갑니다.
            flatMap: 어류 10종 × 위치 2개 = 마커 20개를 한 배열로 펼쳐줍니다. */}
        {FISH_LIST.flatMap((fish) =>
          fish.locations.map((loc, index) => (
            <Marker
              // key: 반복해서 그리는 요소마다 붙이는 고유 이름표. React가 목록을
              // 비교(diffing)할 때 어떤 마커가 어떤 마커인지 알아보는 데 씁니다.
              key={`${fish.id}-${index}`}
              coordinate={loc}
              pinColor="blue"
              title={`${fish.emoji} ${fish.name}`}
              description="눌러서 자세히 보기"
              // 마커 위에 뜨는 말풍선(callout)을 누르면 상세 화면으로 이동
              onCalloutPress={() => router.push(`/fish/${fish.id}`)}
            />
          ))
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, // 지도가 화면 전체를 채우도록
  },
});
