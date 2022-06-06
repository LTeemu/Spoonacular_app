import React, { useState } from "react";
import { styles } from '../styles';
import { Alert, Text, View, TouchableOpacity, Platform } from "react-native";
import { useTheme, TextInput } from 'react-native-paper';
import { register } from '../components/Auth';
import firebase from "firebase/compat";

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clearState = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    async function handlePress() {
        if (!email) {
            Platform.OS === 'web' ? alert('Email is required.') : Alert.alert('Email is required.');
        } else if (!password) {
            Platform.OS === 'web' ? alert('Password is required.') : Alert.alert('Password is required.');
        } else if (!confirmPassword) {
            setPassword(' ');
            Platform.OS === 'web' ? alert('Confirming password is required.') : Alert.alert('Confirming password is required.');
        } else if (password !== confirmPassword) {
            Platform.OS === 'web' ? alert('Password does not match!') : Alert.alert('Password does not match!');
        } else {
            await register(email, password).then(await function () {            
                if (firebase.auth().currentUser) {
                    clearState();
                    navigation.navigate('Recipes');
                }
            })
        }
    };

    const theme = useTheme();
    // tiloja joita kutsutaan salasanan paljastukseen ja napin toimintaan
    const [data, setData] = useState({
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        confirm_password: '',
    });
    // "password" syöttö muuttuu näkyväksi toiminnalisuus
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }
    // "confirm password" syöttö muuttuu näkyväksi toiminnalisuus 
    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }
    // nappi toiminnallisuus: password
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    // nappi toiminnallisuus: confirm password
    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
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
                    onChangeText={email => setEmail(email)}
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
                    onChangeText={password => setPassword(password)}
                    autoCapitalize="none"
                    mode='outlined'
                    // painettava nappi josta salasanan voi saada näkyville
                    right={<TextInput.Icon name={data.secureTextEntry ? "eye-off" : "eye"} color={'#A3A3A3'} onPress={() => updateSecureTextEntry()} />}
                />
            </View>
            <View style={styles.logininputView}>
                { /* salasanan piilotus ja input */}
                <TextInput
                    style={styles.loginTextInput}
                    placeholder="Confirm password"
                    placeholderTextColor={'#A3A3A3'}
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    onChangeText={(val) => handleConfirmPasswordChange(val)} autoCapitalize="none"
                    value={confirmPassword}
                    onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    autoCapitalize="none"
                    mode='outlined'
                    // painettava nappi josta salasanan voi saada näkyville
                    right={<TextInput.Icon name={data.confirm_secureTextEntry ? "eye-off" : "eye"} color={'#A3A3A3'} onPress={() => updateConfirmSecureTextEntry()} />}
                />
            </View>
            { /* Login nappi */}
            <TouchableOpacity onPress={handlePress} style={{ ...styles.loginBtn, backgroundColor: theme.colors.card }}>
                <Text style={{ ...styles.btnText, color: theme.colors.background }}>Register</Text>
            </TouchableOpacity>
            { /* register nappi joka vie register sivulle */}
            <TouchableOpacity style={{ ...styles.registerBtn, backgroundColor: theme.colors.card }} onPress={() => navigation.navigate('Login')}>
                <Text style={{ ...styles.btnText, color: theme.colors.background }}>Already have an account?</Text>
            </TouchableOpacity>
        </View>
    );
}
export default Register
