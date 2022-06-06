import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles';
import NoteCardContext from '../components/NoteCardContext';
import { Modal, Portal } from 'react-native-paper';
import Note from './Note';

export default function MyNotes() {

    const [modalOpen, setModalOpen] = useState(false);

    // Näytettävä näkymä
    // Sisältää komponentin NoteCardContext, jossa enemmän toimintaa/näkymä
    // Myös painike, joka ohjaa Note-sivulle, jossa varsinaisesti täytetään input-tiedot
    return (
        <View style={styles.notesContainer}>
            <View style={styles.notesCardArea}>
                <NoteCardContext />
            </View>
            <View style={styles.notesBtns}>
            <View style={styles.notesDivider} />
                <TouchableOpacity
                    style={styles.notesBtn}
                    onPress={() => setModalOpen(true)}
                >
                    <MaterialCommunityIcons name={"plus"} style={styles.notesIcon}/>
                    <Text style={styles.notesBtnTxt}>New Note</Text>
                </TouchableOpacity>
                <View style={styles.notesDivider} />
            </View>
            <Portal>
                <Modal visible={modalOpen} onDismiss={() => setModalOpen(false)} onRequestClose={() => setModalOpen(false)} animationType={'fade'}>
                    <Note closeModal={setModalOpen}/>
                </Modal>
            </Portal>
        </View>
    )
}