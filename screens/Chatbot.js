import React, { useState, useEffect } from 'react';
import { config } from '../components/config';
import { styles, ids } from '../styles';
import { filter } from 'domutils';
import { View, Text, TouchableOpacity, Linking, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Card, IconButton, TextInput, useTheme } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [fetchData, setFetchData] = useState(null);
    const [isLoading, setIsLoading ] = useState(false);
    const theme = useTheme();
    const screenHeight = Dimensions.get('window').height;
    const headerHeight = useHeaderHeight();
    const bottomNavHeight = useBottomTabBarHeight();

    async function askBot() {
        setIsLoading(true);
        // Replaces whitespace in URL with "+"
        let result = input.replace(/\s+/g, '+');
        let url = (`https://api.spoonacular.com/food/converse?text=${result}&apiKey=${config.apiKey}`);
        const response = await fetch(url);
        const botData = await response.json();
        setFetchData(botData); 
        setIsLoading(false);
    }

    const resetSearch = () => {
        setFetchData("");
        setInput("");
    }
    
    return (
        <ScrollView style={{marginHorizontal: 10, height: screenHeight - headerHeight - bottomNavHeight}}>
            <View style={styles.inputBarContainer}>
                <View style={{...styles.textInputContainer, borderBottomLeftRadius: 0}}>
                    <TextInput placeholder="Ask chatbot.." placeholderTextColor={'#A3A3A3'} style={{ ...styles.textInput, height: 40, borderBottomLeftRadius: 0 }} 
                    value={input} onChangeText={(input) => setInput(input)} 
                    right={ fetchData ? <TextInput.Icon name="close" onPress={() => resetSearch()} /> : null } />
                </View>
                <View style={styles.addBtnContainer}>
                    <TouchableOpacity style={styles.addBtn} onPress={() => askBot(input)}>
                    <Text style={{ ...styles.btnText, color: '#3B2F2F' }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {isLoading ?
                <ActivityIndicator size="large" color='#80CDE5' style={{ marginTop: 20, alignSelf: 'center' }} />
                : 
            <>
                {fetchData ?
                <View>
                    <Text style={styles.text}>{fetchData.answerText}</Text>
                    <View style={{...styles.flexRow, flexWrap: 'wrap'}}>                       
                        {fetchData.media ? fetchData.media.map((botAnswer) => {
                            return (
                                <Card key={botAnswer.link} mode='elevated' style={{ ...styles.recipeContainer, backgroundColor: theme.colors.card }} dataSet={{ media: ids.recipeContainer }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(botAnswer.link)}>
                                    <Card.Cover source={{ uri: botAnswer.image }} style={styles.recipeImage} resizeMode={'cover'} />
                                    </TouchableOpacity>
                                    <Card.Title titleStyle={styles.cardTitle} title={botAnswer.title} style={{ minHeight: 20, paddingTop: 6 }} />
                                </Card>
                            )
                        }) : null}
                    </View>
                </View>
                : 
                <View>
                    <Text style={styles.text}>Ask for recipes like 'chicken recipes'.</Text>
                    <Text style={styles.text}>Ask for nutrient contents like 'vitamin a in 2 carrots'.</Text>
                    <Text style={styles.text}>Convert something with '2 cups of butter in grams'.</Text>
                    <Text style={styles.text}>Find food substitutes, say 'what is a substitute for flour'.</Text>
                    <Text style={styles.text}>Thirsty? 'which wine goes well with spaghetti carbonara'.</Text>
                    <Text style={styles.text}>Check out foodie gifts, say 'show me some foodie gifts'.</Text>
                    <Text style={styles.text}>Want to learn some food trivia, just say 'food trivia'.</Text>
                    <Text style={styles.text}>If you want more results, just say 'more'.</Text>
                    <Text style={styles.text}>For more similar results say 'more like the first/second/third...'.</Text>
                </View> 
                }
            </>
            }
        </ScrollView>
    )
}

export default Chatbot
