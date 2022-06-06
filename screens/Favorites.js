import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
//import { testiDataFavorites } from '../testiDataFavorites'
import { styles, ids } from '../styles';
import { Modal, Text, Portal, IconButton, Card, Caption, ActivityIndicator, useTheme } from 'react-native-paper';
import RecipeModal from '../components/RecipeModal';
import { firebase, USERS_REF } from '../firebase/Config';
import { config } from '../components/config';

const Favorites = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const theme = useTheme();
    const [modalRecipe, setModalRecipe] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteCount, setFavoriteCount] = useState(0)
    const [recipeData, setRecipeData] = useState([]);

    function showModal(recipe) {
        setModalRecipe(recipe);
        setModalVisible(true);
    }

    async function fetchFavorites(ids) {
        if (ids) {
            let url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&includeNutrition=true&apiKey=${config.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.totalResults !== 0) {
                setRecipeData(data);
            }
        } else {
            console.log('No favorites')
        }
        setLoading(false);
    }

    function removeFromFavorites(recipe) {
        let index = favoriteIds.indexOf(recipe.id);
        const copy = [...favoriteIds];
        copy.splice(index, 1);
        firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').set(copy);
        setFavoriteIds(copy);
    }

    function addToFavorites(recipe) {
        let newArr = [...favoriteIds, recipe.id]
        firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').set(
            [...favoriteIds, recipe.id]
        )
        setFavoriteIds(newArr)
    }

    useEffect(() => {
        let tempArr = [];
        firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').once('value', snapshot => {
            {
                firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').on('value', snapshot => {
                    setFavoriteCount(snapshot.numChildren())
                    let data = snapshot.val() ? snapshot.val() : [];
                    if (data) {
                        setFavoriteIds([...data]);
                        fetchFavorites([...data].join())
                    }
                })
                setLoading(false)
            }
        })
    }, [])

    return (
        <ScrollView>
            {/* Tulostetaan reseptilaatikot jos url haku löytää reseptejä ja ei lataa, muuten näytä latausympyrä */}
            {!loading ?         
             <>
                {favoriteIds.length > 0 && recipeData.length > 0 ?
                    <View style={styles.scrollContent}>
                        {recipeData.map((recipe) => {
                            return (
                                <Card key={recipe.id} mode='elevated' style={{ ...styles.recipeContainer, backgroundColor: theme.colors.card }} dataSet={{ media: ids.recipeContainer }}>
                                    <TouchableOpacity onPress={() => showModal(recipe)}>
                                        <Card.Cover source={{ uri: recipe.image }} style={styles.recipeImage} resizeMode={'cover'} />
                                    </TouchableOpacity>
                                    <IconButton icon={'heart-minus-outline'} color='lightgray' style={styles.favoriteIcon} onPress={() => removeFromFavorites(recipe)} />
                                    <Card.Title titleStyle={styles.cardTitle} title={recipe.title} style={{ minHeight: 20, paddingVertical: 10 }} />
                                </Card>
                            )
                        })}
                    </View>
                    :null}
           </>
                //Latausympyrä 
                : <ActivityIndicator size="large" color='#80CDE5' style={{ marginTop: 20, alignSelf: 'center' }} />
            }
            {modalVisible ?
                <Portal>
                    <Modal visible={true} onDismiss={() => setModalVisible(false)} onRequestClose={() => setModalVisible(false)} animationType={'fade'}>
                        {/* RecipeModal komponentti modalReseptiin tallennetuilla tiedoilla */}
                        <RecipeModal recipe={modalRecipe} />
                        {/* Ponnahdusikkunan sulkunappi, ei komponentissa koska useState ohjaus tällä sivulla */}
                        <IconButton icon='close' color={'#DD5A67'} size={32} onPress={() => setModalVisible(false)} style={styles.modalBtn} />
                    </Modal>
                </Portal>
                : null}
        </ScrollView>
    )
}

export default Favorites
