/* Manasi Shah */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Search from './components/Search';

export default function App() {
  return (
    <View>
      <Text style={styles.heading}>My Pets</Text>
      <Search />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 50,
    marginLeft: 15,
    fontSize: 24,
    fontWeight:'bold'
  }
});
