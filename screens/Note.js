import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Dimensions, Platform, Alert } from 'react-native';
import { styles } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { firebase, NOTES_REF, USERS_REF } from '../firebase/Config';
import { useTheme } from 'react-native-paper';

export default function Note({ closeModal }) {

    // Teema
    const theme = useTheme();

    // Nimetään muuttujat
    // Kortin otsikko ja kuvaus
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // Käyttäjän avain, jonka alle tallenetaan Note-kortit
    const [userKey, setUserKey] = useState('');
    // Ikkunan korkeus
    const screenHeight = Dimensions.get('window').height;

    // Sisäänkirjautuneen käyttäjän email, jolla haetaan käyttäjä tietokannasta
    let currentUserEmail = firebase.auth().currentUser.email;


    // Päivämäärä
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const wholeDate = day + "." + month + "." + year;



    // Korttien värit
    const colorList = ['#FF6B65', '#CC444B', '#C7447E', '#A858AA', '#6E6EC6', '#007FCA', '#97B33F'];
    // Asettaa värin -> listan index nro 1 on default
    const [color, setColor] = useState(colorList[1]);



    // Haetaan käyttäjä
    useEffect(() => {
        firebase.database().ref(USERS_REF)
            .orderByChild('email')
            .equalTo(currentUserEmail)
            .on('child_added', snapshot => {
                setUserKey(snapshot.key);
            });
    }, []);




    // Funktio: Jos title-kenttä ei ole tyhjä, lähetetään input-kentän tiedot tietokantaan
    // Jos title-kenttä on tyhjä, niin alert-ikkuna
    // Lisäksi input-kentät tyhjennetään, minkä jälkeen navigaatio takaisin MyNotes-sivulle
    // Funktio yhdistetty "Add Note"-painikkeeseen
    function addNewNote() {
        if (title.trim() !== "") {
            firebase.database().ref(USERS_REF).child(userKey).child(NOTES_REF)
                .push({
                    title: title,
                    description: description,
                    date: wholeDate,
                    color: color
                })
            cleanup();
        }
        else { Platform.OS === 'web' ? alert("Title required!") : Alert.alert("Title required!") }
    }



    // Navigaatio takaisin MyNotes-sivulle, sekä input-kenttien tyhjennys
    // Tämä suoritetaan silloin, kun painetaan Cancel-painiketta
    function handleCancel() {
        cleanup();
    }



    // Input-kenttien tyhjennys, sekä modalin sulku
    function cleanup() {
        setTitle('');
        setDescription('');
        closeModal(false);
    }



    // Palautettava näkymä...
    return (
        <View style={{ backgroundColor: theme.colors.background, ...styles.noteModal }}>
            <ScrollView contentContainerStyle={{ alignSelf: 'stretch', paddingTop: screenHeight * 0.20 }}>
                <KeyboardAvoidingView
                    behavior='padding'
                >
                    <View style={{ paddingHorizontal: 18 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.noteLabel}>Create a Note</Text>
                            <MaterialCommunityIcons name={"book-open"} style={{ color: color, ...styles.noteLabel }} />
                        </View>
                        <View>
                            <TextInput
                                style={{ borderColor: color, marginVertical: 12, ...styles.noteInput }}
                                placeholder="Note Title * Required"
                                value={title}
                                onChangeText={(value) => setTitle(value)}
                            />
                        </View>
                        <View>
                            <TextInput
                                multiline
                                numberOfLines={10}
                                style={{ borderColor: color, marginVertical: 12, ...styles.noteInput }}
                                placeholder="Note Description"
                                value={description}
                                onChangeText={(value) => setDescription(value)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                            {colorList.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => setColor(color)}
                                >
                                    <View
                                        style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: color }}
                                    />
                                </TouchableOpacity>

                            ))}
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{ backgroundColor: color, paddingVertical: 12, paddingHorizontal: 12, width: '100%', alignSelf: 'center', marginVertical: 6, borderRadius: 6, alignItems: 'center' }}
                                onPress={addNewNote}
                            >
                                <Text style={{ color: '#FFF', ...styles.notesBtnTxt }}>ADD NOTE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: color, paddingVertical: 12, paddingHorizontal: 12, width: '100%', alignSelf: 'center', marginVertical: 6, borderRadius: 6, alignItems: 'center' }}
                                onPress={handleCancel}
                            >
                                <Text style={{ color: '#FFF', ...styles.notesBtnTxt }}>BACK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}
