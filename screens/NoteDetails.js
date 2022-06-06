import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, FlatList, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firebase, NOTES_REF, USERS_REF } from '../firebase/Config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { styles } from '../styles';

// parametrit tulevat NoteContext-komponentista
export default function NoteDetails({ closeModal, noteKey, noteTitle, noteDescription, noteColor, user, unmounted }) {

    // Nimetään muuttujat
    // Item-inputin arvo
    const [listItem, setListItem] = useState('');
    // lisättävät itemit tietokantaan
    const [items, setItems] = useState({});
    // Ladataanko
    const [loading, setLoading] = useState(false);
    // Teema
    const theme = useTheme();
    // Ikkunan korkeus
    const screenHeight = Dimensions.get('window').height;



    // UseEffect -> Haetaan tietokannasta tiedot item listiin
    useEffect(() => {
        console.log("Mounted")
        setLoading(true);
        if (!unmounted) {
            firebase.database().ref(USERS_REF + user + NOTES_REF + noteKey).child('list').on('value', querySnapShot => {
                let data = querySnapShot.val() ? querySnapShot.val() : {};
                let itemData = { ...data };
                setItems(itemData);
                setLoading(false);
            });
        }
        // cleanup -> ei memoryleak-erroria
        return () => {
            console.log("Unmounted");
            setItems({});
            unmounted = true;
        }
    }, []);



    // Lisätään NOTES_REF:n child-elementtiin, eli valittuun noteen (joka luotiin Note.js tiedostossa), uusi child-elementti "list"
    // child-elementti "list" sisältää listan sisällön (esim. kauppalistan lisätyt elementit)
    function addListItem() {
        if (listItem.trim() !== "") {
            firebase.database().ref(USERS_REF + user + NOTES_REF + noteKey).child('list').push({
                name: listItem,
                done: false
            })
            cleanup();
        }
        else{ Platform.OS === 'web' ? alert("Item required!") : Alert.alert("Item required!") }
    }


    // Funktiolla haetaan ja vaihdetaan itemin done-status. Eli onko ns. "todo" tehty vai ei
    function checkDone(key) {
        firebase.database().ref(USERS_REF + user + NOTES_REF + noteKey).child('list').child(key).once('value', snapshot => {
            firebase.database().ref(USERS_REF + user + NOTES_REF + noteKey).child('list').child(key).update({
                done: !snapshot.val().done
            })
        })
    }



    // Poistetaan listasta yksittäinen elementti avaimen mukaan
    function removeItem(key) {
        firebase.database().ref(USERS_REF + user + NOTES_REF + noteKey).child('list').child(key).remove();
    }



    // Siivotaan input kenttä
    function cleanup() {
        setListItem('');
    }



    // Asetetaan muuttujaan tietokannasta lista avaimista, jotka käydään alempana Flatlistissä
    let itemKeys = Object.keys(items);
    let count = itemKeys.length;



    // Palautettava näkymä
    // Yksittäisen Card-elementin tiedot kokonaisuudessaan
    return (
        <View style={{ backgroundColor: theme.colors.background, ...styles.noteModal }}>
                {loading ?
                <ActivityIndicator size="large" color='#80CDE5' animating={true} style={{ marginTop: 20, alignSelf: 'center' }} />
                :
                <FlatList
                    contentContainerStyle={{ alignSelf: 'stretch', paddingTop: screenHeight * 0.20 }}
                    ListHeaderComponent={
                        <View style={{ paddingHorizontal: 18 }}>
                            <View style={styles.DetailPageInfo}>
                                <Text style={styles.noteLabel}>{noteTitle}</Text>
                                <View style={{ borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: noteColor, borderBottomColor: noteColor }}>
                                    {noteDescription === "" ?
                                        <Text style={{ color: 'grey', ...styles.DetailPageTxt }}>No Description</Text>
                                        :
                                        <Text style={styles.DetailPageTxt}>{noteDescription}</Text>
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.itemTxt}>List items: </Text>
                                <Text style={{ color: noteColor, ...styles.itemNumber }}>{count}</Text>
                            </View>
                            <TextInput
                                style={{ borderColor: noteColor, marginVertical: 12, ...styles.noteInput }}
                                placeholder="List Item"
                                value={listItem}
                                onChangeText={(value) => setListItem(value)}
                            />
                            <TouchableOpacity
                                style={{ backgroundColor: noteColor, paddingVertical: 12, paddingHorizontal: 12, width: '100%', alignSelf: 'center', marginVertical: 6, borderRadius: 6, alignItems: 'center' }}
                                onPress={() => addListItem()}
                            >
                                <Text style={{ color: '#FFF', ...styles.notesBtnTxt }}>ADD NEW ITEM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: noteColor, paddingVertical: 12, paddingHorizontal: 12, width: '100%', alignSelf: 'center', marginVertical: 6, borderRadius: 6, alignItems: 'center' }}
                                onPress={() => {
                                    closeModal(false)
                                    cleanup();
                                }}
                            >
                                <Text style={{ color: '#FFF', ...styles.notesBtnTxt }}>BACK</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    data={itemKeys.reverse()}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    renderItem={({ item }) => (
                        <>
                            <KeyboardAvoidingView
                                behavior='padding'
                            >
                                <View key={item} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 6, marginVertical: 6, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={!items[item].done ? { backgroundColor: noteColor, borderRadius: 50, padding: 4 } : { backgroundColor: 'gray', borderRadius: 50, padding: 4 }}
                                        onPress={() => checkDone(item)}
                                    >
                                        <MaterialCommunityIcons name={!items[item].done ? 'checkbox-blank-outline' : 'checkbox-intermediate'} style={styles.noteRemove} />
                                    </TouchableOpacity>
                                    <Text numberOfLines={2} style={!items[item].done ? { color: 'black', paddingHorizontal: 6 } : { color: 'gray', textDecorationLine: 'line-through', paddingHorizontal: 6 }}>{items[item].name}</Text>
                                    <TouchableOpacity
                                        style={!items[item].done ? { backgroundColor: noteColor, borderRadius: 50, padding: 4 } : { backgroundColor: 'gray', borderRadius: 50, padding: 4 }}
                                        onPress={() => removeItem(item)}
                                    >
                                        <MaterialCommunityIcons name={"delete"} solid style={styles.noteRemove} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 1, backgroundColor: noteColor, marginHorizontal: 18 }} />
                            </KeyboardAvoidingView>
                        </>
                    )}
                    // Tämä ei käytössä, mutta voisi siis lisätä jotain tänne footeriin (modalin pohja)
                    // ListFooterComponent={
                    //     <View style={{ paddingHorizontal: 18 }}>

                    //     </View>
                    // }
                    >
                    </FlatList>
                }
        </View>
    )
}
