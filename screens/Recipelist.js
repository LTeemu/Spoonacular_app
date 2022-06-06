import React, { useState, useRef, useEffect } from 'react';
import { Platform, TextInput, View, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
//Dropdownit
import DropDownPicker from 'react-native-dropdown-picker';
/* Testidata, jos ei halua kuluttaa API kutsuja, hakuvaihtoehdot ei vaikuta.
Käyttääksesi kommentoi const response = await fetch(url); ja const recipeData = await response.json(); riveillä 103 ja 104 ja ota tämä käyttöön */
//import { recipeData } from '../testiData';
//Tyylitiedosto
import { styles, ids } from '../styles';
//Api configista
import { config } from '../components/config';
//RecipeModal component
import RecipeModal from '../components/RecipeModal';
//React native paper
import { Modal, Text, Portal, IconButton, Card, Caption, ActivityIndicator } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import useScrollbarSize from 'react-scrollbar-size';
import { firebase, USERS_REF } from '../firebase/Config';
import AppLoading from 'expo-app-loading';

const Recipelist = ({ navigation }) => {
    function loadUser(user) {
        if (user) {
            setLoggedIn(true)
            firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').on('value', snapshot => {
                let data = snapshot.val() ? snapshot.val() : [];
                if (data) {
                    setFavoriteIds([...data]);
                }
                console.log([...data])
            })
            setUserLoaded(true);
        } else {
            setUserLoaded(true);
            setRecipeList([]);
        };
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => loadUser(user))
    }, [])

    const [loggedIn, setLoggedIn] = useState(false)
    const [userLoaded, setUserLoaded] = useState(false)

    const [favoriteIds, setFavoriteIds] = useState([]);
    const screenHeight = Dimensions.get('window').height;
    const headerHeight = useHeaderHeight();
    const bottomNavHeight = useBottomTabBarHeight();
    const theme = useTheme();
    //Haettujen reseptien tallennus
    const [recipeList, setRecipeList] = useState([]);
    //Ainesosien tallennus
    const [ingredients, setIngredients] = useState(['chili', 'corn', 'tomato']);
    //Latausympyrän ohjaus
    const [loading, setLoading] = useState(false);
    //Ainesosien TextInput
    const [input, setInput] = useState('');
    //Dietti dropdownin avauksen ohjaus
    const [openDiet, setOpenDiet] = useState(false);
    //Intolerance dropdownin avauksen ohjaus
    const [openIntolerance, setOpenIntolerance] = useState(false);
    //Ponnahdusikkunan avauksen ohjaus
    const [modalVisible, setModalVisible] = useState(false);
    //Painetun reseptin tietojen tallennus
    const [modalRecipe, setModalRecipe] = useState('');
    //Dietti vaihtoehdot ja tallennus variable
    const [selectedDiet, setSelectedDiet] = useState();
    const [dietOptions, setDietOptions] = useState([
        { label: 'None', value: '' },
        { label: 'Gluten free', value: 'gluten-free' },
        { label: 'Ketogenic', value: 'ketogenic' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Lacto-Vegetarian', value: 'lacto-vegetarian' },
        { label: 'Ovo-Vegetarian', value: 'ovo-vegetarian' },
        { label: 'Pescetarian', value: 'pescetarian' },
        { label: 'Paleo', value: 'paleo' },
        { label: 'Primal', value: 'primal' },
        { label: 'Low FODMAP', value: 'fodmap' },
        { label: 'Whole30', value: 'whole30' }
    ]);
    //Intolerance vaihtoehdot ja tallennus variable
    const [selectedIntolerances, setSelectedIntolerances] = useState([]);
    const [intoleranceOptions, setIntoleranceOptions] = useState([
        { label: 'Dairy', value: 'dairy' },
        { label: 'Egg', value: 'egg' },
        { label: 'Gluten', value: 'gluten' },
        { label: 'Grain', value: 'grain' },
        { label: 'Peanut', value: 'peanut' },
        { label: 'Seafood', value: 'seafood' },
        { label: 'Sesame', value: 'sesame' },
        { label: 'Shellfish', value: 'shellfish' },
        { label: 'Soy', value: 'soy' },
        { label: 'Sulfite', value: 'sulfite' },
        { label: 'Tree Nut', value: 'tree-nut' },
        { label: 'Wheat', value: 'wheat' }
    ]);
    const [searchShown, setSearchShown] = useState(true);

    async function getRecipes() {
        //Jos joku hakuehto annettu
        if (ingredients.length > 0 || selectedDiet || selectedIntolerances.length > 0) {
            //Latausympyrä näkyviin
            setLoading(true);
            //Rakennetaan url pätkä joka tulee complexSearch? jälkeen https://spoonacular.com/food-api/docs#Search-Recipes-Complex
            //Variable johon pätkä tallennetaan             
            var url_query = '';
            //Lisätään ainesosat yhteen linkin vaatimaan muotoon includeIngredients=butter,+potato,+egg
            if (ingredients.length > 0) {
                url_query += `includeIngredients=${ingredients[0]}`;
                for (let i = 1; i < ingredients.length; i++) {
                    url_query += ',+' + ingredients[i];
                }
            }
            //Lisätään linkkiin allergia jos annettu &intolerances=dairy,peanut,soy
            if (selectedIntolerances.length > 0) {
                url_query += ingredients.length !== 0 ? `&intolerances=${selectedIntolerances[0]}` : `intolerances=${selectedIntolerances[0]}`;
                for (let n = 1; n < selectedIntolerances.length; n++) {
                    url_query += ',' + selectedIntolerances[n];
                }
            }
            //Lisätään linkkiin dietti jos annettu &diet=vegan
            selectedDiet
                ? url_query += ingredients.length !== 0 && selectedIntolerances.length !== 0 ? `&diet=${selectedDiet}` : `diet=${selectedDiet}`
                : null;
            //Lisätään tuotettu pätkä (url_query) linkkiin includeIngredients=butter,+potato,+egg&intolerances=dairy,peanut,soy&diet=vegan
            let url = `https://api.spoonacular.com/recipes/complexSearch?${url_query}&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
            //Haetaan tiedot Spoonacular API:sta luodulla linkillä
            const response = await fetch(url);
            const recipeData = await response.json();
            //Latausympyrä piiloon
            setLoading(false);
            /* Jos haulla ei löydy reseptejä palautetaan alert, muuten reseptit käydään yksitellen läpi ja pusketaan valitut tiedot
            tempArr, joka lopuksi tallennetaan recipeList state variableen */
            if (recipeData.totalResults !== 0) {
                let tempArr = [];
                recipeData.results.map(recipe => tempArr.push({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    missingIngCount: recipe.missedIngredientCount,
                    allInfo: recipe
                }))
                setRecipeList(tempArr);
            } else {
                alert('No recipes with given search conditions.')
            }
        } else {
            alert('Search conditions empty.')
        }
    }
    //Ainesosa nappuloiden lisäys tarkistuksilla
    function addIngredient(input) {
        if (input !== '') {
            //Korvataan pilkut välillä
            let removeCommas = input.replace(/\,+/g, " ");
            //Korvataan pidemmät välit yhtellä välillä
            let removeSpaces = removeCommas.replace(/\s+/g, " ");
            //Pilkotaan string välien perusteella
            let splitResult = removeSpaces.toLowerCase().split(' ');
            //Variable johon tallennetaan filtterin läpäisseet ainesosat
            let newIngredients = [];
            //Pusketaan uudet ainekset edelliseen variableen
            splitResult.forEach(ingredient => {
                if ((!ingredients.includes(ingredient.toLowerCase()) && (ingredient !== ''))) {
                    newIngredients.push(ingredient);
                }
            });
            //Lisätään ainekset vanhaan listaan
            const copy = [...ingredients, ...newIngredients];
            setIngredients(copy);
            setInput('');
        } else {
            alert('Input empty')
        }
    }
    //Ainesosa nappuloiden poisto etsimällä index ingredients arraystä tekstin perusteella
    function removeIngredient(ing) {
        let index = ingredients.indexOf(ing);
        const copy = [...ingredients];
        copy.splice(index, 1);
        setIngredients(copy);
    }
    //Ponnahdusikkuna reseptistä
    function showModal(recipe) {
        setModalRecipe(recipe.allInfo);
        setModalVisible(true);
    }
    //Reseptin lisäys suosikkeihin
    function addToFavorites(recipe) {
        let newArr = [...favoriteIds, recipe.id]
        firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').set(
            [...favoriteIds, recipe.id]
        )
        setFavoriteIds(newArr)
    }

    function removeFromFavorites(recipe) {
        console.log(favoriteIds)
        let index = favoriteIds.indexOf(recipe.id);
        console.log(index + 'index')
        const copy = [...favoriteIds];
        copy.splice(index, 1);
        firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').set(copy);
        setFavoriteIds(copy);
    }

    //Suljetaan dietti dropdown jos intolerance avataan
    const onDietOpen = () => {
        setOpenIntolerance(false);
    }
    //Suljetaan intolerance dropdown jos dietti avataan
    const onIntoleranceOpen = () => {
        setOpenDiet(false);
    }
    const recipeScrollRef = useRef(null);
    const { scrollbarHeight, scrollbarWidth } = Platform.OS === 'windows' ? useScrollbarSize() : 0
    const containerHeight = Platform.OS === 'android' ? 130 : 135 + scrollbarHeight
    const animHeight = useRef(new Animated.Value(containerHeight)).current;
    const animOpacity = useRef(new Animated.Value(1)).current;

    const visibleSearch = () => {
        Animated.parallel([
            Animated.timing(animOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }),
            Animated.timing(animHeight, {
                toValue: containerHeight,
                duration: 600,
                useNativeDriver: false,
            })
        ]).start()
    };

    const hiddenSearch = () => {
        Animated.parallel([
            Animated.timing(animOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false
            }),
            Animated.timing(animHeight, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,

            })
        ]).start()
    };

    const scrollToTop = () => {
        recipeScrollRef.current?.scrollTo({ y: 0, animated: true })
        visibleSearch();
        setSearchShown(true);
    }

    return (
        <>
            {!searchShown ? <IconButton icon='arrow-up' color={'white'} size={26} onPress={() => scrollToTop()}
                style={styles.scrollTopBtn} /> : null}
            {/*Hakuboxi*/}
            <Animated.View style={{ ...styles.searchContainer, height: animHeight, opacity: animOpacity, zIndex: searchShown ? 1 : 0 }}>
                <View style={styles.filterBarContainer}>
                    {/* Dietti dropdown */}
                    <View style={{ width: '40%' }}>
                        <DropDownPicker
                            searchable={false}
                            placeholder="Diet"
                            open={openDiet}
                            value={selectedDiet}
                            items={dietOptions}
                            setOpen={setOpenDiet}
                            onOpen={onDietOpen}
                            setValue={setSelectedDiet}
                            setItems={setDietOptions}
                            modalTitle="Select diet"
                            modalTitleStyle={styles.dropdownModalTitle}
                            modalProps={{ animationType: 'slide', }}
                            modalContentContainerStyle={{ backgroundColor: theme.colors.background }}
                            listMode={Platform.OS === 'android' ? 'MODAL' : 'FLATLIST'}
                            containerStyle={styles.dropdownContainer}
                            dropDownContainerStyle={{ borderColor: 'rgba(0, 0, 0, 0.25)' }}
                            zIndex={5}
                            style={{ ...styles.dropdown, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                            textStyle={{ ...styles.dropdownText, color: theme.colors.text }}
                            selectedItemContainerStyle={{ ...styles.dropdownSelectedItemContainer, backgroundColor: theme.colors.card }}
                            selectedItemLabelStyle={{ color: theme.colors.background }}
                            tickIconStyle={styles.dropdownTick}
                            listItemContainerStyle={{ paddingHorizontal: 5 }}
                            maxHeight={300}
                        />
                    </View>
                    {/* Allergia dropdown */}
                    <View style={{ width: '40%' }}>
                        <DropDownPicker
                            multiple={true}
                            multipleText={'Intolerances: ' + selectedIntolerances.length}
                            searchable={false}
                            placeholder="Intolerances"
                            open={openIntolerance}
                            value={selectedIntolerances}
                            items={intoleranceOptions}
                            setOpen={setOpenIntolerance}
                            onOpen={onIntoleranceOpen}
                            setValue={setSelectedIntolerances}
                            setItems={setIntoleranceOptions}
                            modalTitle="Select intolerances"
                            modalTitleStyle={styles.dropdownModalTitle}
                            modalProps={{ animationType: 'slide' }}
                            modalContentContainerStyle={{ backgroundColor: theme.colors.background }}
                            listMode={Platform.OS === 'android' ? 'MODAL' : 'FLATLIST'}
                            containerStyle={styles.dropdownContainer}
                            dropDownContainerStyle={{ borderColor: 'rgba(0, 0, 0, 0.25)' }}
                            zIndex={5}
                            style={styles.dropdown}
                            textStyle={{ ...styles.dropdownText, color: theme.colors.text }}
                            selectedItemContainerStyle={{ ...styles.dropdownSelectedItemContainer, backgroundColor: theme.colors.card }}
                            selectedItemLabelStyle={{ color: theme.colors.background }}
                            tickIconStyle={styles.dropdownTick}
                            listItemContainerStyle={{ paddingHorizontal: 5 }}
                            maxHeight={300}
                        />
                    </View>
                    {/* Reseptihaku nappi */}
                    <View style={{ width: '20%' }}>
                        <TouchableOpacity onPress={userLoaded ? (ingredients) => getRecipes(ingredients) : null} disabled={!userLoaded} style={{...styles.getRecipesBtn, opacity: !userLoaded ? 0.7 : 1}}>          
                                <Text style={{ ...styles.btnText, color: theme.colors.text }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Ainesosien syöttörivi */}
                <View style={styles.inputBarContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput placeholder="Ingredients separated by , or space" placeholderTextColor={'#A3A3A3'} value={input} onChangeText={(input) => setInput(input)} style={styles.textInput} />
                    </View>
                    <View style={styles.addBtnContainer}>
                        <TouchableOpacity style={styles.addBtn} onPress={() => addIngredient(input)}><Text style={{ ...styles.btnText, color: theme.colors.text }}>Add</Text></TouchableOpacity>
                    </View>
                </View>
                {/* Ainesosa nappirivi */}
                <View>
                    <ScrollView horizontal={true} style={styles.ingredientBtnContainer} showsVerticalScrollIndicator={true}>
                        {ingredients.length > 0
                            ? ingredients.map(ing =>
                                <View key={ing} style={styles.ingredientBtn}>
                                    <Text style={{ ...styles.textSmall, color: theme.colors.text }}>{ing}</Text>
                                    <IconButton icon='close-thick' color='#DD5A67' size={styles.textSmall.fontSize} style={{ margin: 0, padding: 0 }} onPress={() => removeIngredient(ing)} />
                                </View>)
                            : <Text style={{ ...styles.textSmall, marginLeft: 5 }}>No ingredients</Text>
                        }
                    </ScrollView>
                </View>
            </Animated.View>

            <Animated.ScrollView
                onMomentumScrollEnd={(event) => {
                    const scrollY = event.nativeEvent.contentOffset.y;
                    if (event.nativeEvent.contentOffset.y > 0) {
                        hiddenSearch()
                        setSearchShown(false);
                    } else {
                        visibleSearch()
                        setSearchShown(true);
                    }
                }}
                scrollEventThrottle={1000000}
                ref={recipeScrollRef}
                style={{ ...styles.recipeListContainer, height: screenHeight - headerHeight - bottomNavHeight, backgroundColor: theme.colors.background }}
            >
                {/* Reseptilaatikot */}
                <View>
                    {/* Tulostetaan reseptilaatikot jos url haku löytää reseptejä ja ei lataa, muuten näytä latausympyrä */}
                    {recipeList && !loading ?
                        <View style={styles.scrollContent}>
                            {recipeList.map((recipe) => {
                                return (
                                    <Card key={recipe.id} mode='elevated' style={{ ...styles.recipeContainer, backgroundColor: theme.colors.card }} dataSet={{ media: ids.recipeContainer }}>
                                        <TouchableOpacity onPress={() => showModal(recipe)}>
                                            <Card.Cover source={{ uri: recipe.image }} style={styles.recipeImage} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        {firebase.auth().currentUser ? <IconButton icon={favoriteIds.includes(recipe.id) ? 'heart-minus-outline' : 'heart-plus-outline'} color='lightgray' style={styles.favoriteIcon} onPress={() => favoriteIds.includes(recipe.id) ? removeFromFavorites(recipe) : addToFavorites(recipe)} /> : null}
                                        <Card.Title titleStyle={styles.cardTitle} title={recipe.title} style={{ minHeight: 20, paddingTop: 6 }} />
                                        <Card.Content style={{ paddingBottom: 6 }}>
                                            <Caption style={{ ...styles.textSmall, letterSpacing: 0, color: 'rgba(243, 234, 227, 0.75)' }}>{recipe.missingIngCount ? `Missing ${recipe.missingIngCount} ingredients` : `Missing ${recipe.allInfo.missedIngredients.length} ingredients`}</Caption>
                                        </Card.Content>
                                    </Card>
                                )
                            })}
                        </View>
                        //Latausympyrä 
                        : <ActivityIndicator size="large" color='#80CDE5' style={{ marginTop: 20, alignSelf: 'center' }} />
                    }
                </View>
                {/* Reseptien ponnahdusikkuna */}
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
            </Animated.ScrollView >
        </>
    )
}

export default Recipelist
