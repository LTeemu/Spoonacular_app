import React from 'react'
import { View } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTheme, Avatar, Title, Caption, Paragraph, Drawer, TouchableRipple, Switch, Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { logout } from '../components/Auth';
import firebase from 'firebase/compat';
import { CommonActions } from '@react-navigation/native';

const DrawerContent = (props) => {
    const theme = useTheme();
    const loggedIn = firebase.auth().currentUser ? true : false;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <DrawerContentScrollView {...props} >
                <View style={{ ...styles.flexRow, alignContent: 'center', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                    <Avatar.Image source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }} size={50} />
                    <Title style={{ ...styles.textSmall, alignSelf: 'flex-end', marginLeft: 10, fontWeight: '600' }}>
                        <Text style={{ color: theme.colors.background }}>{loggedIn ? firebase.auth().currentUser.email : 'Guest'}</Text>
                    </Title>
                </View>
                <DrawerItem style={styles.drawerBtn} label='Recipes' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => props.navigation.navigate('Recipes')} />
                {loggedIn ? <DrawerItem style={styles.drawerBtn} label='Favorites' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => props.navigation.navigate('Favorites')} /> : null}
                <DrawerItem style={styles.drawerBtn} label='Chatbot' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => props.navigation.navigate('Chatbot')} />
                {loggedIn ? <DrawerItem style={styles.drawerBtn} label='Notes' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => props.navigation.navigate('Notes')} /> : null}
            </DrawerContentScrollView>
            <Drawer.Section style={{ bottom: 0 }}>
                {loggedIn ? <DrawerItem style={styles.drawerBtn} label='Log out' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => logout().then(props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Home' },
                        ],
                    })
                ))
                } icon={({ color, size }) => (<FontAwesome5 name='sign-out-alt' color={theme.colors.background} size={styles.text.fontSize} />)} /> : null}
                {!loggedIn ? <DrawerItem style={styles.drawerBtn} label='Login' labelStyle={{ ...styles.text, color: theme.colors.background, fontWeight: '500' }} onPress={() => props.navigation.navigate('Login')} /> : null}
            </Drawer.Section>
        </View>
    )
}

export default DrawerContent