import React, {useState} from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity,} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

type ItemData = {
  name: string;
  apg: string;
  ppg: string;
  rpg: string;
  age: integer;
  height: string;
  weight: string;
  image: string;

};

const DATA: ItemData[] = [
  {
     name: 'Chris Bosch';
     apg: '33',
     ppg: '30',
     rpg: '4',
     age: 23,
     height: '1,98 m',
     weight: '85 Kg'
     image: 'https://2kdb.net/_next/image?url=https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F25%2F2556557.png%3FupdatedAt%3D1731529273856&w=384&q=75',
  },
  {
     name: 'Lebron James',
     apg: '6.0',
     ppg: '26.0',
     rpg: '5.2',
     age: 38,
     height: '2,06 m',
     weight: '113 Kg'
     image: 'https://2kdb.net/storage/players/23/lebron_james_63022.jpg',
  },
  {
    name: 'Stephen Curry',
    apg: '19',
    ppg: '27',
    rpg: '5',
    age: 34,
    height: '1,83 m',
    weight: '93 Kg'
    image: 'https://2kdb.net/storage/players/23/stephen_curry_63005.jpg',
  },
  {
      name: 'Jayson Tatum',
     apg: '11',
     ppg: '29',
     rpg: '7.1',
     age: 25,
     height: '2,03 m',
     weight: '95 Kg'
     image: 'https://2kdb.net/storage/players/23/jayson_tatum_63046.jpg',
      },
  {
      name: 'Kemba Walker',
     apg: '5.9',
     ppg: '25.0',
     rpg: '4.1',
     age: 29,
     height: '1,83 m',
     weight: '84 Kg'
     image: 'https://2kdb.net/storage/players/23/kemba_walker_62304.jpg',
      },
  {
        name: 'Joel Embiid',
      apg: '4.5',
      ppg: '22.0',
      rpg: '3.5',
      age: 30,
      height: '2,13 m',
      weight: '127 Kg'
      image: 'https://2kdb.net/storage/players/23/joel_embiid_62988.jpg',
      },
    {
          name: 'Nikola Jokic',
     apg: '5.0',
     ppg: '23.0',
     rpg: '4.1',
     age: 27,
     height: '2,11 m',
     weight: '129 Kg'
     image: 'https://2kdb.net/storage/players/23/nikola_jokic_63039.jpg',
        },
      {
            name: 'Rusell Westbrook';
     apg: '6.0',
     ppg: '25.0',
     rpg: '5.9',
     age: 35,
     height: '1,93 m',
     weight: '91 Kg'
     image: 'https://2kdb.net/storage/players/23/russell_westbrook_15267.jpg',
          },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;