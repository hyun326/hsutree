import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Dialog from 'react-native-dialog';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const ScheduleScreen = ({ navigation }) => {
  const rows = 14;
  const cols = 5;
  const days = ['월', '화', '수', '목', '금'];

  const viewShotRef = useRef();

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

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [lecture, setLecture] = useState('');
  const [room, setRoom] = useState('');
  const [optionDialogVisible, setOptionDialogVisible] = useState(false);
  const [lectureRoomColorMap, setLectureRoomColorMap] = useState({});

  const generatePastelColor = () => {
    const randomValue = () => Math.floor(200 + Math.random() * 55);
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
  };

  const handleCellPress = (rowIndex, colIndex) => {
    const currentCell = grid[rowIndex][colIndex];
    setSelectedCell({ rowIndex, colIndex });

    if (currentCell.lecture || currentCell.room) {
      setOptionDialogVisible(true);
    } else {
      setLecture('');
      setRoom('');
      setDialogVisible(true);
    }
  };

  const handleSave = (lecture, room) => {
    if (lecture && room && selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const lectureRoomKey = `${lecture}-${room}`;
      const existingColor = lectureRoomColorMap[lectureRoomKey];

      const pastelColor = existingColor || generatePastelColor();
      if (!existingColor) {
        setLectureRoomColorMap((prevMap) => ({
          ...prevMap,
          [lectureRoomKey]: pastelColor,
        }));
      }

      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = { lecture, room, color: pastelColor };
      setGrid(newGrid);
      setDialogVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = { lecture: '', room: '', color: '#FFFFFF' };
      setGrid(newGrid);
      setOptionDialogVisible(false);
    }
  };

  const handleMapNavigation = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const currentCell = grid[rowIndex][colIndex];
      if (currentCell.room) {
        navigation.navigate('Map', { room: currentCell.room });
      } else {
        Alert.alert('오류', '강의실 정보가 없습니다.');
      }
      setOptionDialogVisible(false);
    }
  };

  const handleEdit = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const currentCell = grid[rowIndex][colIndex];
      setLecture(currentCell.lecture);
      setRoom(currentCell.room);
      setDialogVisible(true);
      setOptionDialogVisible(false);
    }
  };

  const handleResetSchedule = () => {
    setGrid(Array.from({ length: rows }, () => Array(cols).fill({ lecture: '', room: '', color: '#FFFFFF' })));
    setLectureRoomColorMap({});
    Alert.alert('성공', '시간표가 초기화되었습니다.');
  };

  const captureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (uri) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('오류', '스크린샷을 생성할 수 없습니다.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      Alert.alert('오류', '공유 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: 30 }]}>
        <Text style={styles.title}>시간표 관리</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={captureAndShare}>
            <Text style={styles.shareButtonText}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetSchedule}>
            <Text style={styles.resetButtonText}>초기화</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.viewShot}>
        <ScrollView contentContainerStyle={styles.table}>
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
        </ScrollView>
      </ViewShot>

      {/* 강의 추가/수정 다이얼로그 */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>강의 입력</Dialog.Title>
        <Dialog.Input
          placeholder="강의명을 입력하세요"
          value={lecture}
          onChangeText={(text) => setLecture(text)}
        />
        <Dialog.Input
          placeholder="강의실을 입력하세요"
          value={room}
          onChangeText={(text) => setRoom(text)}
        />
        <Dialog.Button label="취소" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="확인" onPress={() => handleSave(lecture, room)} />
      </Dialog.Container>

      {/* 옵션 다이얼로그 */}
      <Dialog.Container visible={optionDialogVisible}>
        <Dialog.Title>옵션 선택</Dialog.Title>
        <Dialog.Button label="삭제" onPress={handleDelete} />
        <Dialog.Button label="수정" onPress={handleEdit} />
        <Dialog.Button label="강의실 위치 보기" onPress={handleMapNavigation} />
        <Dialog.Button label="취소" onPress={() => setOptionDialogVisible(false)} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF6666',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewShot: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  table: {
    flexGrow: 1,
    padding: 5,
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
