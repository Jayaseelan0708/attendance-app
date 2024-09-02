import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CustomModal = ({modalVisible = false, setModalVisible = () => {}}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%'}}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                    <Text style={{fontSize: 18}}>Modal Header</Text>
                </View>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 12}}>This is Body</Text>
                    <Text style={{fontSize: 12}}>This is Body</Text>
                    <Text style={{fontSize: 12}}>This is Body</Text>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                </View>
            </View>
           
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 111,
        width: '90%'
      },
    
      buttonClose: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 5
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
});

export default CustomModal;