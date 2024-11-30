import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Dialog from 'react-native-dialog';  // react-native-dialog를 import합니다.

const ScheduleScreen = ({ navigation }) => {
  const rows = 14; // 1교시부터 14교시
  const cols = 5; // 월요일부터 금요일
  const days = ['월', '화', '수', '목', '금'];

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

  const [dialogVisible, setDialogVisible] = useState(false); // 다이얼로그 상태
  const [selectedCell, setSelectedCell] = useState(null); // 선택된 셀을 저장
  const [lecture, setLecture] = useState('');  // 강의명 상태
  const [room, setRoom] = useState('');  // 강의실 상태

  // 파스텔 톤 색상을 생성하는 함수
  const generatePastelColor = () => {
    const randomValue = () => Math.floor(200 + Math.random() * 55); // RGB 값 200~255 (밝은 색상)
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
  };

  const handleCellPress = (rowIndex, colIndex) => {
    const currentCell = grid[rowIndex][colIndex];
    setSelectedCell({ rowIndex, colIndex });

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
      setDialogVisible(true);  // 다이얼로그 보이기
    }
  };

  const handleSave = (lecture, room) => {
    if (lecture && room && selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const pastelColor = generatePastelColor(); // 파스텔 톤 색상 생성
      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = { lecture, room, color: pastelColor };
      setGrid(newGrid);
      setDialogVisible(false); // 다이얼로그 닫기
    }
  };

  // 시간표 초기화
  const resetSchedule = () => {
    const resetGrid = Array.from({ length: rows }, () =>
      Array(cols).fill({ lecture: '', room: '', color: '#FFFFFF' })
    );
    setGrid(resetGrid); // 시간표 초기화
    Alert.alert('', '\n시간표가 초기화되었습니다!');
  };

  // 시간표 초기화 확인 알림
  const handleReset = () => {
    Alert.alert(
      '시간표 초기화',
      '시간표를 초기화하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel', // 취소 버튼 클릭 시 아무 일도 일어나지 않음
        },
        {
          text: '확인',
          onPress: resetSchedule, // 확인 버튼 클릭 시 초기화 실행
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: 30 }]}>
        <Text style={styles.title}>시간표 관리</Text>
        {/* 시간표 초기화 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}  // 버튼 클릭 시 초기화 확인 창 표시
        >
          <Text style={styles.buttonText}>시간표 초기화</Text>
        </TouchableOpacity>
      </View>

      {/* Dialog for lecture and room input */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>강의 입력</Dialog.Title>
        <Dialog.Input
          placeholder="강의명을 입력하세요"
          onChangeText={(text) => setLecture(text)}
        />
        <Dialog.Input
          placeholder="강의실을 입력하세요"
          onChangeText={(text) => setRoom(text)}
        />
        <Dialog.Button label="취소" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="확인" onPress={() => handleSave(lecture, room)} />
      </Dialog.Container>

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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6666',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
