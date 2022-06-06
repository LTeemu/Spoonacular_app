
import React, { useState } from "react";
import { styles } from '../styles';
import { Alert, Text, View, TouchableOpacity, Platform } from "react-native";
import { useTheme, TextInput } from 'react-native-paper';
import { login } from '../components/Auth';
import firebase from "firebase/compat";

const Login = ({ navigation }) => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const clearState = () => {
        setEmail('');
        setPassword('');
    }

    async function handlePress() {
        if (!email) {
            Platform.OS === 'web' ? alert('Email is required.') : Alert.alert('Email is required.');
        } else if (!password) {
            Platform.OS === 'web' ? alert('Password is required.') : Alert.alert('Password is required.');
        } else {
            await login(email, password).then(await function () {
                if (firebase.auth().currentUser) {
                    clearState();
                    navigation.navigate('Recipes');
                }
            })
        }
    };

    // tiloja joita kutsutaan
    const [data, setData] = useState({
        password_input: '',
        check_textInputChange: false,
        secureTextEntry: true,
    });
    // "password" syöttö muuttuu muuttuu näkyväksi toiminnalisuus
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password_input: val
        });
    }
    // nappi toiminnallisuus: "password"
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    return (
        <View style={{ ...styles.logincontainer, backgroundColor: theme.colors.background }}>
            { /* email input */}
            <View style={styles.logininputView}>
                <TextInput
                    style={styles.loginTextInput}
                    placeholder="Email"
                    placeholderTextColor={'#A3A3A3'}
                    mode='outlined'
                    value={email}
                    onChangeText={(email) => setEmail(email.trim())}
                />
            </View>
            <View style={styles.logininputView}>
                { /* salasanan piilotus ja input */}
                <TextInput
                    style={styles.loginTextInput}
                    placeholder="Password"
                    placeholderTextColor={'#A3A3A3'}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    onChangeText={(val) => handlePasswordChange(val)}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize="none"
                    mode='outlined'
                    // painettava nappi josta salasanan voi saada näkyville
                    right={<TextInput.Icon name={data.secureTextEntry ? "eye-off" : "eye"} color={'#A3A3A3'} onPress={() => updateSecureTextEntry()} />}
                />
            </View>
            { /* Login nappi */}
            <TouchableOpacity onPress={() => handlePress()} style={{ ...styles.loginBtn, backgroundColor: theme.colors.card }}>
                <Text style={{ ...styles.btnText, color: theme.colors.background }}>Login</Text>
            </TouchableOpacity>
            { /* Register nappi */}
            <TouchableOpacity style={{ ...styles.registerBtn, backgroundColor: theme.colors.card }} onPress={() => navigation.navigate('Register')}>
                <Text style={{ ...styles.btnText, color: theme.colors.background }}>Create account</Text>
            </TouchableOpacity>
            {/* Guest nappi */}
            <TouchableOpacity style={{ ...styles.registerBtn, backgroundColor: theme.colors.card }} onPress={() => navigation.navigate('Home', { screen: 'Recipes' })}>
                <Text style={{ ...styles.btnText, color: theme.colors.background }}>Continue as guest</Text>
            </TouchableOpacity>
        </View>
    );



}
export default Login
