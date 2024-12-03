import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Dialog from 'react-native-dialog';

const ScheduleScreen = ({ navigation }) => {
  const rows = 14; // 시간표의 행 수
  const cols = 5; // 시간표의 열 수 (요일 수)
  const days = ['월', '화', '수', '목', '금']; // 요일 표시

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
    Array.from({ length: rows }, () => Array(cols).fill({ lecture: '', room: '', color: '#FFFFFF', rowspan: 1 }))
  );

  const [dialogVisible, setDialogVisible] = useState(false); // 강의 입력 다이얼로그 상태
  const [selectedCell, setSelectedCell] = useState(null); // 선택된 셀 정보
  const [lecture, setLecture] = useState(''); // 강의명 상태
  const [room, setRoom] = useState(''); // 강의실 상태
  const [optionDialogVisible, setOptionDialogVisible] = useState(false); // 옵션 다이얼로그 상태
  const [lectureRoomColorMap, setLectureRoomColorMap] = useState({}); // 강의와 강의실의 색상 매핑

  // 파스텔 색상 생성 함수
  const generatePastelColor = () => {
    const randomValue = () => Math.floor(200 + Math.random() * 55);
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
  };

  // 셀을 클릭했을 때 처리하는 함수
  const handleCellPress = (rowIndex, colIndex) => {
    const currentCell = grid[rowIndex][colIndex];
    setSelectedCell({ rowIndex, colIndex });

    if (currentCell.lecture || currentCell.room) {
      setOptionDialogVisible(true); // 값이 있는 경우 옵션 다이얼로그 표시
    } else {
      setLecture(''); // 강의명 초기화
      setRoom(''); // 강의실 초기화
      setDialogVisible(true); // 강의 입력 다이얼로그 표시
    }
  };

  // 강의를 저장하는 함수
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
      let rowspan = 1;

      // 같은 열에서 연속된 강의 확인
      for (let i = rowIndex + 1; i < rows; i++) {
        if (
          newGrid[i][colIndex].lecture === '' &&
          newGrid[i][colIndex].room === ''
        ) {
          rowspan++;
        } else {
          break;
        }
      }

      // 선택된 열에 대해서만 셀 병합
      newGrid[rowIndex][colIndex] = { lecture, room, color: pastelColor, rowspan };
      for (let i = rowIndex + 1; i < rowIndex + rowspan; i++) {
        newGrid[i][colIndex] = { lecture: '', room: '', color: '#FFFFFF', rowspan: 0 }; // 병합된 셀 표시
      }

      setGrid(newGrid);
      setDialogVisible(false);
    }
  };

  // 강의를 삭제하는 함수
  const handleDelete = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const newGrid = [...grid];
      const rowspan = newGrid[rowIndex][colIndex].rowspan;

      for (let i = rowIndex; i < rowIndex + rowspan; i++) {
        newGrid[i][colIndex] = { lecture: '', room: '', color: '#FFFFFF', rowspan: 1 }; // 셀 초기화
      }

      setGrid(newGrid);
      setOptionDialogVisible(false);
    }
  };

  // 강의실 위치를 지도에서 확인하는 함수
  const handleMapNavigation = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const currentCell = grid[rowIndex][colIndex];
      if (currentCell.room) {
        navigation.navigate('Map', { room: currentCell.room }); // 강의실 정보가 있는 경우 지도 화면으로 이동
      } else {
        Alert.alert('오류', '강의실 정보가 없습니다.');
      }
      setOptionDialogVisible(false);
    }
  };

  // 강의를 수정하는 함수
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

  // 시간표를 초기화하는 함수
  const handleResetSchedule = () => {
    setGrid(Array.from({ length: rows }, () => Array(cols).fill({ lecture: '', room: '', color: '#FFFFFF', rowspan: 1 })));
    setLectureRoomColorMap({});
    Alert.alert('성공', '시간표가 초기화되었습니다.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: 30 }]}>
        <Text style={styles.title}>시간표 관리</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetSchedule}>
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
      </View>

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
              cell.rowspan > 0 && (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.cell, { backgroundColor: cell.color, height: 50 * cell.rowspan }]} // 병합된 셀의 높이를 설정
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>{cell.lecture}</Text>
                  <Text style={styles.cellRoom}>{cell.room}</Text>
                </TouchableOpacity>
              )
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
