import React, { useState, useEffect } from 'react';
import { USERS_REF, NOTES_REF, firebase } from '../firebase/Config';
import { View, Text, Platform, FlatList, Alert } from 'react-native';
import { styles } from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Card, Modal, Portal } from 'react-native-paper';
import NoteDetails from '../screens/NoteDetails';

export default function NoteCardContext() {

    // Nimetään muuttujat
    // Note-kortit
    const [notes, setNotes] = useState({});
    // Käyttäjän avain/tunnus
    const [userKey, setUserKey] = useState('');
    // Modal -> auki/kiinni
    const [modalOpen, setModalOpen] = useState(false);
    // Modal-otsikko
    const [modalTitle, setModalTitle] = useState(null);
    // Modal-kuvaus
    const [modalDescription, setModalDescription] = useState(null);
    // Modaliin asetettava värimaailma
    const [modalColor, setModalColor] = useState(null);
    // Modal-avain, jotta tunnistetaan, mikä modali näyttää mitäkin
    const [modalKey, setModalKey] = useState(null);
    // Ladataanko sisältöä
    const [loading, setLoading] = useState(false);
    // Onko komponentti mounted vai unmounted
    let unmounted = false;
    // Sisäänkirjautuneen käyttäjän email, jolla haetaan käyttäjä tietokannasta
    let currentUserEmail = firebase.auth().currentUser.email;



    // UseEffect: Jos muutoksia sivun latautuessa, haetaan tietokannasta tiedot, sekä asetetaan em. muuttujaan
    useEffect(() => {
        setLoading(true);
        if (!unmounted) {
            firebase.database().ref(USERS_REF)
                .orderByChild('email')
                .equalTo(currentUserEmail)
                .on('child_added', snapshot => {
                    firebase.database().ref(USERS_REF).child(snapshot.key).child(NOTES_REF).on('value', querySnapShot => {
                        let data = querySnapShot.val() ? querySnapShot.val() : {};
                        let noteItems = { ...data };
                        setNotes(noteItems);
                        setUserKey(snapshot.key);
                        setLoading(false);
                    });
                });
        }
        // ns. cleanup, jolla vältetään memoryleak-error
        return () => {
            unmounted = true;
            setNotes({});
        }
    }, []);



    // Funktio poistaa yksittäisen Note-kortin
    function removeCard(key) {
        firebase.database().ref(USERS_REF + userKey + NOTES_REF + [key]).remove();
    }



    // Funktio kysyy alert-ikkunalla, halutaanko Note-kortti poistaa
    const createTwoButtonAlert = (key) => {
        Platform.OS === 'web' ?
        removeCard(key)
        :
        Alert.alert(
            "Attention!",
            "Delete selected note?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        console.log("OK Pressed")
                        removeCard(key)
                    }
                }
            ]
        );
    }



    // Asetetaan muuttujaan lista tietokannan avaimista, jotka sisältävät tarvittavat muuttujat
    // Nämä muuttujat siirtyy siis Detail-modaliin
    let notesKeys = Object.keys(notes);



    // Näytettävä näkymä
    // Nämä ovat ne ns. kortit, jotka näkyvät MyNotes-sivulla NoteCardContext-elementin kohdalla
    return (
        <>
            {loading ? <ActivityIndicator animating={true} size="large" color='#80CDE5' style={{ marginTop: 20, alignSelf: 'center' }} />
                :
                <FlatList
                    data={notesKeys.reverse()}
                    keyExtractor={(item) => item}
                    horizontal={Platform.OS === 'web' ? false : true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card
                            style={Platform.OS === 'web' ? { backgroundColor: notes[item].color, ...styles.noteCards }
                                : { backgroundColor: notes[item].color, maxHeight: 480, ...styles.noteCards }
                            }
                            key={item}
                            mode='elevated'>
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <View style={{ flex: 1, justifyContent: 'space-evenly', padding: 5 }}>
                                    <Text style={styles.noteCardDate}>DCR - {notes[item].date}</Text>
                                    <Text style={styles.noteCardTitle} numberOfLines={1}>{notes[item].title}</Text>
                                    <View style={{ height: 1, backgroundColor: '#FFF', width: '70%', marginBottom: 24 }} />
                                    <Text style={styles.noteCardCounterTitle}>Items:</Text>
                                    <Text style={styles.noteCardCounter} numberOfLines={2}>{
                                        notes[item].list ? Object.keys(notes[item].list).length : 0
                                    }
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                                    <TouchableOpacity
                                        onPress={() => createTwoButtonAlert(item)}
                                    >
                                        <MaterialCommunityIcons name={"delete"} solid style={styles.noteRemove} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalTitle(notes[item].title)
                                            setModalDescription(notes[item].description)
                                            setModalColor(notes[item].color)
                                            setModalKey(item)
                                            setModalOpen(true)
                                        }}
                                        style={{ flexDirection: 'row' }}
                                    >
                                        <Text style={styles.forMore}>Click for more</Text>
                                        <MaterialCommunityIcons name={"arrow-right-circle"} solid style={styles.noteRemove} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    )}
                >
                </FlatList>
            }
            <Portal>
                <Modal visible={modalOpen} onDismiss={() => setModalOpen(false)} onRequestClose={() => setModalOpen(false)} animationType={'fade'}>
                    <NoteDetails unmounted={unmounted} closeModal={setModalOpen} noteTitle={modalTitle} noteDescription={modalDescription} noteKey={modalKey} user={userKey} noteColor={modalColor} />
                </Modal>
            </Portal>
        </>
    )
}
