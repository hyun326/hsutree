import React, { useState ,useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';

const ScheduleScreen = ({ navigation }) => {
  const rows = 14; // 1교시부터 14교시
  const cols = 5; // 월요일부터 금요일
  const days = ['월', '화', '수', '목', '금'];


    // 헤더 숨기기
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);    

  const timeTable = [
    '09:00 ~ 09:50',
    '10:00 ~ 10:50',
    '11:00 ~ 11:50',
    '12:00 ~ 12:50',
    '13:00 ~ 13:50',
    '14:00 ~ 14:50',
    '15:00 ~ 15:50',
    '16:00 ~ 16:50',
    '17:00 ~ 17:50',
    '18:00 ~ 18:50',
    '18:30 ~ 19:20',
    '19:25 ~ 20:15',
    '20:20 ~ 21:10',
    '21:15 ~ 22:05',
  ];

  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () => Array(cols).fill({ lecture: '', room: '', color: '#FFFFFF' }))
  );

  // 파스텔 톤 색상을 생성하는 함수
  const generatePastelColor = () => {
    const randomValue = () => Math.floor(200 + Math.random() * 55); // RGB 값 200~255 (밝은 색상)
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
  };

  const handleCellPress = (rowIndex, colIndex) => {
    const currentCell = grid[rowIndex][colIndex];

    if (currentCell.lecture || currentCell.room) {
      // 강의명과 강의실이 이미 입력된 경우 삭제 확인
      Alert.alert(
        '삭제 확인',
        '해당 강의를 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: () => {
              const newGrid = [...grid];
              newGrid[rowIndex][colIndex] = { lecture: '', room: '', color: '#FFFFFF' };
              setGrid(newGrid);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // 강의명과 강의실이 비어있는 경우 새로 입력 받음
      Alert.prompt(
        '강의 입력',
        '강의명을 입력하세요:',
        (lecture) => {
          if (lecture) {
            Alert.prompt(
              '강의실 입력',
              '강의실을 입력하세요:',
              (room) => {
                if (room) {
                  const pastelColor = generatePastelColor(); // 파스텔 톤 색상 생성
                  const newGrid = [...grid];
                  newGrid[rowIndex][colIndex] = { lecture, room, color: pastelColor };
                  setGrid(newGrid);
                }
              }
            );
          }
        }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>시간표 관리</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={styles.timeLabel} />
          {days.map((day, index) => (
            <View key={index} style={styles.headerCell}>
              <Text style={styles.headerText}>{day}</Text>
            </View>
          ))}
        </View>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <View style={styles.timeLabel}>
              <Text style={styles.timeText}>{`${rowIndex + 1}교시`}</Text>
              <Text style={styles.timePeriod}>{timeTable[rowIndex]}</Text>
            </View>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[styles.cell, { backgroundColor: cell.color }]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell.lecture}</Text>
                <Text style={styles.cellRoom}>{cell.room}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 13,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    paddingTop: 20,
  },
  table: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  timeLabel: {
    width: 80,
    padding: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timePeriod: {
    fontSize: 12,
    color: '#666',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cellRoom: {
    fontSize: 12,
  },
});

export default ScheduleScreen;
