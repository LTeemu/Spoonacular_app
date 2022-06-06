import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { styles } from './styles';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './screens/Login';
import Register from './screens/Register';
import Recipelist from './screens/Recipelist';
import Favorites from './screens/Favorites';
import Chatbot from './screens/Chatbot';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerContent from './components/DrawerContent';
import { Provider as PaperProvider, DefaultTheme, Drawer, ActivityIndicator } from 'react-native-paper';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { firebase, USERS_REF } from './firebase/Config';
import MyNotes from './screens/MyNotes';
// LogBoxilla piilotetaan varoitusteksti koskien firebasen aikakytkintä androidilla
// Tähän ongelmaan ei löydy muuta ratkaisua, paitsi timerin ajan pidentäminen. Ajan pidennystä moni ei suosittele
// Nykyisellä ratkaisulla ei havaittavaa vaikutusta suorituskykyyn
// https://github.com/facebook/react-native/issues/12981
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

//#DD5A67
//#CC444B
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#CC444B', //Navigaation väri
    card: '#CC444B', //Reseptikortit, modal tekstit, login napit, valittu dropdown
    text: '#121517', //Tekstit joiden väriä ei ole erikseen vaihdettu
    background: '#F7F7F7', //Taustat, jotkut tekstit esim. login napit, valittu dropdown, kortit, navigointi
    border: '#3A302C', //Navigaation reuna
    notification: 'pink', //Ei käytössä
  },
};

//Tab navigator
function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0)

  function loadUser(user) {
    if (user) {
      setLoggedIn(true)
      firebase.database().ref(USERS_REF + firebase.auth().currentUser.uid + '/favorites').on('value', snapshot => {
        setFavoriteCount(snapshot.numChildren())
        let data = snapshot.val() ? snapshot.val() : [];
        if (data) {
          setFavoriteIds([...data]);
        }
      })
      setUserLoaded(true);
    } else {
      setLoggedIn(false);
      setUserLoaded(true);
    };
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => loadUser(user))
  }, [])

  //Ladataan google fontit
  let [fontsLoaded] = useFonts({
    'Lobster': require('./assets/fonts/Lobster-Regular.ttf'),
    'Jost': require('./assets/fonts/Jost-VariableFont_wght.ttf')
  });

  if (fontsLoaded && userLoaded) { 
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleStyle: styles.headerTitle,
          headerStyle: { backgroundColor: theme.colors.primary },
          tabBarInactiveBackgroundColor: '#E0E0E0',
          headerRight: () => (
            <TouchableOpacity onPress={() => loggedIn ? navigation.dispatch(DrawerActions.openDrawer()) : navigation.navigate('Login')}>
              <MaterialCommunityIcons name={'account'} size={32} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          ),
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: { height: 55, backgroundColor: theme.colors.primary },
          tabBarLabelStyle: styles.textSmall,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor;
            if (route.name === 'Recipes') {
              iconName = focused ? 'silverware' : 'silverware';
              iconColor = focused ? '#E0E0E0' : '#625046';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart-outline' : 'heart-outline';
              iconColor = focused ? '#E0E0E0' : '#625046';
            } else if (route.name === 'Chatbot') {
              iconName = focused ? 'robot' : 'robot';
              iconColor = focused ? '#E0E0E0' : '#625046';
            } else if (route.name === 'Notes') {
              iconName = focused ? 'lead-pencil' : 'lead-pencil';
              iconColor = focused ? '#E0E0E0' : '#625046';
            }
            return <MaterialCommunityIcons name={iconName} size={25} color={iconColor} />;
          },
          tabBarActiveTintColor: '#E0E0E0',
          tabBarInactiveTintColor: '#625046',
        })}
      >
        <Tab.Screen name="Recipes" component={Recipelist} />
        {loggedIn ? <Tab.Screen name="Favorites" component={Favorites} options={{ tabBarBadge: favoriteCount, tabBarBadgeStyle: { ...styles.textSmall, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' } }} /> : null}
        {loggedIn ? <Tab.Screen name="Notes" component={MyNotes} /> : null}
        <Tab.Screen name="Chatbot" component={Chatbot} />       
      </Tab.Navigator>
    )
  } else {return (<AppLoading />) }
}



//Drawer navigator
export default function App({ navigation }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0);

  function loadUser(user) {
    user ? setLoggedIn(true) : setLoggedIn(false);
    setUserLoaded(true);
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => loadUser(user))
  }, [])

  //Ladataan google fontit
  let [fontsLoaded] = useFonts({
    'Lobster': require('./assets/fonts/Lobster-Regular.ttf'),
    'Jost': require('./assets/fonts/Jost-VariableFont_wght.ttf')
  });

  //Latausympyrä kunnes fontit on ladannut
  if (fontsLoaded && userLoaded) {
    const Drawer = createDrawerNavigator();
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme} style={{ ...styles.container, marginTop: Constants.statusBarHeight }}>
          <Drawer.Navigator
            screenOptions={{ headerTitleStyle: styles.headerTitle, headerStyle: { backgroundColor: theme.colors.primary } }}
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={Home} options={{ headerShown: false, }} />
            <Drawer.Screen name="Login" component={Login} options={{ swipeEnabled: false, headerLeftContainerStyle: { display: 'none' } }} />
            <Drawer.Screen name="Register" component={Register} options={{ swipeEnabled: false, headerLeftContainerStyle: { display: 'none' } }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
  } else {return (<AppLoading />) }
  
}